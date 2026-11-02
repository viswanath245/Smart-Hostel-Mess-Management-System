import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Save } from "lucide-react";

const API_URL = "http://localhost:5000";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch complaints.");
      }

      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = (id, status) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint._id === id
          ? { ...complaint, status }
          : complaint
      )
    );
  };

  const updateStatus = async (complaint) => {
    try {
      setUpdatingId(complaint._id);
      setMessage("");
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/complaints/${complaint._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: complaint.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update complaint.");
      }

      setMessage("Complaint status updated successfully.");

      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
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
            <h1>Complaint Management</h1>
            <p>View and manage student complaints.</p>
          </div>
        </div>

        <p>Loading complaints...</p>
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
          <h1>Complaint Management</h1>
          <p>View and manage student complaints.</p>
        </div>

        <button className="secondary-btn" onClick={fetchComplaints}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Student Complaints</h2>
            <p>{complaints.length} complaint(s) found.</p>
          </div>
        </div>

        {complaints.length === 0 ? (
          <div className="empty-state">
            <p>No complaints found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>
                      <strong>
                        {complaint.studentId?.name || "Unknown"}
                      </strong>
                      <br />
                      <small>
                        {complaint.studentId?.studentId || "-"}
                      </small>
                    </td>

                    <td>{complaint.subject}</td>

                    <td>{complaint.description}</td>

                    <td>
                      {complaint.complaintDate
                        ? new Date(
                            complaint.complaintDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          handleStatusChange(
                            complaint._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">
                          In Progress
                        </option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="primary-btn"
                        onClick={() => updateStatus(complaint)}
                        disabled={updatingId === complaint._id}
                      >
                        <Save size={15} />

                        {updatingId === complaint._id
                          ? "Saving..."
                          : "Save"}
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

export default AdminComplaints;