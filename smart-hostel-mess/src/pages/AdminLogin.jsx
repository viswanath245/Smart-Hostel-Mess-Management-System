import { useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/auth/login",
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
        setError(data.message || "Admin login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      window.location.href = "/login/admin/dashboard";
    } catch (error) {
      console.error("Admin login error:", error);
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-logo">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1>Smart Hostel Mess</h1>
            <p>Management System</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <span>ADMIN PORTAL</span>

            <h2>Admin Login</h2>

            <p>
              Sign in to manage students, staff,
              complaints, rewards and system operations.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>

              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your Mail"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="form-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Admin Login"}
            </button>
          </form>
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

export default AdminLogin;