import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] =
    useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    hostelBlock: "",
    roomNo: "",
    healthGoal: "",
  });

  const token = localStorage.getItem("adminToken");

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to load students."
        );
        return;
      }

      setStudents(data.students || []);
    } catch (error) {
      console.error(
        "Admin students fetch error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const startEdit = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      phone: student.phone || "",
      hostelBlock: student.hostelBlock || "",
      roomNo: student.roomNo || "",
      healthGoal: student.healthGoal || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      phone: "",
      hostelBlock: "",
      roomNo: "",
      healthGoal: "",
    });

    setMessage("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateStudent = async (e) => {
    e.preventDefault();

    if (!editingStudent) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to update student."
        );
        return;
      }

      setMessage(
        "Student updated successfully."
      );

      setStudents((current) =>
        current.map((student) =>
          student._id === data.student._id
            ? data.student
            : student
        )
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Admin student update error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Link
          to="/login/admin/dashboard"
          className="back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="content-card">
          <p>Loading students...</p>
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
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="topbar">
        <div>
          <p className="eyebrow">
            ADMINISTRATION
          </p>

          <h1>Student Management</h1>

          <p className="page-description">
            View and update registered students.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={fetchStudents}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="success-banner">
          <span>{message}</span>
        </div>
      )}

      {editingStudent && (
        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <Edit size={21} />
            </div>

            <div>
              <h3>Update Student</h3>

              <p>
                {editingStudent.studentId} —{" "}
                {editingStudent.email}
              </p>
            </div>
          </div>

          <form onSubmit={updateStudent}>
            <div className="form-grid">
              <div className="input-group">
                <label>Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone</label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Hostel Block</label>

                <input
                  name="hostelBlock"
                  value={form.hostelBlock}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Room Number</label>

                <input
                  name="roomNo"
                  value={form.roomNo}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Health Goal</label>

                <input
                  name="healthGoal"
                  value={form.healthGoal}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Update Student"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              STUDENT DATABASE
            </p>

            <h3>Registered Students</h3>
          </div>

          <span className="records-count">
            {students.length} students
          </span>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={28} />
            </div>

            <h3>No students found</h3>

            <p>
              There are currently no registered
              students.
            </p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Reward Points</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>

                    <td>
                      <strong>
                        {student.name}
                      </strong>
                    </td>

                    <td>{student.email}</td>

                    <td>
                      {student.hostelBlock ||
                        "-"}
                    </td>

                    <td>
                      {student.roomNo || "-"}
                    </td>

                    <td>
                      {student.rewardPoints || 0}
                    </td>

                    <td>
                      <button
                        className="secondary-button"
                        onClick={() =>
                          startEdit(student)
                        }
                      >
                        <Edit size={15} />
                        Edit
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

export default AdminStudents;