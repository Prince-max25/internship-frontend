import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
FaGraduationCap,
FaBriefcase,
FaUsers,
FaEye,
FaEyeSlash,
FaArrowLeft,
FaShieldAlt,
} from "react-icons/fa";
import "./Login.css";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

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
    setError(data.message || "Invalid email or password.");
    return;
  }

  // Save authentication token
  localStorage.setItem("token", data.token);

  // Save student information
  localStorage.setItem("student", JSON.stringify(data.student));

  // Redirect to dashboard with a one-time welcome message
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
    "Unable to connect to the server. Please check your internet connection and try again."
  );
} finally {
  setLoading(false);
}


};

return ( <div className="login-page"> <div className="login-layout">


    {/* LEFT WELCOME PANEL */}
    <section className="login-welcome">
      <Link to="/" className="login-brand">
        <span className="brand-icon">
          <FaGraduationCap />
        </span>

        <span>
          Internship<span className="brand-highlight">Portal</span>
        </span>
      </Link>

      <div className="welcome-content">
        <span className="welcome-eyebrow">
          YOUR CAREER STARTS HERE
        </span>

        <h1>
          Turn your
          <br />
          <span>ambition</span> into
          <br />
          experience.
        </h1>

        <p>
          Your next opportunity is closer than you think.
          Sign in to continue your journey, explore opportunities,
          and take the next step in your professional life.
        </p>

        <div className="welcome-features">
          <div className="welcome-feature">
            <span className="feature-icon">
              <FaBriefcase />
            </span>

            <div>
              <h3>Career opportunities</h3>
              <p>Discover opportunities that fit your goals.</p>
            </div>
          </div>

          <div className="welcome-feature">
            <span className="feature-icon">
              <FaUsers />
            </span>

            <div>
              <h3>Professional growth</h3>
              <p>Build experience for your future career.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="welcome-footer">
        <FaShieldAlt />
        <span>A smarter step toward your future.</span>
      </div>
    </section>

    {/* RIGHT LOGIN PANEL */}
    <section className="login-form-panel">
      <div className="login-mobile-brand">
        <span className="brand-icon">
          <FaGraduationCap />
        </span>

        <span>
          Internship<span className="brand-highlight">Portal</span>
        </span>
      </div>

      <div className="login-container">

        <Link to="/" className="login-back-link">
          <FaArrowLeft />
          <span>Back to home</span>
        </Link>

        <div className="login-header">
          <span className="login-welcome-label">
            WELCOME BACK
          </span>

          <h2>Sign in to your account</h2>

          <p>
            Enter your details below to access your account.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

        <div className="form-group password-form-group">
  <div className="password-label">
    <label htmlFor="login-password">Password</label>
      </div>

     

  <div className="password-input-wrapper">
    <input
      id="login-password"
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      autoComplete="current-password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

   <div>
    <Link to="/forgot-password" className="forgot-password-link">
      Forgot password?
    </Link>
  </div>

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing you in..." : "Sign In to Your Account"}
          </button>

        </form>

        <div className="login-divider">
          <span>NEW TO INTERNSHIP PORTAL?</span>
        </div>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">
            Create an account
          </Link>
        </p>

        <div className="login-security-note">
          <FaShieldAlt />
          <span>Your account information is handled securely.</span>
        </div>

      </div>

      <p className="login-copyright">
        © {new Date().getFullYear()} Internship Portal. All rights reserved.
      </p>
    </section>

  </div>
</div>


);
}

export default Login;
