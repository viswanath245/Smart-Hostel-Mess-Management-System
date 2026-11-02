import {
  Utensils,
  CalendarCheck,
  Package,
  ClipboardList,
  Users,
  Trash2,
  ShoppingCart,
  LogOut,
  Truck
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();

  const staff = JSON.parse(
    localStorage.getItem("staff") || "null"
  );

  const logout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffLoggedIn");
    localStorage.removeItem("staff");

    window.dispatchEvent(
      new Event("staff-auth-change")
    );

    navigate("/staff/login");
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <p className="eyebrow">
            MESS STAFF PORTAL
          </p>

          <h1>
            Welcome, {staff?.name || "Staff"}
          </h1>

          <p className="page-description">
            Manage meals, menus and mess operations.
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <Utensils size={20} />
          </div>

          <div>
            <span>Meal Management</span>
            <strong>Active</strong>
            <small>Create and update meals</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            <CalendarCheck size={20} />
          </div>

          <div>
            <span>Attendance</span>
            <strong>Active</strong>
            <small>Record student attendance</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <Package size={20} />
          </div>

          <div>
            <span>Inventory</span>
            <strong>Active</strong>
            <small>Monitor stock</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <ShoppingCart size={20} />
          </div>

          <div>
            <span>Orders</span>
            <strong>Active</strong>
            <small>Manage ingredient orders</small>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">
              MANAGEMENT
            </p>

            <h3>Staff Operations</h3>
          </div>
        </div>

        <div className="quick-action-grid">
          <Link
            to="/staff/meals"
            className="quick-action"
          >
            <Utensils size={20} />
            <span>Manage Meals</span>
          </Link>

          <Link
            to="/staff/menu"
            className="quick-action"
          >
            <ClipboardList size={20} />
            <span>Manage Menu</span>
          </Link>

          <Link
            to="/staff/attendance"
            className="quick-action"
          >
            <CalendarCheck size={20} />
            <span>Attendance</span>
          </Link>

          <Link
            to="/staff/crowd"
            className="quick-action"
          >
            <Users size={20} />
            <span>Crowd Monitoring</span>
          </Link>

          <Link
            to="/staff/waste"
            className="quick-action"
          >
            <Trash2 size={20} />
            <span>Food Waste</span>
          </Link>

          <Link 
            to="/staff/vendors" 
            className="quick-action"
          >
            <Truck size={20} />
            <span>Vendor Management</span>
          </Link>

          <Link
            to="/staff/inventory"
            className="quick-action"
          >
            <Package size={20} />
            <span>Inventory Management</span>
          </Link>

          <Link
            to="/staff/orders"
            className="quick-action"
          >
            <ShoppingCart size={20} />
            <span>Orders Management</span>
          </Link>
        </div>
      </div>

      <div className="content-card">
        <p>
          Staff ID:{" "}
          <strong>
            {staff?.staffId || "N/A"}
          </strong>
        </p>

        <p>
          Role:{" "}
          <strong>
            {staff?.role || "Mess Staff"}
          </strong>
        </p>
      </div>
    </div>
  );
}

export default StaffDashboard;