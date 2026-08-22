import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminApplicantProfile.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminApplicantProfile() {
  const { id } = useParams();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  // =========================================
  // LOAD APPLICANT
  // =========================================

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/applicant/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load applicant."
          );
        }

        setApplicant(data.applicant);

      } catch (error) {
        console.error(
          "Applicant profile error:",
          error
        );

        setError(
          error.message ||
            "Unable to load applicant."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatus = () => {
    if (!applicant?.application_status) {
      return "Pending";
    }

    return applicant.application_status
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  // =========================================
  // INITIALS
  // =========================================

  const getInitials = (name) => {
    if (!name) {
      return "NA";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-dashboard">

        <aside className="admin-sidebar">

          <div className="admin-sidebar-logo">
            Internship<span>Portal</span>
            <small>ADMIN</small>
          </div>

        </aside>

        <main className="admin-main">

          <div style={{ padding: "40px" }}>
            Loading applicant...
          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="admin-dashboard">

        <aside className="admin-sidebar">

          <div className="admin-sidebar-logo">
            Internship<span>Portal</span>
            <small>ADMIN</small>
          </div>

          <nav className="admin-nav">

            <Link
              to="/admin/dashboard"
              className="admin-nav-link"
            >
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              to="/admin/applicants"
              className="admin-nav-link active"
            >
              <span>♙</span>
              Applicants
            </Link>

          </nav>

          <div className="admin-sidebar-bottom">
            <AdminLogoutButton />
          </div>

        </aside>

        <main className="admin-main">

          <div
            style={{
              padding: "40px",
              color: "#dc2626",
            }}
          >
            <h2>
              Unable to load applicant
            </h2>

            <p>
              {error}
            </p>

            <Link to="/admin/applicants">
              ← Back to Applicants
            </Link>
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          Internship<span>Portal</span>
          <small>ADMIN</small>
        </div>

        <nav className="admin-nav">

          <Link
            to="/admin/dashboard"
            className="admin-nav-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/admin/applicants"
            className="admin-nav-link active"
          >
            <span>♙</span>
            Applicants
          </Link>

          <Link
            to="/admin/departments"
            className="admin-nav-link"
          >
            <span>▤</span>
            Departments
          </Link>

          <Link
            to="/admin/reports"
            className="admin-nav-link"
          >
            <span>▥</span>
            Reports
          </Link>

          <Link
            to="/admin/notifications"
            className="admin-nav-link"
          >
            <span>♢</span>
            Notifications
          </Link>

          <Link
            to="/admin/settings"
            className="admin-nav-link"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">
          <AdminLogoutButton />
        </div>

      </aside>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="admin-main">

        <header className="admin-header">

          <div>

            <Link
              to="/admin/applicants"
              style={{
                textDecoration: "none",
                color: "#2563eb",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ← Back to Applicants
            </Link>

            <h1 style={{ marginTop: "10px" }}>
              Applicant Profile
            </h1>

            <p>
              View the applicant's information and
              internship application.
            </p>

          </div>

          <div className="admin-header-right">

            <button className="admin-notification">
              ♢
              <span></span>
            </button>

            <div className="admin-user">

              <div className="admin-avatar">
                AD
              </div>

              <div>
                <strong>
                  Administrator
                </strong>

                <small>
                  System Admin
                </small>
              </div>

            </div>

          </div>

        </header>


        {/* =========================================
            APPLICANT HEADER
        ========================================= */}

        <section className="admin-panel">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >

            <div
              className="applicant-avatar"
              style={{
                width: "70px",
                height: "70px",
                fontSize: "22px",
              }}
            >
              {getInitials(
                applicant.full_name
              )}
            </div>

            <div>

              <h2>
                {applicant.full_name}
              </h2>

              <p>
                {applicant.email}
              </p>

              <span
                className={`applicant-status ${getStatus()
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {getStatus()}
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            PERSONAL INFORMATION
        ========================================= */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Applicant's personal details.
              </p>
            </div>

          </div>

          <div
            className="dashboard-application-summary"
          >

            <div>
              <span>
                Full Name
              </span>

              <strong>
                {applicant.full_name ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Email
              </span>

              <strong>
                {applicant.email ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Phone
              </span>

              <strong>
                {applicant.phone ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Student ID
              </span>

              <strong>
                {applicant.student_number ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Date of Birth
              </span>

              <strong>
                {formatDate(
                  applicant.date_of_birth
                )}
              </strong>
            </div>

            <div>
              <span>
                Gender
              </span>

              <strong>
                {applicant.gender ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Address
              </span>

              <strong>
                {applicant.address ||
                  "Not provided"}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================================
            ACADEMIC INFORMATION
        ========================================= */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Academic Information
              </h2>

              <p>
                Applicant's academic background.
              </p>

            </div>

          </div>

          <div
            className="dashboard-application-summary"
          >

            <div>
              <span>
                University
              </span>

              <strong>
                {applicant.university ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Programme
              </span>

              <strong>
                {applicant.program ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Level
              </span>

              <strong>
                {applicant.level ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                GPA
              </span>

              <strong>
                {applicant.gpa ||
                  "Not provided"}
              </strong>
            </div>

            <div>
              <span>
                Expected Graduation
              </span>

              <strong>
                {formatDate(
                  applicant.expected_graduation
                )}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================================
            INTERNSHIP APPLICATION
        ========================================= */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Internship Application
              </h2>

              <p>
                Details of the applicant's internship
                request.
              </p>

            </div>

          </div>

          <div
            className="dashboard-application-summary"
          >

            <div>
              <span>
                Department
              </span>

              <strong>
                {applicant.department_name ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span>
                Preferred Location
              </span>

              <strong>
                {applicant.preferred_location ||
                  "Not specified"}
              </strong>
            </div>

            <div>
              <span>
                Start Date
              </span>

              <strong>
                {formatDate(
                  applicant.start_date
                )}
              </strong>
            </div>

            <div>
              <span>
                End Date
              </span>

              <strong>
                {formatDate(
                  applicant.end_date
                )}
              </strong>
            </div>

            <div>
              <span>
                Submitted
              </span>

              <strong>
                {formatDate(
                  applicant.submitted_at
                )}
              </strong>
            </div>

            <div>
              <span>
                Status
              </span>

              <strong>
                {getStatus()}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================================
            MOTIVATION
        ========================================= */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Motivation
              </h2>

              <p>
                Applicant's internship motivation.
              </p>

            </div>

          </div>

          <p
            style={{
              lineHeight: "1.8",
              color: "#64748b",
              whiteSpace: "pre-wrap",
            }}
          >
            {applicant.motivation ||
              "No motivation provided."}
          </p>

        </section>


        {/* =========================================
            DOCUMENTS
        ========================================= */}

        <section className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Documents
              </h2>

              <p>
                Documents submitted by the applicant.
              </p>

            </div>

          </div>

          <div
            className="dashboard-application-summary"
          >

            <div>
              <span>
                CV
              </span>

              <strong>
                {applicant.cv_path
                  ? "Uploaded"
                  : "Not uploaded"}
              </strong>
            </div>

            <div>
              <span>
                Transcript
              </span>

              <strong>
                {applicant.transcript_path
                  ? "Uploaded"
                  : "Not uploaded"}
              </strong>
            </div>

            <div>
              <span>
                Cover Letter
              </span>

              <strong>
                {applicant.cover_letter
                  ? "Uploaded"
                  : "Not uploaded"}
              </strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminApplicantProfile;