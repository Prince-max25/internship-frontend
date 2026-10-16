
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://internship-jh6u.vercel.app/api/auth/login",
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
        setError(
          data.message || "Invalid email or password."
        );

        setLoading(false);
        return;
      }

      // Save authentication token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save student information
      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      // Go to dashboard with a ONE-TIME login message
      navigate("/dashboard", {
      replace: true,
      state: {
        loginMessage: `Welcome back, ${
          data.student?.full_name || "Student"
        }! You are now logged in.`,
      },
    });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">
          <h1>Welcome Back</h1>

          <p>
            Sign in to continue to your internship account.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <div className="password-label">
              <label>
                Password
              </label>
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

            <div className="password-label">

              <Link to="/forgot-password">
                Forgot password?
              </Link>

            </div>

          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="signup-text">
          Don't have an account?{" "}

          <Link to="/signup">
            Create an account
          </Link>
        </p>

        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;
