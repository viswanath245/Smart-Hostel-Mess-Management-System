import {
  History as HistoryIcon,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/history/my",
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
            data.message || "Failed to load meal history."
          );
          return;
        }

        setBookings(data.history?.bookings || []);
      } catch (error) {
        console.error("Meal history fetch error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

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
            <p className="eyebrow">RECORDS</p>
            <h1>Meal History</h1>
            <p className="page-description">
              Review your previous meal bookings.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading meal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">RECORDS</p>
          <h1>Meal History</h1>
          <p className="page-description">
            Review your previous meal bookings.
          </p>
        </div>
      </div>

      <div className="content-card">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <HistoryIcon size={28} />
            </div>

            <h3>No meal bookings yet</h3>

            <p>
              Your previous meal bookings will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="section-header">
              <div>
                <p className="eyebrow">BOOKINGS</p>
                <h3>Booking History</h3>
              </div>

              <span className="records-count">
                {bookings.length} records
              </span>
            </div>

            <div className="responsive-table">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Meal</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <span className="table-date">
                          <CalendarDays size={15} />
                          {formatDate(
                            booking.mealId?.mealDate
                          )}
                        </span>
                      </td>

                      <td>
                        {booking.mealId?.mealName ||
                          "Unknown Meal"}
                      </td>

                      <td>
                        <span className="neutral-badge">
                          {booking.additionalMeal
                            ? "Additional"
                            : "Regular"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            booking.status === "Booked"
                              ? "status-success"
                              : booking.status === "Completed"
                              ? "status-success"
                              : booking.status === "Missed"
                              ? "status-danger"
                              : "neutral-badge"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;