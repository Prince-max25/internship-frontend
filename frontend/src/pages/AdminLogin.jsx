import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
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
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid username or password."
        );

        setLoading(false);
        return;
      }

      // Save admin authentication
      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      // Redirect to admin dashboard
      navigate("/admin/dashboard", {
        replace: true,
      });

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
    <div className="admin-login-page">

      <div className="admin-login-container">

        <div className="admin-brand">

          <div className="admin-logo">
            Internship<span>Portal</span>
          </div>

          <div className="admin-badge">
            ADMIN PORTAL
          </div>

        </div>


        <div className="admin-login-header">

          <h1>
            Admin Sign In
          </h1>

          <p>
            Sign in to manage internship applications
            and applicants.
          </p>

        </div>


        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-group">

            <label>
              Username or Email
            </label>

            <input
              type="text"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

          </div>


          <div className="admin-form-group">

            <div className="admin-password-label">

              <label>
                Password
              </label>

              <Link to="/admin/forgot-password">
                Forgot password?
              </Link>

            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <div className="remember-admin">

            <input
              type="checkbox"
              id="remember-admin"
            />

            <label htmlFor="remember-admin">
              Remember me
            </label>

          </div>


          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>


        <div className="admin-security-note">

          <span>
            🔒
          </span>

          <p>
            This is a restricted area. Only authorized
            administrators can access this portal.
          </p>

        </div>


        <Link
          to="/"
          className="admin-back-home"
        >
          ← Back to main portal
        </Link>

      </div>

    </div>
  );
}

export default AdminLogin;