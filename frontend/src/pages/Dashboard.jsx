
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NotificationBell from "../components/NotificationBell";
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    // Remove authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    // Remove any other student session data if present
    sessionStorage.clear();

    // Redirect to landing page
    navigate("/", { replace: true });

    // Replace browser history so Back does not return
    // to the dashboard
    window.history.replaceState(
      null,
      "",
      "/"
    );

    // Prevent browser Back from returning to
    // the protected dashboard
    window.onpopstate = () => {
      window.history.replaceState(
        null,
        "",
        "/"
      );
    };
  };


  // =========================================
  // STATE
  // =========================================

  const [loginMessage, setLoginMessage] = useState("");

  const [application, setApplication] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);


  // =========================================
  // STUDENT
  // =========================================

  const student =
    JSON.parse(localStorage.getItem("student")) || {};

  const studentId = student.id;

  const studentName =
    student.full_name || "Student";


  // =========================================
  // INITIALS
  // =========================================

  const initials = studentName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();


  // =========================================
  // API URL
  // =========================================

  const API_URL = "http://localhost:5000";


  // =========================================
  // LOGIN MESSAGE
  // =========================================

  useEffect(() => {
    if (location.state?.loginMessage) {
      setLoginMessage(
        location.state.loginMessage
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      const timer = setTimeout(() => {
        setLoginMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location]);


  // =========================================
  // GET APPLICATION
  // =========================================

  const fetchApplication = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/applications/student/${studentId}`
      );

      if (response.status === 404) {
        setApplication(null);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
      }

    } catch (error) {
      console.error(
        "Dashboard application error:",
        error
      );
    }
  };


  // =========================================
  // GET NOTIFICATIONS
  // =========================================

  const fetchNotifications = async () => {
    if (!studentId) return;

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/student/${studentId}`
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(
          data.notifications || []
        );

        setUnreadCount(
          data.unreadCount || 0
        );
      }

    } catch (error) {
      console.error(
        "Dashboard notification error:",
        error
      );
    }
  };


  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        fetchApplication(),
        fetchNotifications(),
      ]);

      setLoading(false);
    };

    loadDashboard();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [studentId]);


  // =========================================
  // APPLICATION STATUS
  // =========================================

  const applicationStatus =
    application?.application_status ||
    "Not Submitted";


  // =========================================
  // STATUS DISPLAY
  // =========================================

  const getStatusText = () => {
    if (!application) {
      return "Not Started";
    }

    if (
      applicationStatus.toLowerCase() ===
      "pending"
    ) {
      return "Pending";
    }

    if (
      applicationStatus.toLowerCase() ===
      "under review"
    ) {
      return "Under Review";
    }

    if (
      applicationStatus.toLowerCase() ===
      "approved"
    ) {
      return "Approved";
    }

    if (
      applicationStatus.toLowerCase() ===
      "rejected"
    ) {
      return "Rejected";
    }

    return applicationStatus;
  };


  // =========================================
  // DOCUMENT COUNT
  // =========================================

  const getDocumentCount = () => {
    if (!application) {
      return 0;
    }

    let count = 0;

    if (application.cv_path) {
      count++;
    }

    if (application.transcript_path) {
      count++;
    }

    if (application.cover_letter) {
      count++;
    }

    if (application.recommendation_letter) {
      count++;
    }

    return count;
  };


  const documentCount =
    getDocumentCount();


  // =========================================
  // APPLICATION PROGRESS
  // =========================================

  const getApplicationProgress = () => {
    if (!application) {
      return 0;
    }

    let completed = 0;

    if (
      application.student_id &&
      application.department_id
    ) {
      completed++;
    }

    if (
      application.start_date &&
      application.end_date
    ) {
      completed++;
    }

    if (
      application.preferred_location
    ) {
      completed++;
    }

    if (
      application.motivation
    ) {
      completed++;
    }

    if (documentCount > 0) {
      completed++;
    }

    return Math.round(
      (completed / 5) * 100
    );
  };


  const applicationProgress =
    getApplicationProgress();


  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
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
  // TIME FORMAT
  // =========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // =========================================
  // RECENT NOTIFICATIONS
  // =========================================

  const recentNotifications =
    notifications.slice(0, 3);


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

          <div
            style={{
              padding: "40px",
              fontSize: "16px",
              color: "#6b7280",
            }}
          >
            Loading dashboard...
          </div>

        </main>

      </div>
    );
  }


  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="dashboard">


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          Internship<span>Portal</span>
        </div>


        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="sidebar-link active"
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
            className="sidebar-link"
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

            {unreadCount > 0 && (
              <span className="sidebar-notification-badge">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

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


        {/* =========================================
            LOGOUT
        ========================================= */}

        <div className="sidebar-bottom">

         <LogoutButton />

        </div>

      </aside>



      {/* =========================================
          MAIN
      ========================================= */}

      <main className="dashboard-main">


        {/* LOGIN MESSAGE */}

        {loginMessage && (
          <div className="login-success-message">

            <div className="success-message-content">

              <span className="success-icon">
                ✓
              </span>

              <div>

                <strong>
                  Welcome back!
                </strong>

                <p>
                  {loginMessage}
                </p>

              </div>

            </div>

          </div>
        )}



        {/* =========================================
            HEADER
        ========================================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {studentName}! Here's an
              overview of your internship journey.
            </p>

          </div>


          <div className="header-profile">

            <Link
              to="/notifications"
              className="notification-wrapper"
              title={
                unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1
                        ? "s"
                        : ""
                    }`
                  : "Notifications"
              }
            >

              <div className="notification-icon">
                ♢
              </div>

              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </Link>


            <div className="profile-avatar">
              {initials}
            </div>


            <div className="profile-info">

              <strong>
                {studentName}
              </strong>

              <span>
                Applicant
              </span>

            </div>

          </div>

        </header>



        {/* =========================================
            WELCOME BANNER
        ========================================= */}

        <section className="welcome-banner">

          <div>

            <p className="banner-label">
              INTERNSHIP APPLICATION
            </p>

            <h2>

              {application
                ? "Your internship journey is underway."
                : "Start building your"}

              {!application && (
                <span>
                  {" "}professional future.
                </span>
              )}

            </h2>

            <p>

              {application
                ? "Track your application and stay updated with the latest information from the internship administration team."
                : "Complete your internship application and take the next step toward gaining valuable experience."}

            </p>

            <Link
              to={
                application
                  ? "/application-status"
                  : "/apply"
              }
              className="start-btn"
            >

              {application
                ? "View Application →"
                : "Start Application →"}

            </Link>

          </div>


          <div className="banner-decoration">
            ✦
          </div>

        </section>



        {/* =========================================
            STATUS CARDS
        ========================================= */}

        <section className="status-grid">


          <div className="status-card">

            <div className="status-icon">
              📝
            </div>

            <div>

              <span>
                Application
              </span>

              <strong>
                {application
                  ? "Submitted"
                  : "Not Started"}
              </strong>

            </div>

          </div>



          <div className="status-card">

            <div className="status-icon">
              📄
            </div>

            <div>

              <span>
                Documents
              </span>

              <strong>
                {documentCount} / 4 Uploaded
              </strong>

            </div>

          </div>



          <div className="status-card">

            <div className="status-icon">
              ⏳
            </div>

            <div>

              <span>
                Application Status
              </span>

              <strong>
                {getStatusText()}
              </strong>

            </div>

          </div>



          <div className="status-card">

            <div className="status-icon">
              📅
            </div>

            <div>

              <span>
                Deadline
              </span>

              <strong>
                30 Sept 2026
              </strong>

            </div>

          </div>

        </section>



        {/* =========================================
            DASHBOARD GRID
        ========================================= */}

        <section className="dashboard-grid">


          {/* APPLICATION PROGRESS */}

          <div className="dashboard-card progress-card">

            <div className="card-header">

              <div>

                <h3>
                  Application Progress
                </h3>

                <p>
                  Complete all sections before submitting.
                </p>

              </div>

              <strong>
                {applicationProgress}%
              </strong>

            </div>


            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${applicationProgress}%`,
                }}
              ></div>

            </div>


            <div className="progress-info">

              <span>

                {application
                  ? `${Math.round(
                      applicationProgress / 20
                    )} of 5 sections completed`
                  : "0 of 5 sections completed"}

              </span>


              <Link
                to={
                  application
                    ? "/application-status"
                    : "/apply"
                }
              >

                {application
                  ? "View Application →"
                  : "Continue →"}

              </Link>

            </div>

          </div>



          {/* PROFILE COMPLETION */}

          <div className="dashboard-card profile-card">

            <div className="card-header">

              <div>

                <h3>
                  Profile Completion
                </h3>

                <p>
                  Complete your profile.
                </p>

              </div>

            </div>


            <div className="profile-progress">

              <div className="circle-progress">

                <span>

                  {student.phone &&
                  student.university &&
                  student.program
                    ? "100%"
                    : "40%"}

                </span>

              </div>


              <div>

                <strong>

                  {student.phone &&
                  student.university &&
                  student.program
                    ? "Your profile is complete"
                    : "Your profile is incomplete"}

                </strong>


                <p>

                  {student.phone &&
                  student.university &&
                  student.program
                    ? "Your personal and academic information is complete."
                    : "Add your academic information and personal details."}

                </p>


                <Link to="/profile">

                  {student.phone &&
                  student.university &&
                  student.program
                    ? "View Profile →"
                    : "Complete Profile →"}

                </Link>

              </div>

            </div>

          </div>

        </section>



        {/* =========================================
            RECENT ACTIVITY
        ========================================= */}

        <section className="dashboard-card activity-card">

          <div className="card-header">

            <div>

              <h3>
                Recent Activity
              </h3>

              <p>
                Your latest account activity.
              </p>

            </div>


            <Link to="/notifications">
              View All
            </Link>

          </div>


          {recentNotifications.length === 0 ? (

            <div className="empty-activity">

              <div className="empty-icon">
                ◌
              </div>

              <h4>
                No recent activity
              </h4>

              <p>
                Your application activities will appear here.
              </p>

            </div>

          ) : (

            <div className="dashboard-activity-list">

              {recentNotifications.map(
                (notification) => (

                  <Link
                    to="/notifications"
                    className={`dashboard-activity-item ${
                      notification.is_read
                        ? ""
                        : "unread"
                    }`}
                    key={notification.id}
                  >

                    <div className="dashboard-activity-icon">

                      {notification.type === "success"
                        ? "✓"
                        : notification.type === "warning"
                        ? "!"
                        : notification.type === "error"
                        ? "×"
                        : "i"}

                    </div>


                    <div className="dashboard-activity-content">

                      <strong>
                        {notification.title}
                      </strong>

                      <p>
                        {notification.message}
                      </p>

                      <span>
                        {formatDateTime(
                          notification.created_at
                        )}
                      </span>

                    </div>


                    {!notification.is_read && (
                      <span className="activity-unread-dot"></span>
                    )}

                  </Link>

                )
              )}

            </div>

          )}

        </section>



        {/* =========================================
            APPLICATION SUMMARY
        ========================================= */}

        {application && (

          <section className="dashboard-card">

            <div className="card-header">

              <div>

                <h3>
                  Application Summary
                </h3>

                <p>
                  Your current internship application.
                </p>

              </div>


              <Link to="/application-status">
                View Details →
              </Link>

            </div>


            <div className="dashboard-application-summary">

              <div>

                <span>
                  Department
                </span>

                <strong>
                  {application.department_name ||
                    "Not specified"}
                </strong>

              </div>


              <div>

                <span>
                  Preferred Location
                </span>

                <strong>
                  {application.preferred_location ||
                    "Not specified"}
                </strong>

              </div>


              <div>

                <span>
                  Submitted
                </span>

                <strong>
                  {formatDate(
                    application.submitted_at
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {getStatusText()}
                </strong>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Dashboard;
