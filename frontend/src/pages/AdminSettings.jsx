
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminSettings.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

const API_URL = "http://localhost:5000";

function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");

  const [adminId, setAdminId] = useState(null);

  const [adminProfile, setAdminProfile] = useState({
    full_name: "",
    email: "",
  });

  const [applications, setApplications] = useState({
    accepting: true,
    requireDocuments: true,
    allowMultiple: false,
    autoNotification: true,
  });

  const [notifications, setNotifications] = useState({
    newApplication: true,
    applicationUpdate: true,
    systemUpdates: true,
    emailNotifications: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================================
  // GET LOGGED-IN ADMIN
  // =========================================

  useEffect(() => {
    const getAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        let storedAdmin = null;

        const adminData =
          localStorage.getItem("admin");

        if (adminData) {
          storedAdmin = JSON.parse(adminData);
        }

        if (!storedAdmin) {
          const adminDataAlt =
            localStorage.getItem("adminData");

          if (adminDataAlt) {
            storedAdmin =
              JSON.parse(adminDataAlt);
          }
        }

        if (!storedAdmin) {
          setError(
            "Administrator session not found. Please log in again."
          );
          setLoading(false);
          return;
        }

        const id =
          storedAdmin.id ||
          storedAdmin.adminId ||
          storedAdmin.admin_id;

        if (!id) {
          setError(
            "Administrator ID not found. Please log in again."
          );
          setLoading(false);
          return;
        }

        setAdminId(id);

        const response = await fetch(
          `${API_URL}/api/admin/auth/settings/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load administrator settings."
          );
        }

        setAdminProfile({
          full_name:
            data.admin.full_name || "",
          email:
            data.admin.email || "",
        });

      } catch (err) {
        console.error(
          "Load admin settings error:",
          err
        );

        setError(
          err.message ||
            "Unable to load administrator settings."
        );
      } finally {
        setLoading(false);
      }
    };

    getAdminData();
  }, []);


  // =========================================
  // PROFILE CHANGE
  // =========================================

  const handleProfileChange = (e) => {
    setAdminProfile({
      ...adminProfile,
      [e.target.name]: e.target.value,
    });
  };


  // =========================================
  // PASSWORD CHANGE
  // =========================================

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };


  // =========================================
  // APPLICATION TOGGLE
  // =========================================

  const toggleApplication = (name) => {
    setApplications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  // =========================================
  // NOTIFICATION TOGGLE
  // =========================================

  const toggleNotification = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  // =========================================
  // SAVE SETTINGS
  // =========================================

  const handleSave = async () => {
    try {
      setMessage("");
      setError("");
      setSaved(false);

      // =====================================
      // GENERAL SETTINGS
      // =====================================

      if (activeTab === "general") {
        if (!adminProfile.full_name.trim()) {
          setError(
            "Administrator name is required."
          );
          return;
        }

        if (!adminProfile.email.trim()) {
          setError(
            "Administrator email is required."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/auth/settings/${adminId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              full_name:
                adminProfile.full_name,
              email:
                adminProfile.email,
            }),
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

        // Update local storage

        const storedAdmin =
          localStorage.getItem("admin");

        if (storedAdmin) {
          const admin =
            JSON.parse(storedAdmin);

          admin.full_name =
            adminProfile.full_name;

          admin.email =
            adminProfile.email;

          localStorage.setItem(
            "admin",
            JSON.stringify(admin)
          );
        }

        setMessage(
          "Administrator profile updated successfully."
        );
      }


      // =====================================
      // APPLICATION SETTINGS
      // =====================================

      if (activeTab === "applications") {
        localStorage.setItem(
          "applicationSettings",
          JSON.stringify(applications)
        );

        setMessage(
          "Application settings saved successfully."
        );
      }


      // =====================================
      // NOTIFICATION SETTINGS
      // =====================================

      if (activeTab === "notifications") {
        localStorage.setItem(
          "notificationSettings",
          JSON.stringify(notifications)
        );

        setMessage(
          "Notification settings saved successfully."
        );
      }


      // =====================================
      // SECURITY / PASSWORD
      // =====================================

      if (activeTab === "security") {
        if (
          !passwords.currentPassword ||
          !passwords.newPassword ||
          !passwords.confirmPassword
        ) {
          setError(
            "Please complete all password fields."
          );
          return;
        }

        if (
          passwords.newPassword !==
          passwords.confirmPassword
        ) {
          setError(
            "New passwords do not match."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/auth/change-password/${adminId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              currentPassword:
                passwords.currentPassword,

              newPassword:
                passwords.newPassword,

              confirmPassword:
                passwords.confirmPassword,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to change password."
          );
        }

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setMessage(
          "Password changed successfully."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(
        "Save settings error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while saving."
      );
    }
  };


  // =========================================
  // LOAD LOCAL SETTINGS
  // =========================================

  useEffect(() => {
    const savedApplications =
      localStorage.getItem(
        "applicationSettings"
      );

    const savedNotifications =
      localStorage.getItem(
        "notificationSettings"
      );

    if (savedApplications) {
      setApplications(
        JSON.parse(savedApplications)
      );
    }

    if (savedNotifications) {
      setNotifications(
        JSON.parse(savedNotifications)
      );
    }
  }, []);


  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

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
            className="admin-nav-link"
          >
            <span>♢</span>
            Notifications
          </Link>


          <Link
            to="/admin/settings"
            className="admin-nav-link active"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>


        <div className="admin-sidebar-bottom">
          <AdminLogoutButton />
        </div>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <h1>Settings</h1>

            <p>
              Manage your administrator account and portal settings.
            </p>
          </div>


          <div className="admin-header-right">

            <button className="admin-notification">
              ♢
            </button>


            <div className="admin-user">

              <div className="admin-avatar">
                {adminProfile.full_name
                  ? adminProfile.full_name
                      .substring(0, 2)
                      .toUpperCase()
                  : "AD"}
              </div>

              <div>
                <strong>
                  {adminProfile.full_name ||
                    "Administrator"}
                </strong>

                <small>
                  System Admin
                </small>
              </div>

            </div>

          </div>

        </header>


        {/* LOADING */}

        {loading ? (

          <div className="settings-content">
            Loading settings...
          </div>

        ) : (

          <section className="settings-container">


            {/* SETTINGS NAVIGATION */}

            <div className="settings-sidebar">

              <button
                className={
                  activeTab === "general"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("general")
                }
              >
                <span>⚙</span>
                General
              </button>


              <button
                className={
                  activeTab === "applications"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("applications")
                }
              >
                <span>▣</span>
                Applications
              </button>


              <button
                className={
                  activeTab === "notifications"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("notifications")
                }
              >
                <span>♢</span>
                Notifications
              </button>


              <button
                className={
                  activeTab === "security"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("security")
                }
              >
                <span>▣</span>
                Security
              </button>

            </div>


            {/* SETTINGS CONTENT */}

            <div className="settings-content">

              {error && (
                <div
                  style={{
                    marginBottom: "18px",
                    padding: "12px",
                    borderRadius: "7px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}


              {message && (
                <div
                  style={{
                    marginBottom: "18px",
                    padding: "12px",
                    borderRadius: "7px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    fontSize: "14px",
                  }}
                >
                  ✓ {message}
                </div>
              )}


              {/* GENERAL */}

              {activeTab === "general" && (

                <div>

                  <div className="settings-title">

                    <h2>
                      General Settings
                    </h2>

                    <p>
                      Manage your administrator account information.
                    </p>

                  </div>


                  <div className="settings-form">

                    <div className="settings-field">

                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="full_name"
                        value={
                          adminProfile.full_name
                        }
                        onChange={
                          handleProfileChange
                        }
                      />

                    </div>


                    <div className="settings-field">

                      <label>
                        Administrator Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={
                          adminProfile.email
                        }
                        onChange={
                          handleProfileChange
                        }
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* APPLICATIONS */}

              {activeTab === "applications" && (

                <div>

                  <div className="settings-title">

                    <h2>
                      Application Settings
                    </h2>

                    <p>
                      Control how internship applications are handled.
                    </p>

                  </div>


                  <div className="settings-options">

                    <div className="settings-option">

                      <div>
                        <strong>
                          Accept Applications
                        </strong>

                        <p>
                          Allow students to submit new internship applications.
                        </p>
                      </div>


                      <button
                        className={`toggle ${
                          applications.accepting
                            ? "on"
                            : ""
                        }`}
                        onClick={() =>
                          toggleApplication(
                            "accepting"
                          )
                        }
                      >
                        <span></span>
                      </button>

                    </div>


                    <div className="settings-option">

                      <div>
                        <strong>
                          Require Documents
                        </strong>

                        <p>
                          Applicants must upload required documents.
                        </p>
                      </div>


                      <button
                        className={`toggle ${
                          applications.requireDocuments
                            ? "on"
                            : ""
                        }`}
                        onClick={() =>
                          toggleApplication(
                            "requireDocuments"
                          )
                        }
                      >
                        <span></span>
                      </button>

                    </div>


                    <div className="settings-option">

                      <div>
                        <strong>
                          Allow Multiple Applications
                        </strong>

                        <p>
                          Allow an applicant to submit more than one application.
                        </p>
                      </div>


                      <button
                        className={`toggle ${
                          applications.allowMultiple
                            ? "on"
                            : ""
                        }`}
                        onClick={() =>
                          toggleApplication(
                            "allowMultiple"
                          )
                        }
                      >
                        <span></span>
                      </button>

                    </div>


                    <div className="settings-option">

                      <div>
                        <strong>
                          Application Notifications
                        </strong>

                        <p>
                          Notify administrators when a new application is submitted.
                        </p>
                      </div>


                      <button
                        className={`toggle ${
                          applications.autoNotification
                            ? "on"
                            : ""
                        }`}
                        onClick={() =>
                          toggleApplication(
                            "autoNotification"
                          )
                        }
                      >
                        <span></span>
                      </button>

                    </div>

                  </div>

                </div>

              )}


              {/* NOTIFICATIONS */}

              {activeTab === "notifications" && (

                <div>

                  <div className="settings-title">

                    <h2>
                      Notification Settings
                    </h2>

                    <p>
                      Choose which events administrators are notified about.
                    </p>

                  </div>


                  <div className="settings-options">

                    {[
                      [
                        "newApplication",
                        "New Applications",
                        "Receive notifications when students submit applications.",
                      ],
                      [
                        "applicationUpdate",
                        "Application Updates",
                        "Receive updates when an application status changes.",
                      ],
                      [
                        "systemUpdates",
                        "System Updates",
                        "Receive important system and maintenance notifications.",
                      ],
                      [
                        "emailNotifications",
                        "Email Notifications",
                        "Send important notifications to the administrator email.",
                      ],
                    ].map(
                      ([key, title, description]) => (

                        <div
                          className="settings-option"
                          key={key}
                        >

                          <div>
                            <strong>
                              {title}
                            </strong>

                            <p>
                              {description}
                            </p>
                          </div>


                          <button
                            className={`toggle ${
                              notifications[key]
                                ? "on"
                                : ""
                            }`}
                            onClick={() =>
                              toggleNotification(key)
                            }
                          >
                            <span></span>
                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* SECURITY */}

              {activeTab === "security" && (

                <div>

                  <div className="settings-title">

                    <h2>
                      Security
                    </h2>

                    <p>
                      Change your administrator account password.
                    </p>

                  </div>


                  <div className="settings-form">

                    <div className="settings-field">

                      <label>
                        Current Password
                      </label>

                      <input
                        type="password"
                        name="currentPassword"
                        value={
                          passwords.currentPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter current password"
                      />

                    </div>


                    <div className="settings-field">

                      <label>
                        New Password
                      </label>

                      <input
                        type="password"
                        name="newPassword"
                        value={
                          passwords.newPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Enter new password"
                      />

                    </div>


                    <div className="settings-field">

                      <label>
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        value={
                          passwords.confirmPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        placeholder="Confirm new password"
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* FOOTER */}

              <div className="settings-footer">

                {saved && (
                  <span className="saved-message">
                    ✓ Changes saved
                  </span>
                )}


                <button
                  className="save-settings"
                  onClick={handleSave}
                >
                  Save Changes
                </button>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default AdminSettings;
