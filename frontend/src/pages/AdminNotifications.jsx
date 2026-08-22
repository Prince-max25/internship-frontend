
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminNotifications.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminNotifications() {

  const [notifications, setNotifications] = useState([]);

  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================
  // LOAD NOTIFICATIONS
  // =========================================

  const loadNotifications = async () => {

    try {

      setLoading(true);
      setError("");


      const response = await fetch(
        "http://localhost:5000/api/admin/notifications"
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load notifications."
        );

      }


      setNotifications(
        data.notifications || []
      );


    } catch (error) {

      console.error(
        "Notifications error:",
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
  // UNREAD COUNT
  // =========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read
    ).length;


  // =========================================
  // FILTER
  // =========================================

  const filteredNotifications =
    notifications.filter((notification) => {

      if (filter === "Unread") {

        return !notification.is_read;

      }


      if (filter === "Applications") {

        return notification.type === "application";

      }


      if (filter === "Approved") {

        return notification.type === "approved";

      }


      if (filter === "Review") {

        return notification.type === "review";

      }


      if (filter === "System") {

        return notification.type === "system";

      }


      return true;

    });


  // =========================================
  // MARK AS READ
  // =========================================

  const markAsRead = async (id) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/admin/notifications/${id}/read`,
        {
          method: "PUT",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to mark notification as read."
        );

      }


      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) =>
              notification.id === id
                ? {
                    ...notification,
                    is_read: 1,
                  }
                : notification
          )
      );


    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to update notification."
      );

    }

  };


  // =========================================
  // MARK ALL AS READ
  // =========================================

  const markAllAsRead = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/admin/notifications/read-all",
        {
          method: "PUT",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to mark notifications as read."
        );

      }


      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) => ({
              ...notification,
              is_read: 1,
            })
          )
      );


    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to update notifications."
      );

    }

  };


  // =========================================
  // DELETE NOTIFICATION
  // =========================================

  const deleteNotification = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );


    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:5000/api/admin/notifications/${id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to delete notification."
        );

      }


      setNotifications(
        (previousNotifications) =>
          previousNotifications.filter(
            (notification) =>
              notification.id !== id
          )
      );


    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Unable to delete notification."
      );

    }

  };


  // =========================================
  // CLEAR ALL
  // =========================================

  const clearAll = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );


    if (!confirmed) {
      return;
    }


    try {

      for (
        const notification of notifications
      ) {

        await fetch(
          `http://localhost:5000/api/admin/notifications/${notification.id}`,
          {
            method: "DELETE",
          }
        );

      }


      setNotifications([]);


    } catch (error) {

      console.error(error);

      alert(
        "Some notifications could not be deleted."
      );

      loadNotifications();

    }

  };


  // =========================================
  // ICON
  // =========================================

  const getIcon = (type) => {

    switch (type) {

      case "application":
        return "▣";

      case "approved":
        return "✓";

      case "review":
        return "!";

      case "system":
        return "⚙";

      default:
        return "♢";

    }

  };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    const notificationDate =
      new Date(date);


    return notificationDate.toLocaleString(
      "en-GH",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  return (

    <div className="admin-dashboard">


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">

          Internship<span>Portal</span>

          <small>
            ADMIN
          </small>

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
            className="admin-nav-link"
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
            className="admin-nav-link active"
          >

            <span>♢</span>

            Notifications

            {unreadCount > 0 && (

              <span className="sidebar-notification-count">
                {unreadCount}
              </span>

            )}

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


        {/* HEADER */}

        <header className="admin-header">

          <div>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with activity across the internship portal.
            </p>

          </div>


          <div className="admin-header-right">

            <button className="admin-notification notification-active">

              ♢

              {unreadCount > 0 && (
                <span></span>
              )}

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
            PANEL
        ========================================= */}

        <section className="notifications-panel">


          {/* PANEL HEADER */}

          <div className="notifications-header">

            <div>

              <h2>

                Notifications

                {unreadCount > 0 && (

                  <span className="unread-badge">
                    {unreadCount} unread
                  </span>

                )}

              </h2>


              <p>
                Review recent activity and system updates.
              </p>

            </div>


            <div className="notification-actions">

              {unreadCount > 0 && (

                <button
                  onClick={markAllAsRead}
                >
                  ✓ Mark all as read
                </button>

              )}


              {notifications.length > 0 && (

                <button
                  className="clear-notifications"
                  onClick={clearAll}
                >
                  Clear all
                </button>

              )}

            </div>

          </div>


          {/* =========================================
              FILTERS
          ========================================= */}

          <div className="notification-filters">

            <button
              className={
                filter === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("All")
              }
            >
              All
            </button>


            <button
              className={
                filter === "Unread"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("Unread")
              }
            >
              Unread
            </button>


            <button
              className={
                filter === "Applications"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("Applications")
              }
            >
              Applications
            </button>


            <button
              className={
                filter === "Approved"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("Approved")
              }
            >
              Approved
            </button>


            <button
              className={
                filter === "Review"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("Review")
              }
            >
              Review
            </button>


            <button
              className={
                filter === "System"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("System")
              }
            >
              System
            </button>

          </div>


          {/* =========================================
              LOADING
          ========================================= */}

          {loading && (

            <div className="empty-notifications">

              <h3>
                Loading notifications...
              </h3>

            </div>

          )}


          {/* =========================================
              ERROR
          ========================================= */}

          {!loading && error && (

            <div className="empty-notifications">

              <div className="empty-notification-icon">
                !
              </div>

              <h3>
                Unable to load notifications
              </h3>

              <p>
                {error}
              </p>

              <button
                className="generate-report-btn"
                onClick={loadNotifications}
                style={{
                  marginTop: "15px",
                }}
              >
                Try Again
              </button>

            </div>

          )}


          {/* =========================================
              LIST
          ========================================= */}

          {!loading &&
            !error &&
            filteredNotifications.length === 0 && (

              <div className="empty-notifications">

                <div className="empty-notification-icon">
                  ✓
                </div>

                <h3>
                  You're all caught up
                </h3>

                <p>
                  There are no notifications to display.
                </p>

              </div>

            )}


          {!loading &&
            !error &&
            filteredNotifications.length > 0 && (

              <div className="notification-list">

                {filteredNotifications.map(
                  (notification) => (

                    <div
                      className={`notification-item ${
                        !notification.is_read
                          ? "unread"
                          : ""
                      }`}
                      key={notification.id}
                    >


                      {/* ICON */}

                      <div
                        className={`notification-icon ${notification.type}`}
                      >
                        {getIcon(
                          notification.type
                        )}
                      </div>


                      {/* CONTENT */}

                      <div className="notification-content">

                        <div className="notification-title-row">

                          <h3>
                            {notification.title}
                          </h3>


                          {!notification.is_read && (

                            <span className="new-label">
                              NEW
                            </span>

                          )}

                        </div>


                        <p>
                          {notification.message}
                        </p>


                        {notification.student_name && (

                          <small
                            style={{
                              display: "block",
                              marginBottom: "6px",
                              color: "#64748b",
                              fontSize: "11px",
                              fontWeight: "600",
                            }}
                          >
                            Student:{" "}
                            {notification.student_name}
                          </small>

                        )}


                        <span className="notification-time">
                          {formatTime(
                            notification.created_at
                          )}
                        </span>

                      </div>


                      {/* ACTIONS */}

                      <div className="notification-item-actions">

                        {!notification.is_read && (

                          <button
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            title="Mark as read"
                          >
                            ✓
                          </button>

                        )}


                        <button
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                          title="Delete notification"
                        >
                          ×
                        </button>

                      </div>

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

export default AdminNotifications;
