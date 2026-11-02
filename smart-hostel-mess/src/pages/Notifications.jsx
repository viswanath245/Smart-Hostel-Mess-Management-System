import {
  Bell,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/notifications/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to load notifications."
          );
          return;
        }

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error(
          "Notifications fetch error:",
          error
        );

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update notification."
        );
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                status: "Read",
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Notification update error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">UPDATES</p>
            <h1>Notifications</h1>
            <p className="page-description">
              Stay updated with important mess announcements.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">UPDATES</p>
          <h1>Notifications</h1>
          <p className="page-description">
            Stay updated with important mess announcements.
          </p>
        </div>
      </div>

      <div className="notification-list-modern">
        {notifications.length === 0 ? (
          <div className="content-card">
            <p>No notifications available.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className={`notification-item ${
                notification.status === "Unread"
                  ? "unread"
                  : ""
              }`}
              key={notification._id}
              onClick={() => {
                if (notification.status === "Unread") {
                  markAsRead(notification._id);
                }
              }}
              style={{
                cursor:
                  notification.status === "Unread"
                    ? "pointer"
                    : "default",
              }}
            >
              <div className="notification-main-icon">
                <Bell size={19} />
              </div>

              <div className="notification-content">
                <div>
                  <h3>{notification.title}</h3>

                  {notification.status === "Unread" && (
                    <span className="new-badge">
                      NEW
                    </span>
                  )}
                </div>

                <p>{notification.message}</p>

                <small>
                  <Clock3 size={14} />
                  {formatDate(
                    notification.notificationDate
                  )}
                </small>
              </div>

              <CheckCircle2
                size={18}
                className="notification-check"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;