import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  const student = JSON.parse(
    localStorage.getItem("student")
  ) || {};

  const studentId = student.id;

  const fetchUnreadCount = async () => {
    try {
      if (!studentId) {
        setUnreadCount(0);
        return;
      }

      const response = await fetch(
        `https://internship-jh6u.vercel.app/api/notifications/student/${studentId}/unread-count`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch notification count.");
      }

      const data = await response.json();

      setUnreadCount(
        Number(data.unreadCount) || 0
      );

    } catch (error) {
      console.error(
        "Notification count error:",
        error
      );
    }
  };


  useEffect(() => {

    fetchUnreadCount();

    // Check for new notifications every 5 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      clearInterval(interval);
    };

  }, [studentId]);


  return (
    <Link
      to="/notifications"
      className="notification-bell"
      aria-label="Notifications"
    >

      <span className="notification-symbol">
        ♢
      </span>


      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}

    </Link>
  );
}

export default NotificationBell;