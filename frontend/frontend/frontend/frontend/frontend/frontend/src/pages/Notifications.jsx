import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import "./Notifications.css";
import LogoutButton from "../components/LogoutButton";

function Notifications() {

  // =========================================
  // STATE
  // =========================================

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);

  const [markingAll, setMarkingAll] = useState(false);


  // =========================================
  // GET STUDENT
  // =========================================

  const storedStudent =
    localStorage.getItem("student");

  const student = storedStudent
    ? JSON.parse(storedStudent)
    : null;


  // =========================================
  // LOAD NOTIFICATIONS
  // =========================================

  const loadNotifications = async () => {

    try {

      setLoading(true);

      setError("");


      // =========================================
      // CHECK LOGIN
      // =========================================

      if (!student || !student.id) {

        setError(
          "Student information could not be found."
        );

        setLoading(false);

        return;
      }


      // =========================================
      // FETCH NOTIFICATIONS
      // =========================================

      const response = await fetch(

        `https://internship-jh6u.vercel.app/api/notifications/student/${student.id}`

      );


      const data =
        await response.json();


      // =========================================
      // CHECK RESPONSE
      // =========================================

      if (!response.ok) {

        throw new Error(

          data.message ||
          "Unable to load notifications."

        );

      }


      // =========================================
      // SAVE DATA
      // =========================================

      setNotifications(
        data.notifications || []
      );

      setUnreadCount(
        data.unreadCount || 0
      );


    } catch (error) {

      console.error(
        "Notification loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load notifications."
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD ON PAGE OPEN
  // =========================================

  useEffect(() => {

    loadNotifications();

  }, []);


  // =========================================
  // MARK ONE AS READ
  // =========================================

  const markAsRead = async (
    notificationId
  ) => {

    try {

      const response = await fetch(

        `https://internship-jh6u.vercel.app/api/notifications/${notificationId}/read`,

        {
          method: "PUT",
        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.message ||
          "Unable to mark notification as read."

        );

      }


      // =========================================
      // UPDATE LOCAL STATE
      // =========================================

      setNotifications(
        (previousNotifications) =>

          previousNotifications.map(
            (notification) =>

              notification.id ===
              notificationId

                ? {
                    ...notification,
                    is_read: 1,
                  }

                : notification

          )

      );


      setUnreadCount(
        (previousCount) =>
          Math.max(
            previousCount - 1,
            0
          )
      );


    } catch (error) {

      console.error(
        "Mark notification error:",
        error
      );

    }

  };


  // =========================================
  // MARK ALL AS READ
  // =========================================

  const markAllAsRead = async () => {

    try {

      if (!student || !student.id) {
        return;
      }


      setMarkingAll(true);


      const response = await fetch(

        `https://internship-jh6u.vercel.app/api/notifications/student/${student.id}/read-all`,

        {
          method: "PUT",
        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(

          data.message ||
          "Unable to mark notifications as read."

        );

      }


      // =========================================
      // UPDATE UI
      // =========================================

      setNotifications(
        (previousNotifications) =>

          previousNotifications.map(
            (notification) => ({
              ...notification,
              is_read: 1,
            })
          )

      );


      setUnreadCount(0);


    } catch (error) {

      console.error(
        "Mark all notifications error:",
        error
      );


      setError(
        error.message ||
        "Unable to mark notifications as read."
      );


    } finally {

      setMarkingAll(false);

    }

  };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }


    const notificationDate =
      new Date(date);


    return notificationDate.toLocaleDateString(
      "en-GH",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    const notificationDate =
      new Date(date);


    return notificationDate.toLocaleTimeString(
      "en-GH",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  // =========================================
  // NOTIFICATION ICON
  // =========================================

  const getNotificationIcon = (
    type
  ) => {

    switch (type) {

      case "application":
        return "▣";

      case "success":
        return "✓";

      case "warning":
        return "⚠";

      case "error":
        return "×";

      default:
        return "♢";

    }

  };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="dashboard">


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          Internship
          <span>
            Portal
          </span>

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
            className="sidebar-link"
          >
            <span>▤</span>
            Application Status
          </Link>


          <Link
            to="/notifications"
            className="sidebar-link active"
          >

            <span>
              ♢
            </span>

            Notifications

            {unreadCount > 0 && (

              <span className="sidebar-notification-count">

                {unreadCount}

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


        <div className="sidebar-bottom">

          <LogoutButton />

        </div>

      </aside>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="dashboard-main">


        {/* =========================================
            HEADER
        ========================================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated about your internship application.
            </p>

          </div>


          <div className="header-profile">


            <div className="notification-icon">

              ♢

              {unreadCount > 0 && (

                <span className="notification-dot">
                  {unreadCount}
                </span>

              )}

            </div>


            <div className="profile-avatar">

              {(
                student?.full_name?.charAt(0) ||
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


        {/* =========================================
            NOTIFICATION CONTENT
        ========================================= */}

        <section className="notifications-page">


          {/* =========================================
              TITLE
          ========================================= */}

          <div className="notifications-heading">

            <div>

              <span className="notifications-label">
                NOTIFICATIONS
              </span>

              <h2>
                Your Notifications
              </h2>

              <p>
                Important updates about your application
                will appear here.
              </p>

            </div>


            {unreadCount > 0 && (

              <button
                type="button"
                className="mark-all-btn"
                onClick={markAllAsRead}
                disabled={markingAll}
              >

                {markingAll
                  ? "Marking..."
                  : "Mark all as read"}

              </button>

            )}

          </div>


          {/* =========================================
              ERROR
          ========================================= */}

          {error && (

            <div className="notifications-error">

              {error}

            </div>

          )}


          {/* =========================================
              LOADING
          ========================================= */}

          {loading ? (

            <div className="notifications-empty">

              <div className="notification-loading">
                Loading notifications...
              </div>

            </div>

          ) : notifications.length === 0 ? (

            /* =========================================
               EMPTY
            ========================================= */

            <div className="notifications-empty">

              <div className="empty-notification-icon">
                ♢
              </div>

              <h3>
                No notifications yet
              </h3>

              <p>
                You don't have any notifications at the moment.
                We'll let you know when there is an update.
              </p>

            </div>

          ) : (

            /* =========================================
               NOTIFICATION LIST
            ========================================= */

            <div className="notifications-list">

              {notifications.map(
                (notification) => (

                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.is_read
                        ? "unread"
                        : ""
                    }`}
                    onClick={() => {

                      if (
                        !notification.is_read
                      ) {

                        markAsRead(
                          notification.id
                        );

                      }

                    }}
                  >


                    {/* ICON */}

                    <div
                      className={`notification-item-icon ${
                        notification.type ||
                        "info"
                      }`}
                    >

                      {getNotificationIcon(
                        notification.type
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="notification-content">

                      <div className="notification-top">

                        <h3>
                          {notification.title}
                        </h3>

                        {!notification.is_read && (

                          <span className="unread-badge">
                            New
                          </span>

                        )}

                      </div>


                      <p>
                        {notification.message}
                      </p>


                      <div className="notification-time">

                        <span>
                          {formatDate(
                            notification.created_at
                          )}
                        </span>

                        <span>
                          {formatTime(
                            notification.created_at
                          )}
                        </span>

                      </div>

                    </div>


                    {/* READ INDICATOR */}

                    {!notification.is_read && (

                      <div className="notification-unread-dot">
                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}

export default Notifications;