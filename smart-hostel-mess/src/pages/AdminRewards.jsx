import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    studentId: "",
    pointsEarned: "",
    reason: "",
    rewardDate: ""
  });

  const [editingId, setEditingId] = useState(null);

  const getToken = () => localStorage.getItem("adminToken");

  const fetchRewards = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/rewards",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load rewards");
      }

      setRewards(data);
    } catch (error) {
      console.error("Fetch rewards error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      studentId: "",
      pointsEarned: "",
      reason: "",
      rewardDate: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.pointsEarned || !form.reason) {
      alert("Student ID, points and reason are required.");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/rewards/${editingId}`
        : "http://localhost:5000/api/admin/rewards";

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            pointsEarned: Number(form.pointsEarned),
            reason: form.reason,
            ...(form.rewardDate
              ? { rewardDate: form.rewardDate }
              : {})
          }
        : {
            studentId: form.studentId,
            pointsEarned: Number(form.pointsEarned),
            reason: form.reason,
            ...(form.rewardDate
              ? { rewardDate: form.rewardDate }
              : {})
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      alert(
        editingId
          ? "Reward updated successfully."
          : "Reward created successfully."
      );

      resetForm();
      fetchRewards();
    } catch (error) {
      console.error("Reward save error:", error);
      alert(error.message);
    }
  };

  const handleEdit = (reward) => {
    setEditingId(reward._id);

    setForm({
      studentId: reward.studentId?._id || "",
      pointsEarned: reward.pointsEarned || "",
      reason: reward.reason || "",
      rewardDate: reward.rewardDate
        ? reward.rewardDate.substring(0, 10)
        : ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reward?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/rewards/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete reward");
      }

      alert("Reward deleted successfully.");

      fetchRewards();
    } catch (error) {
      console.error("Delete reward error:", error);
      alert(error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">ADMIN</p>
            <h1>Reward Management</h1>
            <p className="page-description">
              Manage student reward points.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <Link
        to="/login/admin/dashboard"
        className="back-link"
      >
        ← Back to Dashboard
      </Link>

      <div className="topbar">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>Reward Management</h1>
          <p className="page-description">
            Create, update and manage student reward points.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              {editingId ? "EDIT REWARD" : "NEW REWARD"}
            </p>

            <h3>
              {editingId
                ? "Update Reward"
                : "Create Student Reward"}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Student MongoDB ID</label>

              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="Enter Student ObjectId"
                disabled={!!editingId}
              />
            </div>

            <div className="form-group">
              <label>Points Earned</label>

              <input
                type="number"
                name="pointsEarned"
                min="1"
                value={form.pointsEarned}
                onChange={handleChange}
                placeholder="Enter Points"
              />
            </div>

            <div className="form-group">
              <label>Reason</label>

              <input
                type="text"
                name="reason"
                maxLength="150"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter Reason"
              />
            </div>

            <div className="form-group">
              <label>Reward Date</label>

              <input
                type="date"
                name="rewardDate"
                value={form.rewardDate}
                onChange={handleChange}
              />
            </div>

          </div>

          <div style={{ marginTop: "16px" }}>

            <button
              type="submit"
              className="primary-btn"
            >
              {editingId
                ? "Update Reward"
                : "Create Reward"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* REWARD LIST */}
      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">REWARD RECORDS</p>
            <h3>All Student Rewards</h3>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={fetchRewards}
          >
            Refresh
          </button>
        </div>

        {rewards.length === 0 ? (
          <p>No reward records found.</p>
        ) : (
          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Name</th>
                  <th>Points</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {rewards.map((reward) => (
                  <tr key={reward._id}>

                    <td>
                      {reward.studentId?.studentId || "-"}
                    </td>

                    <td>
                      {reward.studentId?.name || "-"}
                    </td>

                    <td>
                      <strong>
                        +{reward.pointsEarned}
                      </strong>
                    </td>

                    <td>
                      {reward.reason}
                    </td>

                    <td>
                      {formatDate(reward.rewardDate)}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => handleEdit(reward)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() =>
                          handleDelete(reward._id)
                        }
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminRewards;