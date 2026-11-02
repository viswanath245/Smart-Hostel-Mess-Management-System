import { useState } from "react";
import { LockKeyhole, Mail, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function StaffLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/staff/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Staff login failed.");
        return;
      }

      localStorage.setItem("staffToken", data.token);
      localStorage.setItem("staffLoggedIn", "true");
      localStorage.setItem(
        "staff",
        JSON.stringify(data.staff)
      );

      window.dispatchEvent(new Event("staff-auth-change"));

      navigate("/staff");
    } catch (error) {
      console.error("Staff login error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo">
            <Utensils size={28} />
          </div>

          <div>
            <h1>Smart Mess</h1>
            <p>Mess Staff Portal</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <span>STAFF PORTAL</span>
            <h2>Staff Login</h2>
            <p>
              Sign in to manage meals, menus, attendance and
              mess operations.
            </p>
          </div>

          <form onSubmit={login}>
            <div className="input-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your Mail"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-demo">
            <strong>Mess Staff</strong>

            <span>
              Use your registered staff email and password.
            </span>
          </div>
        </div>

        <p className="login-footer">
          Smart Hostel Mess Management System
        </p>
        <Link to="/login" className="back-role-link">
          ← Back to Role Selection
        </Link>
      </div>
    </div>
  );
}

export default StaffLogin;