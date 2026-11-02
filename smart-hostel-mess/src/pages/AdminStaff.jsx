import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, RefreshCw, Save, X } from "lucide-react";

const API_URL = "http://localhost:5000";

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch staff");
      }

      setStaff(data.staff || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleEdit = (member) => {
    setEditingStaff(member);

    setFormData({
      name: member.name || "",
      email: member.email || "",
      role: member.role || "Mess Staff",
    });

    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setEditingStaff(null);

    setFormData({
      name: "",
      email: "",
      role: "",
    });

    setMessage("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/staff/${editingStaff._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update staff");
      }

      setMessage("Staff member updated successfully.");

      setEditingStaff(null);

      await fetchStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Link to="/login/admin/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="topbar">
          <div>
            <h1>Staff Management</h1>
            <p>Manage mess staff members.</p>
          </div>
        </div>

        <p>Loading staff...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/login/admin/dashboard" className="back-link">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="topbar">
        <div>
          <h1>Staff Management</h1>
          <p>View and manage mess staff members.</p>
        </div>

        <button className="secondary-btn" onClick={fetchStaff}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}

      {editingStaff && (
        <div className="form-card">
          <div className="section-header">
            <div>
              <h2>Edit Staff</h2>
              <p>Update staff member information.</p>
            </div>

            <button className="icon-btn" onClick={handleCancel}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  value={editingStaff.staffId || ""}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Mess Staff">Mess Staff</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button type="submit" className="primary-btn">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Staff Members</h2>
            <p>{staff.length} staff member(s) found.</p>
          </div>
        </div>

        {staff.length === 0 ? (
          <div className="empty-state">
            <p>No staff members found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>{member.staffId}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(member)}
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
};

export default AdminStaff;