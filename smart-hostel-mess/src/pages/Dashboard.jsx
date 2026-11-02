import {
  ArrowUpRight,
  CalendarCheck,
  Bell,
  Flame,
  Trophy,
  Utensils,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [meals, setMeals] = useState([]);
  const [menu, setMenu] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          profileResponse,
          mealsResponse,
          menuResponse,
          bookingsResponse,
          attendanceResponse,
          rewardsResponse,
          notificationsResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/student/profile",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/meals",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/menu",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/bookings/my",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/attendance/my",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/rewards/my",
            { headers }
          ),
          fetch(
            "http://localhost:5000/api/notifications/my",
            { headers }
          ),
        ]);

        const profileData =
          await profileResponse.json();

        const mealsData =
          await mealsResponse.json();

        const menuData =
          await menuResponse.json();

        const bookingsData =
          await bookingsResponse.json();

        const attendanceData =
          await attendanceResponse.json();

        const rewardsData =
          await rewardsResponse.json();

        const notificationsData =
          await notificationsResponse.json();

        if (!profileResponse.ok) {
          alert(
            profileData.message ||
              "Failed to load student profile."
          );
          return;
        }

        if (!mealsResponse.ok) {
          alert(
            mealsData.message ||
              "Failed to load meals."
          );
          return;
        }

        if (!menuResponse.ok) {
          alert(
            menuData.message ||
              "Failed to load menu."
          );
          return;
        }

        if (!bookingsResponse.ok) {
          alert(
            bookingsData.message ||
              "Failed to load bookings."
          );
          return;
        }

        if (!attendanceResponse.ok) {
          alert(
            attendanceData.message ||
              "Failed to load attendance."
          );
          return;
        }

        if (!rewardsResponse.ok) {
          alert(
            rewardsData.message ||
              "Failed to load rewards."
          );
          return;
        }

        if (!notificationsResponse.ok) {
          alert(
            notificationsData.message ||
              "Failed to load notifications."
          );
          return;
        }

        setStudent(profileData.student || null);
        setMeals(mealsData.meals || []);
        setMenu(menuData.menu || []);
        setBookings(
          bookingsData.bookings || []
        );
        setAttendance(
          attendanceData.attendance || []
        );
        setRewardPoints(
          rewardsData.totalPoints || 0
        );
        setNotifications(
          notificationsData.notifications || []
        );
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        );

        alert(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todaysMeals = meals.filter((meal) => {
    return (
      new Date(meal.mealDate)
        .toISOString()
        .split("T")[0] === today
    );
  });

  const upcomingMeal =
    todaysMeals[0] || meals[0] || null;

  const todaysBookings = bookings.filter(
    (booking) => {
      if (!booking.mealId?.mealDate) {
        return false;
      }

      const mealDate = new Date(
        booking.mealId.mealDate
      )
        .toISOString()
        .split("T")[0];

      return (
        mealDate === today &&
        booking.status === "Booked"
      );
    }
  );

  const present = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round(
          (present / attendance.length) * 100
        )
      : 0;

  const unreadNotifications =
    notifications.filter(
      (item) => item.status === "Unread"
    ).length;

  const getMenuItems = (mealId) => {
    return menu
      .filter(
        (item) =>
          item.mealId &&
          item.mealId._id === mealId
      )
      .map((item) => item.foodItem);
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
            <p className="eyebrow">
              STUDENT PORTAL
            </p>

            <h1>Student Dashboard</h1>

            <p className="page-description">
              Loading your mess information...
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">
            STUDENT PORTAL
          </p>

          <h1>
            Good morning,{" "}
            {student?.name || "Student"}
          </h1>

          <p className="page-description">
            Here's what's happening with your mess
            today.
          </p>
        </div>

        <Link
          to="/notifications"
          className="topbar-icon"
        >
          <Bell size={20} />
          {unreadNotifications > 0 && <span />}
        </Link>
      </div>

      {upcomingMeal ? (
        <section className="hero-card">
          <div className="hero-content">
            <p className="eyebrow light">
              TODAY'S MEAL
            </p>

            <h2>{upcomingMeal.mealType}</h2>

            <p className="hero-meal">
              {getMenuItems(upcomingMeal._id).length >
              0
                ? getMenuItems(
                    upcomingMeal._id
                  ).join(" • ")
                : upcomingMeal.mealName}
            </p>

            <div className="hero-meta">
              <span>
                <Flame size={16} />
                {upcomingMeal.calories || 0} kcal
              </span>

              <span>
                <Clock3 size={16} />
                Today's Menu
              </span>
            </div>

            <Link
              to="/booking"
              className="hero-button"
            >
              Book This Meal
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="hero-decoration">
            <Utensils
              size={100}
              strokeWidth={1.1}
            />
          </div>
        </section>
      ) : (
        <section className="content-card">
          <h3>No meals available</h3>
          <p>
            There are currently no meals available
            in the system.
          </p>
        </section>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <CalendarCheck size={20} />
          </div>

          <div>
            <span>Today's Booking</span>

            <strong>
              {todaysBookings.length} Meals
            </strong>

            <small
              className={
                todaysBookings.length > 0
                  ? "positive"
                  : ""
              }
            >
              {todaysBookings.length > 0
                ? "Booked"
                : "No meals booked"}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            <CalendarCheck size={20} />
          </div>

          <div>
            <span>Attendance</span>

            <strong>
              {attendancePercentage}%
            </strong>

            <small>Recorded attendance</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <Trophy size={20} />
          </div>

          <div>
            <span>Reward Points</span>

            <strong>{rewardPoints}</strong>

            <small>Keep participating</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <Bell size={20} />
          </div>

          <div>
            <span>Notifications</span>

            <strong>{unreadNotifications}</strong>

            <small>Unread messages</small>
          </div>
        </div>
      </div>

      <div className="dashboard-columns">
        <section className="content-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">MENU</p>
              <h3>Today's Menu</h3>
            </div>

            <Link
              to="/menu"
              className="view-link"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="dashboard-meals">
            {todaysMeals
              .slice(0, 3)
              .map((meal) => {
                const items = getMenuItems(
                  meal._id
                );

                return (
                  <div
                    className="dashboard-meal"
                    key={meal._id}
                  >
                    <div className="meal-time">
                      <Utensils size={18} />
                    </div>

                    <div className="meal-details">
                      <strong>
                        {meal.mealType}
                      </strong>

                      <p>
                        {items.length > 0
                          ? items.join(", ")
                          : meal.mealName}
                      </p>
                    </div>

                    <span className="calorie-tag">
                      {meal.calories || 0} kcal
                    </span>
                  </div>
                );
              })}

            {todaysMeals.length === 0 && (
              <p>
                No meals available for today.
              </p>
            )}
          </div>
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">UPDATES</p>
              <h3>Recent Notifications</h3>
            </div>

            <Link
              to="/notifications"
              className="view-link"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="notification-preview">
            {notifications.length === 0 ? (
              <p>No notifications available.</p>
            ) : (
              notifications
                .slice(0, 3)
                .map((item) => (
                  <div
                    className="notification-preview-item"
                    key={item._id}
                  >
                    <div className="notification-dot" />

                    <div>
                      <strong>
                        {item.title}
                      </strong>

                      <p>
                        {item.message}
                      </p>

                      <small>
                        {formatDate(
                          item.notificationDate
                        )}
                      </small>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>

      <section className="quick-actions">
        <div>
          <p className="eyebrow">
            SHORTCUTS
          </p>

          <h3>Quick Actions</h3>
        </div>

        <div className="quick-action-grid">
          <Link
            to="/booking"
            className="quick-action"
          >
            <CalendarCheck size={20} />
            <span>Book Meal</span>
          </Link>

          <Link
            to="/menu"
            className="quick-action"
          >
            <Utensils size={20} />
            <span>View Menu</span>
          </Link>

          <Link
            to="/nutrition"
            className="quick-action"
          >
            <Flame size={20} />
            <span>Nutrition</span>
          </Link>

          <Link
            to="/feedback"
            className="quick-action"
          >
            <Bell size={20} />
            <span>Give Feedback</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;