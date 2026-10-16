
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaUserPlus,
} from "react-icons/fa";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://internship-jh6u.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        "Unable to connect to the server. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-layout">

        {/* LEFT WELCOME PANEL */}
        <aside className="signup-welcome">
          <Link to="/" className="signup-brand">
            <span className="signup-brand-icon">
              <FaUserGraduate />
            </span>

            <span>Internship Portal</span>
          </Link>

          <div className="signup-welcome-content">
            <span className="signup-eyebrow">
              YOUR CAREER STARTS HERE
            </span>

            <h1>
              Turn your ambition into <span>opportunity.</span>
            </h1>

            <p>
              Create your account and take the next step toward
              meaningful internship opportunities and professional growth.
            </p>

            <div className="signup-benefits">
              <div className="signup-benefit">
                <FaCheckCircle />
                <span>Discover internship opportunities</span>
              </div>

              <div className="signup-benefit">
                <FaCheckCircle />
                <span>Manage your applications</span>
              </div>

              <div className="signup-benefit">
                <FaCheckCircle />
                <span>Take the next step in your career</span>
              </div>
            </div>
          </div>

          <div className="signup-welcome-footer">
            <FaShieldAlt />
            <span>Your journey toward professional growth starts here.</span>
          </div>
        </aside>

        {/* RIGHT SIGNUP PANEL */}
        <main className="signup-form-panel">
          <div className="signup-container">

            <Link to="/" className="signup-back-link">
              <FaArrowLeft />
              <span>Back to home</span>
            </Link>

            <div className="signup-mobile-brand">
              <FaUserGraduate />
              <span>Internship Portal</span>
            </div>

            <header className="signup-header">
              <span className="signup-header-eyebrow">
                GET STARTED
              </span>

              <h2>Create your account</h2>

              <p>
                Join the portal to start your internship journey.
              </p>
            </header>

            <form className="signup-form" onSubmit={handleSubmit}>

              {/* FIRST AND LAST NAME */}
              <div className="signup-form-row">
                <div className="signup-form-group">
                  <label htmlFor="signup-first-name">
                    First Name
                  </label>

                  <input
                    id="signup-first-name"
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="signup-form-group">
                  <label htmlFor="signup-last-name">
                    Last Name
                  </label>

                  <input
                    id="signup-last-name"
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="signup-form-group">
                <label htmlFor="signup-email">
                  Email Address
                </label>

                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}
              <div className="signup-form-group">
                <label htmlFor="signup-phone">
                  Phone Number
                </label>

                <input
                  id="signup-phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="signup-form-group">
                <label htmlFor="signup-password">
                  Password
                </label>

                <div className="signup-password-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <small className="signup-field-hint">
                  Use at least 6 characters.
                </small>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="signup-form-group">
                <label htmlFor="signup-confirm-password">
                  Confirm Password
                </label>

                <div className="signup-password-wrapper">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <div className="signup-terms">
                <input
                  type="checkbox"
                  id="signup-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                />

                <label htmlFor="signup-terms">
                  I agree to the terms and conditions.
                </label>
              </div>

              {/* ERROR */}
              {error && (
                <div className="signup-feedback signup-error" role="alert">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {message && (
                <div
                  className="signup-feedback signup-success"
                  role="status"
                >
                  {message}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="signup-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="signup-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="signup-login-prompt">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </div>

            <div className="signup-security-note">
              <FaShieldAlt />
              <span>Your information is submitted securely over HTTPS.</span>
            </div>

            <p className="signup-copyright">
              © {new Date().getFullYear()} Internship Portal
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
