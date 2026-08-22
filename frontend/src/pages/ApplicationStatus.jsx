import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./ApplicationStatus.css";
import NotificationBell from "../components/NotificationBell";
import LogoutButton from "../components/LogoutButton";

function ApplicationStatus() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD STUDENT
  // =========================================

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");

    if (!storedStudent) {
      navigate("/login");
      return;
    }

    try {
      const parsedStudent = JSON.parse(storedStudent);
      setStudent(parsedStudent);
    } catch (error) {
      console.error("Student data error:", error);
      localStorage.removeItem("student");
      navigate("/login");
    }
  }, [navigate]);

  // =========================================
  // LOAD APPLICATION
  // =========================================

  useEffect(() => {
    if (!student?.id) return;

    const loadApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/applications/student/${student.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load application."
          );
        }

        setApplication(data.application);
      } catch (error) {
        console.error("Application loading error:", error);

        setError(
          error.message ||
            "Unable to load your application."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [student]);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    navigate("/");
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // FORMAT DATE + TIME
  // =========================================

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatus = () => {
    if (!application?.application_status) {
      return "Pending";
    }

    const status = application.application_status
      .toLowerCase()
      .trim();

    if (status === "pending") {
      return "Pending";
    }

    if (
      status === "under review" ||
      status === "under_review" ||
      status === "review"
    ) {
      return "Under Review";
    }

    if (
      status === "approved" ||
      status === "accepted"
    ) {
      return "Approved";
    }

    if (
      status === "rejected" ||
      status === "declined"
    ) {
      return "Rejected";
    }

    return application.application_status;
  };

  const status = getStatus();

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = () => {
    switch (status) {
      case "Approved":
        return "approved";

      case "Rejected":
        return "rejected";

      case "Under Review":
        return "review";

      case "Pending":
      default:
        return "pending";
    }
  };

  // =========================================
  // DOCUMENT URL
  // =========================================

  const getDocumentUrl = (filePath) => {
    if (!filePath) return null;

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `http://localhost:5000${filePath}`;
  };

  // =========================================
  // DOCUMENT NAME
  // =========================================

  const getDocumentName = (filePath, fallback) => {
    if (!filePath) return fallback;

    const parts = filePath.split("/");

    const fileName = parts[parts.length - 1];

    if (!fileName) return fallback;

    // Remove timestamp/random prefix from display
    const cleanName = fileName.replace(
      /^\d+-\d+-/,
      ""
    );

    return cleanName || fallback;
  };

  // =========================================
  // DOCUMENT COMPONENT
  // =========================================

  const DocumentItem = ({
    title,
    path,
  }) => {
    const url = getDocumentUrl(path);

    return (
      <div className="document-item">

        <div className="document-icon">
          {path
            ?.toLowerCase()
            .endsWith(".pdf")
            ? "PDF"
            : "DOC"}
        </div>

        <div className="document-details">

          <strong>
            {getDocumentName(
              path,
              `${title} not uploaded`
            )}
          </strong>

          <span>
            {path
              ? `${title} • Uploaded with application`
              : `${title} • Not uploaded`}
          </span>

        </div>

        <div className="document-check">

          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="document-view-btn"
            >
              View
            </a>
          ) : (
            <span className="document-missing">
              —
            </span>
          )}

        </div>

      </div>
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="dashboard">

        <aside className="sidebar">

          <div className="sidebar-logo">
            Internship<span>Portal</span>
          </div>

        </aside>

        <main className="dashboard-main">

          <div className="application-loading">

            <div className="loading-spinner"></div>

            <h2>
              Loading application...
            </h2>

            <p>
              Please wait while we retrieve your application.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // NO APPLICATION / ERROR
  // =========================================

  if (error || !application) {
    return (
      <div className="dashboard">

        <aside className="sidebar">

          <div className="sidebar-logo">
            Internship<span>Portal</span>
          </div>

          <nav className="sidebar-nav">

            <Link
              to="/dashboard"
              className="sidebar-link"
            >
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              to="/apply"
              className="sidebar-link"
            >
              <span>▣</span>
              My Application
            </Link>

            <Link
              to="/application-status"
              className="sidebar-link active"
            >
              <span>▤</span>
              Application Status
            </Link>

            <Link
              to="/notifications"
              className="sidebar-link"
            >
              <span>♢</span>
              Notifications
            </Link>

            <Link
              to="/profile"
              className="sidebar-link"
            >
              <span>◯</span>
              My Profile
            </Link>

            <Link
              to="/settings"
              className="sidebar-link"
            >
              <span>⚙</span>
              Settings
            </Link>

          </nav>

          <div className="sidebar-bottom">

           <LogoutButton />

          </div>

        </aside>

        <main className="dashboard-main">

          <header className="dashboard-header">

            <div>

              <h1>
                Application Status
              </h1>

              <p>
                Track the progress of your internship application.
              </p>

            </div>

          </header>

          <div className="application-empty">

            <div className="empty-icon">
              !
            </div>

            <h2>
              No Application Found
            </h2>

            <p>
              {error ||
                "You have not submitted an internship application yet."}
            </p>

            <Link
              to="/apply"
              className="next-btn"
            >
              Start Application →
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // FULL PAGE
  // =========================================

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          Internship<span>Portal</span>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="sidebar-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/apply"
            className="sidebar-link"
          >
            <span>▣</span>
            My Application
          </Link>

          <Link
            to="/application-status"
            className="sidebar-link active"
          >
            <span>▤</span>
            Application Status
          </Link>

          <Link
            to="/notifications"
            className="sidebar-link"
          >
            <span>♢</span>
            Notifications
          </Link>

          <Link
            to="/profile"
            className="sidebar-link"
          >
            <span>◯</span>
            My Profile
          </Link>

          <Link
            to="/settings"
            className="sidebar-link"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <button
            onClick={handleLogout}
            className="admin-logout"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Application Status
            </h1>

            <p>
              Track the progress of your internship application.
            </p>

          </div>

          <div className="header-profile">

            <div className="notification-icon">
             <NotificationBell />
            </div>

            <div className="profile-avatar">

              {(
                student?.full_name?.[0] ||
                application?.student_name?.[0] ||
                "S"
              ).toUpperCase()}

            </div>

            <div className="profile-info">

              <strong>
                {student?.full_name ||
                  "Student"}
              </strong>

              <span>
                Applicant
              </span>

            </div>

          </div>

        </header>


        {/* ================= STATUS OVERVIEW ================= */}

        <section className="application-status-card">

          <div className="status-card-heading">

            <div>

              <span className="status-card-label">
                APPLICATION STATUS
              </span>

              <h2>
                {status}
              </h2>

              <p>

                {status === "Pending" &&
                  "Your application has been successfully submitted and is waiting to be reviewed."}

                {status === "Under Review" &&
                  "Your application is currently being reviewed by the internship administration team."}

                {status === "Approved" &&
                  "Congratulations! Your internship application has been approved."}

                {status === "Rejected" &&
                  "Your internship application was not approved. Please check your notifications for more information."}

              </p>

            </div>

            <span
              className={`status-badge ${getStatusClass()}`}
            >
              {status}
            </span>

          </div>


          {/* ================= APPLICATION INFORMATION ================= */}

          <div className="application-info">

            <div className="application-info-item">

              <span>
                Application ID
              </span>

              <strong>
                APP-{String(application.id).padStart(6, "0")}
              </strong>

            </div>

            <div className="application-info-item">

              <span>
                Date Submitted
              </span>

              <strong>
                {formatDate(
                  application.submitted_at
                )}
              </strong>

            </div>

            <div className="application-info-item">

              <span>
                Department
              </span>

              <strong>
                {application.department_name ||
                  "Not selected"}
              </strong>

            </div>

          </div>


          {/* ================= PROGRESS ================= */}

          <div className="status-progress">

            <div className="status-progress-line"></div>


            {/* Submitted */}

            <div className="status-step completed">

              <div className="status-step-circle">
                ✓
              </div>

              <strong>
                Submitted
              </strong>

              <span>
                {formatDate(
                  application.submitted_at
                )}
              </span>

            </div>


            {/* Received */}

            <div
              className={`status-step ${
                status !== "Pending"
                  ? "completed"
                  : "current"
              }`}
            >

              <div className="status-step-circle">

                {status !== "Pending"
                  ? "✓"
                  : "2"}

              </div>

              <strong>
                Received
              </strong>

              <span>
                {status !== "Pending"
                  ? "Application received"
                  : "Pending"}
              </span>

            </div>


            {/* Review */}

            <div
              className={`status-step ${
                status === "Under Review"
                  ? "current"
                  : status === "Approved" ||
                    status === "Rejected"
                  ? "completed"
                  : ""
              }`}
            >

              <div className="status-step-circle">

                {status === "Approved" ||
                status === "Rejected"
                  ? "✓"
                  : "3"}

              </div>

              <strong>
                Under Review
              </strong>

              <span>

                {status === "Under Review"
                  ? "In progress"
                  : status === "Approved" ||
                    status === "Rejected"
                  ? "Completed"
                  : "Pending"}

              </span>

            </div>


            {/* Final Decision */}

            <div
              className={`status-step ${
                status === "Approved" ||
                status === "Rejected"
                  ? "current"
                  : ""
              }`}
            >

              <div className="status-step-circle">

                {status === "Approved"
                  ? "✓"
                  : status === "Rejected"
                  ? "×"
                  : "4"}

              </div>

              <strong>
                Final Decision
              </strong>

              <span>

                {status === "Approved"
                  ? "Approved"
                  : status === "Rejected"
                  ? "Rejected"
                  : "Pending"}

              </span>

            </div>

          </div>

        </section>


        {/* ================= DETAILS + DOCUMENTS ================= */}

        <div className="application-status-grid">


          {/* ================= APPLICATION DETAILS ================= */}

          <section className="status-content-card">

            <div className="status-content-header">

              <div>

                <h2>
                  Application Details
                </h2>

                <p>
                  Information submitted with your application.
                </p>

              </div>

            </div>


            <div className="application-details-grid">

              <div className="application-detail">

                <span>
                  Full Name
                </span>

                <strong>
                  {student?.full_name ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Email
                </span>

                <strong>
                  {student?.email ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Phone
                </span>

                <strong>
                  {student?.phone ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  University
                </span>

                <strong>
                  {student?.university ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Programme
                </span>

                <strong>
                  {student?.program ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Level
                </span>

                <strong>
                  {student?.level ||
                    "Not provided"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Department
                </span>

                <strong>
                  {application.department_name ||
                    "Not selected"}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Application Date
                </span>

                <strong>
                  {formatDate(
                    application.submitted_at
                  )}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Preferred Start Date
                </span>

                <strong>
                  {formatDate(
                    application.start_date
                  )}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Preferred End Date
                </span>

                <strong>
                  {formatDate(
                    application.end_date
                  )}
                </strong>

              </div>


              <div className="application-detail">

                <span>
                  Preferred Location
                </span>

                <strong>
                  {application.preferred_location ||
                    "Not provided"}
                </strong>

              </div>

            </div>


            {/* MOTIVATION */}

            <div className="application-motivation">

              <span>
                Motivation
              </span>

              <p>
                {application.motivation ||
                  "No motivation statement provided."}
              </p>

            </div>

          </section>


          {/* ================= DOCUMENTS ================= */}

          <section className="status-content-card">

            <div className="status-content-header">

              <div>

                <h2>
                  Documents
                </h2>

                <p>
                  Documents submitted with your application.
                </p>

              </div>

            </div>


            <div className="documents-list">

              <DocumentItem
                title="Curriculum Vitae"
                path={application.cv_path}
              />

              <DocumentItem
                title="Academic Transcript"
                path={application.transcript_path}
              />

              <DocumentItem
                title="Cover Letter"
                path={application.cover_letter}
              />

            </div>

          </section>

        </div>


        {/* ================= APPLICATION HISTORY ================= */}

        <section className="status-content-card history-card">

          <div className="status-content-header">

            <div>

              <h2>
                Application History
              </h2>

              <p>
                A timeline of activity on your application.
              </p>

            </div>

          </div>


          <div className="history-list">


            {/* SUBMITTED */}

            <div className="history-item">

              <div className="history-icon completed">
                ✓
              </div>

              <div className="history-text">

                <strong>
                  Application Submitted
                </strong>

                <p>
                  Your internship application was successfully submitted.
                </p>

                <span>
                  {formatDateTime(
                    application.submitted_at
                  )}
                </span>

              </div>

            </div>


            {/* RECEIVED */}

            <div className="history-item">

              <div
                className={`history-icon ${
                  status !== "Pending"
                    ? "completed"
                    : ""
                }`}
              >
                {status !== "Pending"
                  ? "✓"
                  : "2"}
              </div>

              <div className="history-text">

                <strong>
                  Application Received
                </strong>

                <p>
                  Your application has been received by the internship office.
                </p>

                <span>
                  {status !== "Pending"
                    ? "Application received"
                    : "Waiting for confirmation"}
                </span>

              </div>

            </div>


            {/* REVIEW */}

            <div className="history-item">

              <div
                className={`history-icon ${
                  status === "Under Review"
                    ? "current"
                    : status === "Approved" ||
                      status === "Rejected"
                    ? "completed"
                    : ""
                }`}
              >

                {status === "Approved" ||
                status === "Rejected"
                  ? "✓"
                  : "3"}

              </div>

              <div className="history-text">

                <strong>
                  Application Under Review
                </strong>

                <p>

                  {status === "Pending"
                    ? "Your application is waiting to be reviewed."
                    : status === "Under Review"
                    ? "An administrator is currently reviewing your application."
                    : "The review stage has been completed."}

                </p>

                <span>

                  {status === "Pending"
                    ? "Pending"
                    : status === "Under Review"
                    ? "In progress"
                    : "Completed"}

                </span>

              </div>

            </div>


            {/* FINAL DECISION */}

            <div className="history-item">

              <div
                className={`history-icon ${
                  status === "Approved" ||
                  status === "Rejected"
                    ? "completed"
                    : ""
                }`}
              >

                {status === "Approved"
                  ? "✓"
                  : status === "Rejected"
                  ? "×"
                  : "4"}

              </div>

              <div className="history-text">

                <strong>
                  Final Decision
                </strong>

                <p>

                  {status === "Approved"
                    ? "Your internship application has been approved."
                    : status === "Rejected"
                    ? "Your internship application has been rejected."
                    : "Waiting for the internship office to make a final decision."}

                </p>

                <span>

                  {status === "Approved"
                    ? "Approved"
                    : status === "Rejected"
                    ? "Rejected"
                    : "Pending"}

                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================= ADMIN NOTE ================= */}

        <section className="admin-note">

          <div className="admin-note-icon">
            i
          </div>

          <div>

            <strong>
              Application Information
            </strong>

            <p>

              {status === "Pending" &&
                "Your application has been submitted successfully and is waiting for review."}

              {status === "Under Review" &&
                "Your application is currently being reviewed. You will receive a notification once a decision has been made."}

              {status === "Approved" &&
                "Congratulations! Your application has been approved. Please check your notifications for the next steps."}

              {status === "Rejected" &&
                "Your application was not approved. Please check your notifications for further information."}

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ApplicationStatus;