
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";
import "../DarkMode.css";
import NotificationBell from "../components/NotificationBell";
import LogoutButton from "../components/LogoutButton";

function Settings() {

  // =========================================
  // API
  // =========================================

  const API_URL = "https://internship-jh6u.vercel.app";


  // =========================================
  // STUDENT
  // =========================================

  const student =
    JSON.parse(localStorage.getItem("student")) || {};

  const studentId = student.id;

  const studentName =
    student.full_name || "Student";

  const studentEmail =
    student.email || "No email available";


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
  // SETTINGS STATE
  // =========================================

  const [settings, setSettings] = useState({
    email_notifications: true,
    application_updates: true,
    deadline_reminders: true,
    profile_visibility: true,
    dark_mode: false,
  });


  // =========================================
  // PAGE STATE
  // =========================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // =========================================
  // APPLY DARK MODE
  // =========================================

  const applyDarkMode = (enabled) => {

    if (enabled) {

      document.body.classList.add("dark-mode");

      localStorage.setItem(
        "dark_mode",
        "true"
      );

    } else {

      document.body.classList.remove("dark-mode");

      localStorage.setItem(
        "dark_mode",
        "false"
      );

    }

  };


  // =========================================
  // GET SETTINGS
  // =========================================

  const fetchSettings = async () => {

    if (!studentId) {

      setError(
        "Student account could not be found."
      );

      setLoading(false);

      return;
    }


    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        `${API_URL}/api/settings/student/${studentId}`
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to retrieve settings."
        );

      }


      if (data.settings) {

        const loadedSettings = {

          email_notifications:
            Boolean(
              data.settings.email_notifications
            ),

          application_updates:
            Boolean(
              data.settings.application_updates
            ),

          deadline_reminders:
            Boolean(
              data.settings.deadline_reminders
            ),

          profile_visibility:
            Boolean(
              data.settings.profile_visibility
            ),

          dark_mode:
            Boolean(
              data.settings.dark_mode
            ),

        };


        setSettings(
          loadedSettings
        );


        // Apply database setting
        applyDarkMode(
          loadedSettings.dark_mode
        );

      }

    } catch (err) {

      console.error(
        "Settings loading error:",
        err
      );


      setError(
        err.message ||
        "Unable to load settings."
      );


      // Use saved local preference
      const savedDarkMode =
        localStorage.getItem(
          "dark_mode"
        ) === "true";


      applyDarkMode(
        savedDarkMode
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD SETTINGS
  // =========================================

  useEffect(() => {

    fetchSettings();

  }, [studentId]);


  // =========================================
  // HANDLE TOGGLE
  // =========================================

  const handleToggle = (
    settingName
  ) => {

    setSettings(
      (previous) => {

        const updatedSettings = {

          ...previous,

          [settingName]:
            !previous[settingName],

        };


        // Apply dark mode immediately
        if (
          settingName ===
          "dark_mode"
        ) {

          applyDarkMode(
            updatedSettings.dark_mode
          );

        }


        return updatedSettings;

      }
    );


    setMessage("");

    setError("");

  };


  // =========================================
  // SAVE SETTINGS
  // =========================================

  const handleSaveSettings =
    async () => {

      if (!studentId) {

        setError(
          "Student account could not be found."
        );

        return;

      }


      try {

        setSaving(true);

        setMessage("");

        setError("");


        const response =
          await fetch(
            `${API_URL}/api/settings/student/${studentId}`,
            {

              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  settings
                ),

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to save settings."
          );

        }


        if (data.settings) {

          const savedSettings = {

            email_notifications:
              Boolean(
                data.settings.email_notifications
              ),

            application_updates:
              Boolean(
                data.settings.application_updates
              ),

            deadline_reminders:
              Boolean(
                data.settings.deadline_reminders
              ),

            profile_visibility:
              Boolean(
                data.settings.profile_visibility
              ),

            dark_mode:
              Boolean(
                data.settings.dark_mode
              ),

          };


          setSettings(
            savedSettings
          );


          applyDarkMode(
            savedSettings.dark_mode
          );

        } else {

          applyDarkMode(
            settings.dark_mode
          );

        }


        setMessage(
          "Your settings have been saved successfully."
        );


      } catch (err) {

        console.error(
          "Save settings error:",
          err
        );


        setError(
          err.message ||
          "Unable to save settings."
        );

      } finally {

        setSaving(false);

      }

    };


  // =========================================
  // LOADING SCREEN
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

          <div className="settings-loading">
            Loading settings...
          </div>

        </main>

      </div>

    );

  }


  // =========================================
  // PAGE
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
            className="sidebar-link active"
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
          MAIN CONTENT
      ========================================= */}

      <main className="dashboard-main">


        {/* =========================================
            HEADER
        ========================================= */}

        <header className="dashboard-header">

          <div>

            <h1>
              Settings
            </h1>

            <p>
              Manage your account preferences and security.
            </p>

          </div>


          <div className="header-profile">


            <Link
              to="/notifications"
              className="notification-wrapper"
              title="Notifications"
            >

              <div className="notification-icon">

                <NotificationBell />

              </div>

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
            SUCCESS MESSAGE
        ========================================= */}

        {message && (

          <div className="settings-success-message">

            <span>
              ✓
            </span>

            {message}

          </div>

        )}


        {/* =========================================
            ERROR MESSAGE
        ========================================= */}

        {error && (

          <div className="settings-error-message">

            <span>
              !
            </span>

            {error}

          </div>

        )}


        {/* =========================================
            ACCOUNT SETTINGS
        ========================================= */}

        <section className="settings-card">


          <div className="settings-card-header">

            <div>

              <h2>
                Account Settings
              </h2>

              <p>
                Manage your basic account preferences.
              </p>

            </div>

          </div>


          {/* EMAIL */}

          <div className="settings-row">

            <div className="settings-row-icon">
              ✉
            </div>


            <div className="settings-row-content">

              <h3>
                Email Address
              </h3>

              <p>
                {studentEmail}
              </p>

            </div>


            <button
              className="settings-action"
              type="button"
              onClick={() =>
                alert(
                  "Email change will be added next."
                )
              }
            >
              Change
            </button>

          </div>


          {/* PASSWORD */}

          <div className="settings-row">

            <div className="settings-row-icon">
              🔒
            </div>


            <div className="settings-row-content">

              <h3>
                Password
              </h3>

              <p>
                Keep your account secure with a strong password.
              </p>

            </div>


            <button
              className="settings-action"
              type="button"
              onClick={() =>
                alert(
                  "Password change will be added next."
                )
              }
            >
              Change
            </button>

          </div>


        </section>


        {/* =========================================
            NOTIFICATION SETTINGS
        ========================================= */}

        <section className="settings-card">


          <div className="settings-card-header">

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Choose how you want to receive notifications.
              </p>

            </div>

          </div>


          {/* EMAIL NOTIFICATIONS */}

          <div className="settings-toggle-row">

            <div>

              <h3>
                Email Notifications
              </h3>

              <p>
                Receive important application updates by email.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={
                  settings.email_notifications
                }
                onChange={() =>
                  handleToggle(
                    "email_notifications"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>


          {/* APPLICATION UPDATES */}

          <div className="settings-toggle-row">

            <div>

              <h3>
                Application Updates
              </h3>

              <p>
                Get notified when your application status changes.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={
                  settings.application_updates
                }
                onChange={() =>
                  handleToggle(
                    "application_updates"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>


          {/* DEADLINE REMINDERS */}

          <div className="settings-toggle-row">

            <div>

              <h3>
                Deadline Reminders
              </h3>

              <p>
                Receive reminders about upcoming internship deadlines.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={
                  settings.deadline_reminders
                }
                onChange={() =>
                  handleToggle(
                    "deadline_reminders"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>


        </section>


        {/* =========================================
            PRIVACY
        ========================================= */}

        <section className="settings-card">


          <div className="settings-card-header">

            <div>

              <h2>
                Privacy
              </h2>

              <p>
                Control how your information is used.
              </p>

            </div>

          </div>


          {/* PROFILE VISIBILITY */}

          <div className="settings-toggle-row">

            <div>

              <h3>
                Profile Visibility
              </h3>

              <p>
                Allow authorized internship administrators to view your profile.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={
                  settings.profile_visibility
                }
                onChange={() =>
                  handleToggle(
                    "profile_visibility"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>


          {/* DARK MODE */}

          <div className="settings-toggle-row">

            <div>

              <h3>
                Dark Mode
              </h3>

              <p>
                Use a darker appearance throughout the student portal.
              </p>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={
                  settings.dark_mode
                }
                onChange={() =>
                  handleToggle(
                    "dark_mode"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>


        </section>


        {/* =========================================
            DANGER ZONE
        ========================================= */}

        <section className="settings-card danger-zone">


          <div className="settings-card-header">

            <div>

              <h2>
                Account Actions
              </h2>

              <p>
                Actions that affect your account.
              </p>

            </div>

          </div>


          <div className="danger-row">

            <div>

              <h3>
                Delete Account
              </h3>

              <p>
                Permanently delete your account and associated information.
              </p>

            </div>


            <button
              className="delete-account-btn"
              type="button"
              onClick={() =>
                alert(
                  "Account deletion will be added after confirmation and security checks."
                )
              }
            >
              Delete Account
            </button>

          </div>


        </section>


        {/* =========================================
            SAVE
        ========================================= */}

        <div className="settings-save-area">

          <button
            className="save-settings-btn"
            type="button"
            onClick={
              handleSaveSettings
            }
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>


      </main>

    </div>

  );

}

export default Settings;
