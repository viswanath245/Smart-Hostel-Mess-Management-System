import {
  Users,
  UserCog,
  MessageSquareWarning,
  Bell,
  Award,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("admin");

    window.dispatchEvent(
      new Event("admin-auth-change")
    );

    navigate("/login");
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>

          <h1>Admin Dashboard</h1>

          <p className="page-description">
            Manage the Smart Hostel Mess Management System.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={logout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div className="card-heading-icon">
            <UserCog size={21} />
          </div>

          <div>
            <h3>
              Welcome,{" "}
              {adminData.name || "Administrator"}
            </h3>

            <p>
              Admin ID:{" "}
              {adminData.adminId || "ADM001"}
            </p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              SYSTEM MANAGEMENT
            </p>

            <h3>Admin Controls</h3>
          </div>
        </div>

        <div className="quick-action-grid">
          <Link
            to="/login/admin/students"
            className="quick-action"
          >
            <Users size={20} />
            <span>Student Management</span>
          </Link>

          <Link
            to="/login/admin/staff"
            className="quick-action"
          >
            <Users size={22} />
            <span>Staff Management</span>
          </Link>

          <Link
            to="/login/admin/complaints"
            className="quick-action"
          >
            <Users size={22} />
            <span>Complaint Management</span>
          </Link>

          <Link
            to="/login/admin/notifications"
            className="quick-action"
          >
            <Users size={22} />
            <span>Notification Management</span>
          </Link>

          <Link
            to="/login/admin/rewards"
            className="quick-action"
          >
            <Users size={22} />
            <span>Reward Management</span>
          </Link>

          <Link
            to="/login/admin/reports"
            className="quick-action"
          >
            <Users size={22} />
            <span>Reports & Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;