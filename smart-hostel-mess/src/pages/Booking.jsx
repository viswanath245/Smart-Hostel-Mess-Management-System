import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [additional, setAdditional] = useState(false);

  const [meals, setMeals] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [mealsResponse, bookingsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/meals", {
              headers,
            }),
            fetch("http://localhost:5000/api/bookings/my", {
              headers,
            }),
          ]);

        const mealsData = await mealsResponse.json();
        const bookingsData = await bookingsResponse.json();

        if (!mealsResponse.ok) {
          alert(mealsData.message || "Failed to load meals.");
          return;
        }

        if (!bookingsResponse.ok) {
          alert(
            bookingsData.message ||
              "Failed to load your bookings."
          );
          return;
        }

        setMeals(mealsData.meals || []);
        setBookings(bookingsData.bookings || []);
      } catch (error) {
        console.error("Booking data error:", error);

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const bookMeal = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date.");
      return;
    }

    const selectedMeal = meals.find((meal) => {
      const mealDate = new Date(meal.mealDate)
        .toISOString()
        .split("T")[0];

      return (
        mealDate === date &&
        meal.mealType === mealType
      );
    });

    if (!selectedMeal) {
      alert(
        `No ${mealType.toLowerCase()} meal is available for the selected date.`
      );
      return;
    }

    try {
      setBookingLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mealId: selectedMeal._id,
            additionalMeal: additional,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to book meal.");
        return;
      }

      setBookings((current) => [
        data.booking,
        ...current,
      ]);

      setBooked(true);
      setDate("");
      setAdditional(false);
    } catch (error) {
      console.error("Meal booking error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const formatBookingDate = (dateValue) => {
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
            <p className="eyebrow">MEAL MANAGEMENT</p>
            <h1>Meal Booking</h1>
            <p className="page-description">
              Reserve your meals in advance and avoid missing
              meals.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading booking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">MEAL MANAGEMENT</p>
          <h1>Meal Booking</h1>
          <p className="page-description">
            Reserve your meals in advance and avoid missing
            meals.
          </p>
        </div>
      </div>

      {booked && (
        <div className="success-banner">
          <CheckCircle2 size={20} />

          <div>
            <strong>Meal booked successfully</strong>
            <p>Your booking has been saved.</p>
          </div>
        </div>
      )}

      <div className="booking-layout">
        <div className="content-card booking-form-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <h3>Book a Meal</h3>
              <p>Choose your preferred date and meal.</p>
            </div>
          </div>

          <form onSubmit={bookMeal}>
            <div className="form-grid">
              <div className="input-group">
                <label>Select Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Meal Type</label>

                <select
                  value={mealType}
                  onChange={(e) =>
                    setMealType(e.target.value)
                  }
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                </select>
              </div>
            </div>

            <label className="additional-meal-option">
              <input
                type="checkbox"
                checked={additional}
                onChange={(e) =>
                  setAdditional(e.target.checked)
                }
              />

              <span>
                <strong>Additional Meal</strong>

                <small>
                  Request a meal in addition to your regular
                  booking.
                </small>
              </span>
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={bookingLoading}
            >
              {bookingLoading
                ? "Booking..."
                : "Confirm Booking"}
            </button>
          </form>
        </div>

        <div className="content-card">
          <div className="card-heading">
            <div className="card-heading-icon">
              <Clock3 size={21} />
            </div>

            <div>
              <h3>Meal Schedule</h3>
              <p>Today's regular timings.</p>
            </div>
          </div>

          <div className="schedule-list">
            <div>
              <strong>Breakfast</strong>
              <span>07:30 AM – 09:00 AM</span>
            </div>

            <div>
              <strong>Lunch</strong>
              <span>12:30 PM – 02:00 PM</span>
            </div>

            <div>
              <strong>Dinner</strong>
              <span>07:30 PM – 09:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div className="card-heading-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <h3>My Bookings</h3>
            <p>Your bookings from the database.</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="schedule-list">
            {bookings.map((booking) => (
              <div key={booking._id}>
                <strong>
                  {booking.mealId?.mealType || "Meal"}
                  {booking.additionalMeal
                    ? " - Additional"
                    : ""}
                </strong>

                <span>
                  {booking.mealId?.mealName || "Unknown meal"}
                  {" • "}
                  {formatBookingDate(
                    booking.mealId?.mealDate
                  )}
                  {" • "}
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;