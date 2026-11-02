import {
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Attendance() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/attendance/my",
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
            data.message || "Failed to load attendance."
          );
          return;
        }

        setAttendance(data.attendance || []);
      } catch (error) {
        console.error("Attendance fetch error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [navigate]);

  const present = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const percentage =
    attendance.length > 0
      ? Math.round((present / attendance.length) * 100)
      : 0;

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">ATTENDANCE</p>
            <h1>Meal Attendance</h1>
            <p className="page-description">
              Track your mess attendance and participation.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">ATTENDANCE</p>
          <h1>Meal Attendance</h1>
          <p className="page-description">
            Track your mess attendance and participation.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Present</span>
            <strong>{present}</strong>
            <small>Recorded meals</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-red">
            <XCircle size={20} />
          </div>

          <div>
            <span>Absent</span>
            <strong>{attendance.length - present}</strong>
            <small>Recorded meals</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <span>Attendance</span>
            <strong>{percentage}%</strong>
            <small>Current period</small>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">HISTORY</p>
            <h3>Attendance Records</h3>
          </div>
        </div>

        <div className="responsive-table">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {formatDate(item.attendanceTime)}
                    </td>

                    <td>
                      {item.mealId?.mealName ||
                        item.mealId?.mealType ||
                        "Unknown Meal"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Present"
                            ? "status-success"
                            : "status-danger"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;