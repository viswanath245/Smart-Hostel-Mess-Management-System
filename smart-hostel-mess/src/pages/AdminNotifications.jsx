import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Plus,
  RefreshCw,
  Save,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    message: "",
    status: "Unread",
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch notifications."
        );
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create notification."
        );
      }

      setMessage("Notification created successfully.");

      setFormData({
        studentId: "",
        title: "",
        message: "",
        status: "Unread",
      });

      setShowForm(false);

      await fetchNotifications();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id
          ? { ...notification, status }
          : notification
      )
    );
  };

  const updateStatus = async (notification) => {
    try {
      setUpdatingId(notification._id);
      setMessage("");
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/admin/notifications/${notification._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: notification.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update notification."
        );
      }

      setMessage("Notification status updated successfully.");

      await fetchNotifications();
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
            <h1>Notification Management</h1>
            <p>Manage student notifications.</p>
          </div>
        </div>

        <p>Loading notifications...</p>
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
          <h1>Notification Management</h1>
          <p>Create and manage student notifications.</p>
        </div>

        <div className="topbar-actions">
          <button
            className="secondary-btn"
            onClick={fetchNotifications}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
              setError("");
            }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "New Notification"}
          </button>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <div className="section-header">
            <div>
              <h2>Create Notification</h2>
              <p>Send a notification to a student.</p>
            </div>
          </div>

          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student MongoDB ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentId: e.target.value,
                    })
                  }
                  placeholder="Enter student ObjectId"
                  required
                />
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Notification title"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Enter notification message"
                  maxLength={250}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={creating}
              >
                <Bell size={16} />
                {creating
                  ? "Creating..."
                  : "Create Notification"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-card">
        <div className="section-header">
          <div>
            <h2>Notifications</h2>
            <p>
              {notifications.length} notification(s) found.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id}>
                    <td>
                      <strong>
                        {notification.studentId?.name ||
                          "Unknown"}
                      </strong>
                      <br />
                      <small>
                        {notification.studentId?.studentId ||
                          "-"}
                      </small>
                    </td>

                    <td>{notification.title}</td>

                    <td>{notification.message}</td>

                    <td>
                      {notification.notificationDate
                        ? new Date(
                            notification.notificationDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <select
                        value={notification.status}
                        onChange={(e) =>
                          handleStatusChange(
                            notification._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Unread">
                          Unread
                        </option>
                        <option value="Read">
                          Read
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="primary-btn"
                        onClick={() =>
                          updateStatus(notification)
                        }
                        disabled={
                          updatingId === notification._id
                        }
                      >
                        <Save size={15} />

                        {updatingId === notification._id
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

export default AdminNotifications;