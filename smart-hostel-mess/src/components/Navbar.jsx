import {
  LayoutDashboard,
  Utensils,
  CalendarDays,
  ClipboardCheck,
  Salad,
  MessageSquareText,
  Trophy,
  Bell,
  History,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("studentEmail");

  window.dispatchEvent(new Event("auth-change"));

  navigate("/login", { replace: true });
};

  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Food Menu",
      path: "/menu",
      icon: Utensils,
    },
    {
      name: "Meal Booking",
      path: "/booking",
      icon: CalendarDays,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
    },
    {
      name: "Nutrition",
      path: "/nutrition",
      icon: Salad,
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: MessageSquareText,
    },
    {
      name: "Rewards",
      path: "/rewards",
      icon: Trophy,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Meal History",
      path: "/history",
      icon: History,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Utensils size={22} />
          </div>

          <div>
            <h2>Smart Mess</h2>
            <span>Student Portal</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-section-label">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">DS</div>

            <div>
              <strong>Demo Student</strong>
              <span>Student</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;