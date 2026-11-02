import {
  UserRound,
  Mail,
  Phone,
  Building2,
  Save,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    hostelBlock: "",
    roomNo: "",
    healthGoal: "",
    rewardPoints: 0,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/student/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load profile.");
          return;
        }

        setProfile(data.student);
      } catch (error) {
        console.error("Profile fetch error:", error);
        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const update = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/student/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            hostelBlock: profile.hostelBlock,
            roomNo: profile.roomNo,
            healthGoal: profile.healthGoal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update profile.");
        return;
      }

      setProfile((current) => ({
        ...current,
        ...data.student,
      }));

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );
    } catch (error) {
      console.error("Profile update error:", error);
      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">ACCOUNT</p>
            <h1>Student Profile</h1>
            <p className="page-description">
              Manage your personal information.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>Student Profile</h1>
          <p className="page-description">
            Manage your personal information.
          </p>
        </div>
      </div>

      {saved && (
        <div className="success-banner">
          <Save size={19} />
          <span>Profile updated successfully.</span>
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-summary content-card">
          <div className="profile-avatar-large">
            DS
          </div>

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>

          <div className="profile-role">
            Student
          </div>

          <div className="profile-stat">
            <span>Student ID</span>
            <strong>{profile.studentId}</strong>
          </div>

          <div className="profile-stat">
            <span>Hostel Block</span>
            <strong>{profile.hostelBlock}</strong>
          </div>
        </div>

        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h3>Personal Information</h3>
              <p>Update your basic profile details.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Name</label>

              <div className="input-wrapper">
                <UserRound size={17} />

                <input
                  value={profile.name}
                  onChange={(e) =>
                    update("name", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>

              <div className="input-wrapper">
                <Mail size={17} />

                <input
                  value={profile.email}
                  disabled
                />
              </div>
            </div>

            <div className="input-group">
              <label>Phone</label>

              <div className="input-wrapper">
                <Phone size={17} />

                <input
                  value={profile.phone || ""}
                  onChange={(e) =>
                    update("phone", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <label>Hostel Block</label>

              <div className="input-wrapper">
                <Building2 size={17} />

                <input
                  value={profile.hostelBlock || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={saveProfile}
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;