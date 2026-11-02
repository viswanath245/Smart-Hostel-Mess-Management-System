import {
  GraduationCap,
  Users,
  ShieldCheck
} from "lucide-react";

import { Link } from "react-router-dom";

function RoleSelection() {
  return (
    <div className="role-page">
      <div className="role-container">

        <div className="role-header">

          <div className="role-logo">
            <Users size={28} />
          </div>

          <p className="role-eyebrow">
            SMART HOSTEL MESS MANAGEMENT SYSTEM
          </p>

          <h1>Welcome</h1>

          <p className="role-subtitle">
            Select your portal to continue
          </p>

        </div>

        <div className="role-grid">

          {/* STUDENT */}

          <Link
            to="/login/student"
            className="role-card"
          >
            <div className="role-icon student-icon">
              <GraduationCap size={32} />
            </div>

            <h2>Student</h2>

            <p>
              Access meals, bookings, attendance,
              nutrition, feedback and rewards.
            </p>

            <span className="role-button">
              Student Login →
            </span>
          </Link>


          {/* STAFF */}

          <Link
            to="/login/staff"
            className="role-card"
          >
            <div className="role-icon staff-icon">
              <Users size={32} />
            </div>

            <h2>Staff</h2>

            <p>
              Manage meals, menu, attendance,
              inventory, vendors, orders and operations.
            </p>

            <span className="role-button">
              Staff Login →
            </span>
          </Link>


          {/* ADMIN */}

          <Link
            to="/login/admin"
            className="role-card"
          >
            <div className="role-icon admin-icon">
              <ShieldCheck size={32} />
            </div>

            <h2>Admin</h2>

            <p>
              Manage students, staff, complaints,
              notifications, rewards and reports.
            </p>

            <span className="role-button">
              Admin Login →
            </span>
          </Link>

        </div>

        <p className="role-footer">
          Smart Hostel Mess Management System
        </p>

      </div>
    </div>
  );
}

export default RoleSelection;