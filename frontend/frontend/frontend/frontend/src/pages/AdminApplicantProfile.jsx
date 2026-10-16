import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AdminApplicantProfile.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminApplicantProfile() {
  const { id } = useParams();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const API_URL = "https://internship-jh6u.vercel.app";

  // =========================================================
  // LOAD APPLICANT
  // =========================================================

  const fetchApplicant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/applicants/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load applicant."
        );
      }

      setApplicant(data.applicant);
    } catch (error) {
      console.error("Applicant profile error:", error);

      setError(
        error.message || "Unable to load applicant."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  // =========================================================
  // UPDATE APPLICATION STATUS
  // =========================================================

  const updateStatus = async (newStatus) => {
    if (!applicant || updatingStatus) {
      return;
    }

    const statusName =
      newStatus === "approved"
        ? "Approve"
        : newStatus === "rejected"
        ? "Reject"
        : "move to Under Review";

    const confirmed = window.confirm(
      `Are you sure you want to ${statusName} this application?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${API_URL}/api/admin/applicants/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update application status."
        );
      }

      // Update the applicant on the page immediately
      setApplicant((previousApplicant) => ({
        ...previousApplicant,
        application_status: newStatus,
        updated_at: new Date().toISOString(),
      }));

      alert(
        data.message ||
          `Application ${newStatus} successfully.`
      );
    } catch (error) {
      console.error(
        "Update applicant status error:",
        error
      );

      alert(
        error.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    const formattedDate = new Date(
      date
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return formattedDate;
  };

  // =========================================================
  // GET STATUS
  // =========================================================

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

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = () => {
    const status =
      applicant?.application_status
        ?.toLowerCase()
        .replace(/\s+/g, "-");

    return status || "pending";
  };

  // =========================================================
  // INITIALS
  // =========================================================

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

  // =========================================================
  // LOADING
  // =========================================================

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

          <div className="profile-loading">
            Loading applicant...
          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

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

          <div className="profile-error">

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

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="admin-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="admin-header">

          <div>

            <Link
              to="/admin/applicants"
              className="back-applicants"
            >
              ← Back to Applicants
            </Link>

            <h1>
              Applicant Profile
            </h1>

            <p>
              View the applicant's information and
              internship application.
            </p>

          </div>

          <div className="admin-header-right">

            <button
              className="admin-notification"
              type="button"
            >
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


        {/* ===================================================
            APPLICANT PROFILE HEADER
        =================================================== */}

        <section className="applicant-profile-card">

          <div className="profile-main-info">

            <div className="large-profile-avatar">
              {getInitials(
                applicant.full_name
              )}
            </div>

            <div>

              <div className="profile-name-row">

                <h2>
                  {applicant.full_name}
                </h2>

                <span
                  className={`profile-status ${getStatusClass()}`}
                >
                  {getStatus()}
                </span>

              </div>

              <p className="profile-email">
                {applicant.email ||
                  "No email provided"}
              </p>

              <div className="profile-meta">

                <span>
                  {applicant.university ||
                    "University not provided"}
                </span>

                <span>
                  {applicant.program ||
                    "Programme not provided"}
                </span>

                <span>
                  {applicant.department_name ||
                    "Department not assigned"}
                </span>

              </div>

            </div>

          </div>

          <div className="profile-id">

            <span>
              Application ID
            </span>

            <strong>
              #{applicant.application_id}
            </strong>

          </div>

        </section>


        {/* ===================================================
            TWO COLUMN CONTENT
        =================================================== */}

        <div className="profile-content-grid">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="profile-left-column">


            {/* ===============================================
                PERSONAL INFORMATION
            =============================================== */}

            <section className="profile-section">

              <div className="profile-section-header">

                <h2>
                  Personal Information
                </h2>

                <p>
                  Applicant's personal details.
                </p>

              </div>

              <div className="profile-info-grid">

                <div className="profile-info-item">

                  <span>
                    Full Name
                  </span>

                  <strong>
                    {applicant.full_name ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Email
                  </span>

                  <strong>
                    {applicant.email ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {applicant.phone ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Student ID
                  </span>

                  <strong>
                    {applicant.student_number ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Date of Birth
                  </span>

                  <strong>
                    {formatDate(
                      applicant.date_of_birth
                    )}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Gender
                  </span>

                  <strong>
                    {applicant.gender ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item full-width">

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


            {/* ===============================================
                ACADEMIC INFORMATION
            =============================================== */}

            <section className="profile-section">

              <div className="profile-section-header">

                <h2>
                  Academic Information
                </h2>

                <p>
                  Applicant's academic background.
                </p>

              </div>

              <div className="profile-info-grid">

                <div className="profile-info-item">

                  <span>
                    University
                  </span>

                  <strong>
                    {applicant.university ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Programme
                  </span>

                  <strong>
                    {applicant.program ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Level
                  </span>

                  <strong>
                    {applicant.level ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    GPA
                  </span>

                  <strong>
                    {applicant.gpa ||
                      "Not provided"}
                  </strong>

                </div>


                <div className="profile-info-item">

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


            {/* ===============================================
                INTERNSHIP APPLICATION
            =============================================== */}

            <section className="profile-section">

              <div className="profile-section-header">

                <h2>
                  Internship Application
                </h2>

                <p>
                  Details of the applicant's
                  internship request.
                </p>

              </div>

              <div className="profile-info-grid">

                <div className="profile-info-item">

                  <span>
                    Department
                  </span>

                  <strong>
                    {applicant.department_name ||
                      "Not specified"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Preferred Location
                  </span>

                  <strong>
                    {applicant.preferred_location ||
                      "Not specified"}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Start Date
                  </span>

                  <strong>
                    {formatDate(
                      applicant.start_date
                    )}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    End Date
                  </span>

                  <strong>
                    {formatDate(
                      applicant.end_date
                    )}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(
                      applicant.submitted_at
                    )}
                  </strong>

                </div>


                <div className="profile-info-item">

                  <span>
                    Current Status
                  </span>

                  <strong>
                    {getStatus()}
                  </strong>

                </div>

              </div>

            </section>


            {/* ===============================================
                MOTIVATION
            =============================================== */}

            <section className="profile-section">

              <div className="profile-section-header">

                <h2>
                  Motivation
                </h2>

                <p>
                  Applicant's internship motivation.
                </p>

              </div>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "#64748b",
                  whiteSpace: "pre-wrap",
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                {applicant.motivation ||
                  "No motivation provided."}
              </p>

            </section>


            {/* ===============================================
                DOCUMENTS
            =============================================== */}

            <section className="profile-section">

              <div className="profile-section-header">

                <h2>
                  Documents
                </h2>

                <p>
                  Documents submitted by the applicant.
                </p>

              </div>

              <div className="documents-list">

                {/* CV */}

                <div className="document-item">

                  <div className="document-icon">
                    CV
                  </div>

                  <div className="document-info">

                    <strong>
                      Curriculum Vitae
                    </strong>

                    <span>
                      {applicant.cv_path
                        ? "Document uploaded"
                        : "Not uploaded"}
                    </span>

                  </div>

                  {applicant.cv_path && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `${API_URL}/${applicant.cv_path}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  )}

                </div>


                {/* TRANSCRIPT */}

                <div className="document-item">

                  <div className="document-icon">
                    PDF
                  </div>

                  <div className="document-info">

                    <strong>
                      Academic Transcript
                    </strong>

                    <span>
                      {applicant.transcript_path
                        ? "Document uploaded"
                        : "Not uploaded"}
                    </span>

                  </div>

                  {applicant.transcript_path && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `${API_URL}/${applicant.transcript_path}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  )}

                </div>


                {/* COVER LETTER */}

                <div className="document-item">

                  <div className="document-icon">
                    DOC
                  </div>

                  <div className="document-info">

                    <strong>
                      Cover Letter
                    </strong>

                    <span>
                      {applicant.cover_letter
                        ? "Document uploaded"
                        : "Not uploaded"}
                    </span>

                  </div>

                  {applicant.cover_letter && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `${API_URL}/${applicant.cover_letter}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  )}

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="profile-right-column">


            {/* ===============================================
                APPLICATION ACTIONS
            =============================================== */}

            <section className="profile-action-card">

              <h2>
                Application Decision
              </h2>

              <p>
                Review this application and
                update its current status.
              </p>


              {/* CURRENT STATUS */}

              <div
                className={`current-status ${getStatusClass()}`}
              >

                <div className="status-dot"></div>

                <div>

                  <strong>
                    {getStatus()}
                  </strong>

                  <small>
                    Current application status
                  </small>

                </div>

              </div>


              {/* ACTION BUTTONS */}

              <div className="action-buttons">

                {/* APPROVE */}

                <button
                  type="button"
                  className="approve-btn"
                  disabled={updatingStatus}
                  onClick={() =>
                    updateStatus("approved")
                  }
                >
                  {updatingStatus
                    ? "Updating..."
                    : "✓ Approve Application"}
                </button>


                {/* UNDER REVIEW */}

                <button
                  type="button"
                  className="review-btn"
                  disabled={updatingStatus}
                  onClick={() =>
                    updateStatus("under review")
                  }
                >
                  {updatingStatus
                    ? "Updating..."
                    : "↻ Mark Under Review"}
                </button>


                {/* REJECT */}

                <button
                  type="button"
                  className="reject-btn"
                  disabled={updatingStatus}
                  onClick={() =>
                    updateStatus("rejected")
                  }
                >
                  {updatingStatus
                    ? "Updating..."
                    : "✕ Reject Application"}
                </button>

              </div>

            </section>


            {/* ===============================================
                APPLICATION SUMMARY
            =============================================== */}

            <section className="profile-side-card">

              <h2>
                Application Summary
              </h2>

              <div className="summary-item">

                <span>
                  Application ID
                </span>

                <strong>
                  #{applicant.application_id}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Department
                </span>

                <strong>
                  {applicant.department_name ||
                    "Not assigned"}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Status
                </span>

                <strong
                  className={
                    getStatusClass() ===
                    "pending"
                      ? "orange-text"
                      : ""
                  }
                >
                  {getStatus()}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Submitted
                </span>

                <strong>
                  {formatDate(
                    applicant.submitted_at
                  )}
                </strong>

              </div>


              <div className="summary-item">

                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    applicant.updated_at
                  )}
                </strong>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminApplicantProfile;