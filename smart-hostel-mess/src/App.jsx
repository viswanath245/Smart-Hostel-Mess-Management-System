import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

// Layout
import Layout from "./components/Layout";

// Student pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Attendance from "./pages/Attendance";
import Nutrition from "./pages/Nutrition";
import Feedback from "./pages/Feedback";
import Rewards from "./pages/Rewards";
import Notifications from "./pages/Notifications";
import History from "./pages/History";

// Staff pages
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffMeals from "./pages/StaffMeals";
import StaffMenu from "./pages/StaffMenu";
import StaffAttendance from "./pages/StaffAttendance";
import StaffCrowd from "./pages/StaffCrowd";
import StaffWaste from "./pages/StaffWaste";
import StaffVendors from "./pages/StaffVendors";
import StaffInventory from "./pages/StaffInventory";
import StaffOrders from "./pages/StaffOrders";

// Login role selection
import RoleSelection from "./pages/RoleSelection";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminStaff from "./pages/AdminStaff";
import AdminComplaints from "./pages/AdminComplaints";
import AdminNotifications from "./pages/AdminNotifications";
import AdminRewards from "./pages/AdminRewards";
import AdminReports from "./pages/AdminReports";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );

  const [staffLoggedIn, setStaffLoggedIn] = useState(
    () => localStorage.getItem("staffLoggedIn") === "true"
  );

  const [adminLoggedIn, setAdminLoggedIn] = useState(
  () => localStorage.getItem("adminLoggedIn") === "true"
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setLoggedIn(
        localStorage.getItem("loggedIn") === "true"
      );
    };

    const handleStaffAuthChange = () => {
      setStaffLoggedIn(
        localStorage.getItem("staffLoggedIn") === "true"
      );
    };

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    window.addEventListener(
      "staff-auth-change",
      handleStaffAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );

      window.removeEventListener(
        "staff-auth-change",
        handleStaffAuthChange
      );
    };

    const handleAdminAuthChange = () => {
      setAdminLoggedIn(
      localStorage.getItem("adminLoggedIn") === "true"
      );
    };

    window.addEventListener(
      "admin-auth-change",
      handleAdminAuthChange
    );

    window.removeEventListener(
      "admin-auth-change",
      handleAdminAuthChange
    );
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            LOGIN / ROLE SELECTION
        ================================================== */}

        {/* Main login selection page */}
        <Route
          path="/login"
          element={<RoleSelection />}
        />

        {/* Student Login */}
        <Route
          path="/login/student"
          element={
            loggedIn ? (
              <Navigate
                to="/login/student/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Staff Login */}
        <Route
          path="/login/staff"
          element={
            staffLoggedIn ? (
              <Navigate
                to="/login/staff/dashboard"
                replace
              />
            ) : (
              <StaffLogin />
            )
          }
        />


        {/* ==================================================
            STUDENT APPLICATION
        ================================================== */}

        <Route
          element={
            loggedIn ? (
              <Layout />
            ) : (
              <Navigate
                to="/login/student"
                replace
              />
            )
          }
        >
          <Route
            path="/login/student/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/login/student/profile"
            element={<Profile />}
          />

          <Route
            path="/login/student/menu"
            element={<Menu />}
          />

          <Route
            path="/login/student/booking"
            element={<Booking />}
          />

          <Route
            path="/login/student/attendance"
            element={<Attendance />}
          />

          <Route
            path="/login/student/nutrition"
            element={<Nutrition />}
          />

          <Route
            path="/login/student/feedback"
            element={<Feedback />}
          />

          <Route
            path="/login/student/rewards"
            element={<Rewards />}
          />

          <Route
            path="/login/student/notifications"
            element={<Notifications />}
          />

          <Route
            path="/login/student/history"
            element={<History />}
          />
        </Route>


        {/* ==================================================
            STAFF APPLICATION
        ================================================== */}

        <Route
          element={
            staffLoggedIn ? (
              <StaffDashboard />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        >
          <Route
            path="/login/staff/dashboard"
            element={<StaffDashboard />}
          />
        </Route>

        {/* Staff individual pages */}
        <Route
          path="/login/staff/meals"
          element={
            staffLoggedIn ? (
              <StaffMeals />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/menu"
          element={
            staffLoggedIn ? (
              <StaffMenu />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/attendance"
          element={
            staffLoggedIn ? (
              <StaffAttendance />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/crowd"
          element={
            staffLoggedIn ? (
              <StaffCrowd />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/waste"
          element={
            staffLoggedIn ? (
              <StaffWaste />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/vendors"
          element={
            staffLoggedIn ? (
              <StaffVendors />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/inventory"
          element={
            staffLoggedIn ? (
              <StaffInventory />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        <Route
          path="/login/staff/orders"
          element={
            staffLoggedIn ? (
              <StaffOrders />
            ) : (
              <Navigate
                to="/login/staff"
                replace
              />
            )
          }
        />

        {/* ==================================================
            ADMIN APPLICATION
        ================================================== */}

        <Route
          path="/login/admin"
          element={
            adminLoggedIn ? (
              <Navigate
                to="/login/admin/dashboard"
                replace
              />
            ) : (
              <AdminLogin />
            )
          }
        />

        <Route
          path="/login/admin/dashboard"
          element={
            adminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <Navigate
                to="/login/admin"
                replace
              />
            )
          }
        />

        <Route
          path="/login/admin/students"
          element={
            adminLoggedIn ? (
              <AdminStudents />
            ) : (
              <Navigate
                to="/login/admin"
                replace
              />
            )
          }
        />

        <Route
          path="/login/admin/staff"
          element={
            adminLoggedIn ? (
              <AdminStaff />
            ) : (
              <Navigate to="/login/admin" replace />
            )
          }
        />

        <Route
          path="/login/admin/complaints"
          element={
            adminLoggedIn ? (
              <AdminComplaints />
            ) : (
              <Navigate to="/login/admin" replace />
            )
          }
        />

        <Route
          path="/login/admin/notifications"
          element={
            adminLoggedIn ? (
              <AdminNotifications />
            ) : (
              <Navigate to="/login/admin" replace />
            )
          }
        />

        <Route
          path="/login/admin/rewards"
          element={
            adminLoggedIn ? (
              <AdminRewards />
            ) : (
              <Navigate to="/login/admin" replace />
            )
          }
        />

        <Route
          path="/login/admin/reports"
          element={
            adminLoggedIn ? (
              <AdminReports />
            ) : (
              <Navigate to="/login/admin" replace />
            )
          }
        />


        {/* ==================================================
            OLD URL REDIRECTS
            These keep your existing buttons working.
        ================================================== */}

        {/* Old root */}
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate
                to="/login/student/dashboard"
                replace
              />
            ) : staffLoggedIn ? (
              <Navigate
                to="/login/staff/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Old student routes */}
        <Route
          path="/profile"
          element={
            <Navigate
              to="/login/student/profile"
              replace
            />
          }
        />

        <Route
          path="/menu"
          element={
            <Navigate
              to="/login/student/menu"
              replace
            />
          }
        />

        <Route
          path="/booking"
          element={
            <Navigate
              to="/login/student/booking"
              replace
            />
          }
        />

        <Route
          path="/attendance"
          element={
            <Navigate
              to="/login/student/attendance"
              replace
            />
          }
        />

        <Route
          path="/nutrition"
          element={
            <Navigate
              to="/login/student/nutrition"
              replace
            />
          }
        />

        <Route
          path="/feedback"
          element={
            <Navigate
              to="/login/student/feedback"
              replace
            />
          }
        />

        <Route
          path="/rewards"
          element={
            <Navigate
              to="/login/student/rewards"
              replace
            />
          }
        />

        <Route
          path="/notifications"
          element={
            <Navigate
              to="/login/student/notifications"
              replace
            />
          }
        />

        <Route
          path="/history"
          element={
            <Navigate
              to="/login/student/history"
              replace
            />
          }
        />


        {/* Old staff routes */}

        <Route
          path="/staff/login"
          element={
            <Navigate
              to="/login/staff"
              replace
            />
          }
        />

        <Route
          path="/staff"
          element={
            <Navigate
              to="/login/staff/dashboard"
              replace
            />
          }
        />

        <Route
          path="/staff/meals"
          element={
            <Navigate
              to="/login/staff/meals"
              replace
            />
          }
        />

        <Route
          path="/staff/menu"
          element={
            <Navigate
              to="/login/staff/menu"
              replace
            />
          }
        />

        <Route
          path="/staff/attendance"
          element={
            <Navigate
              to="/login/staff/attendance"
              replace
            />
          }
        />

        <Route
          path="/staff/crowd"
          element={
            <Navigate
              to="/login/staff/crowd"
              replace
            />
          }
        />

        <Route
          path="/staff/waste"
          element={
            <Navigate
              to="/login/staff/waste"
              replace
            />
          }
        />

        <Route
          path="/staff/vendors"
          element={
            <Navigate
              to="/login/staff/vendors"
              replace
            />
          }
        />

        <Route
          path="/staff/inventory"
          element={
            <Navigate
              to="/login/staff/inventory"
              replace
            />
          }
        />

        <Route
          path="/staff/orders"
          element={
            <Navigate
              to="/login/staff/orders"
              replace
            />
          }
        />


        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;