import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reports"
        );
      }

      setReports(data);
    } catch (error) {
      console.error("Reports error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="topbar">
          <div>
            <p className="eyebrow">ADMIN</p>
            <h1>Reports & Analytics</h1>
            <p className="page-description">
              System-wide hostel mess statistics.
            </p>
          </div>
        </div>

        <div className="content-card">
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="page">
        <div className="content-card">
          <p>Unable to load reports.</p>
        </div>
      </div>
    );
  }

  const {
    overview,
    attendance,
    complaints,
    notifications,
    orders,
    rewards,
    foodWaste
  } = reports;

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
          <h1>Reports & Analytics</h1>
          <p className="page-description">
            Monitor the overall performance of the
            Smart Hostel Mess System.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchReports}
        >
          Refresh
        </button>
      </div>

      {/* OVERVIEW */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <strong>{overview.totalStudents}</strong>
            <small>Registered students</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            👨‍🍳
          </div>

          <div>
            <span>Total Staff</span>
            <strong>{overview.totalStaff}</strong>
            <small>Mess staff members</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            🍽️
          </div>

          <div>
            <span>Total Meals</span>
            <strong>{overview.totalMeals}</strong>
            <small>Meal records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            📋
          </div>

          <div>
            <span>Total Bookings</span>
            <strong>{overview.totalBookings}</strong>
            <small>Meal bookings</small>
          </div>
        </div>

      </div>

      {/* ATTENDANCE */}

      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              ATTENDANCE
            </p>

            <h3>
              Attendance Overview
            </h3>
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon icon-green">
              ✓
            </div>

            <div>
              <span>Present</span>
              <strong>{attendance.present}</strong>
              <small>Students present</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              !
            </div>

            <div>
              <span>Absent</span>
              <strong>{attendance.absent}</strong>
              <small>Students absent</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-blue">
              —
            </div>

            <div>
              <span>Missed</span>
              <strong>{attendance.missed}</strong>
              <small>Missed attendance</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              %
            </div>

            <div>
              <span>Attendance Rate</span>
              <strong>
                {attendance.attendancePercentage}%
              </strong>
              <small>Overall rate</small>
            </div>
          </div>

        </div>

      </div>

      {/* COMPLAINTS */}

      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              COMPLAINTS
            </p>

            <h3>
              Complaint Statistics
            </h3>
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              !
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {complaints.pending}
              </strong>
              <small>Pending complaints</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-blue">
              ↻
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {complaints.inProgress}
              </strong>
              <small>Being handled</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              ✓
            </div>

            <div>
              <span>Resolved</span>
              <strong>
                {complaints.resolved}
              </strong>
              <small>Resolved complaints</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              %
            </div>

            <div>
              <span>Resolution Rate</span>
              <strong>
                {complaints.resolutionPercentage}%
              </strong>
              <small>Overall resolution</small>
            </div>
          </div>

        </div>

      </div>

      {/* ORDERS */}

      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              VENDOR ORDERS
            </p>

            <h3>
              Order Statistics
            </h3>
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              🕐
            </div>

            <div>
              <span>Pending</span>
              <strong>{orders.pending}</strong>
              <small>Pending orders</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-blue">
              📦
            </div>

            <div>
              <span>Ordered</span>
              <strong>{orders.ordered}</strong>
              <small>Orders placed</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              ✓
            </div>

            <div>
              <span>Delivered</span>
              <strong>{orders.delivered}</strong>
              <small>Delivered orders</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              ×
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{orders.cancelled}</strong>
              <small>Cancelled orders</small>
            </div>
          </div>

        </div>

      </div>

      {/* REWARDS + NOTIFICATIONS */}

      <div className="stats-grid">

        <div className="content-card">

          <div className="section-header">
            <div>
              <p className="eyebrow">
                REWARDS
              </p>

              <h3>
                Reward Statistics
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              ⭐
            </div>

            <div>
              <span>Total Reward Points</span>
              <strong>
                {rewards.totalPoints}
              </strong>
              <small>
                Points earned by students
              </small>
            </div>
          </div>

        </div>

        <div className="content-card">

          <div className="section-header">
            <div>
              <p className="eyebrow">
                NOTIFICATIONS
              </p>

              <h3>
                Notification Statistics
              </h3>
            </div>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                🔔
              </div>

              <div>
                <span>Unread</span>
                <strong>
                  {notifications.unread}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-green">
                ✓
              </div>

              <div>
                <span>Read</span>
                <strong>
                  {notifications.read}
                </strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FOOD WASTE */}

      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              FOOD WASTE
            </p>

            <h3>
              Food Waste Statistics
            </h3>
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon icon-blue">
              🍲
            </div>

            <div>
              <span>Food Prepared</span>
              <strong>
                {foodWaste.totalPrepared}
              </strong>
              <small>Total recorded quantity</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-orange">
              🗑️
            </div>

            <div>
              <span>Food Wasted</span>
              <strong>
                {foodWaste.totalWasted}
              </strong>
              <small>Total recorded waste</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-green">
              %
            </div>

            <div>
              <span>Waste Percentage</span>
              <strong>
                {foodWaste.wastePercentage}%
              </strong>
              <small>Based on recorded data</small>
            </div>
          </div>

        </div>

      </div>

      {/* TOTAL RECORDS */}

      <div className="content-card">

        <div className="section-header">
          <div>
            <p className="eyebrow">
              SYSTEM RECORDS
            </p>

            <h3>
              Database Overview
            </h3>
          </div>
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <div>
              <span>Attendance Records</span>
              <strong>
                {overview.totalAttendance}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <span>Complaint Records</span>
              <strong>
                {overview.totalComplaints}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <span>Reward Records</span>
              <strong>
                {overview.totalRewards}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <span>Order Records</span>
              <strong>
                {overview.totalOrders}
              </strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminReports;