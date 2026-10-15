import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css"
import "./Profile.css";
import NotificationBell from "../components/NotificationBell";
import LogoutButton from "../components/LogoutButton";

function Profile() {
  const navigate = useNavigate();

  const storedStudent = localStorage.getItem("student");

  const [student, setStudent] = useState(
    storedStudent ? JSON.parse(storedStudent) : null
  );

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!student) {
    navigate("/login");
    return null;
  }

  // =========================================
  // STUDENT INFORMATION
  // =========================================

  const fullName = student.full_name || "Student";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const nameParts = fullName.trim().split(" ");

  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // =========================================
  // PERSONAL FORM
  // =========================================

  const [personalForm, setPersonalForm] = useState({
    firstName: firstName,
    lastName: lastName,
    phone: student.phone || "",
    date_of_birth: student.date_of_birth || "",
    gender: student.gender || "",
    address: student.address || "",
  });

  // =========================================
  // ACADEMIC FORM
  // =========================================

  const [academicForm, setAcademicForm] = useState({
    university: student.university || "",
    program: student.program || "",
    level: student.level || "",
    student_id: student.student_id || "",
    gpa: student.gpa || "",
    expected_graduation: student.expected_graduation || "",
  });

  // =========================================
  // PROFILE COMPLETION
  // =========================================

  const profileFields = [
    student.full_name,
    student.email,
    student.phone,
    student.date_of_birth,
    student.gender,
    student.address,
    student.university,
    student.program,
    student.level,
    student.student_id,
    student.gpa,
    student.expected_graduation,
  ];

  const completedFields = profileFields.filter(
    (field) =>
      field !== null &&
      field !== undefined &&
      String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  // =========================================
  // HANDLE PERSONAL INPUT
  // =========================================

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    setPersonalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE ACADEMIC INPUT
  // =========================================

  const handleAcademicChange = (e) => {
    const { name, value } = e.target;

    setAcademicForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // UPDATE PROFILE
  // =========================================

  const updateProfile = async (type) => {
    setSaving(true);
    setSuccess("");
    setError("");

    const updatedFullName =
      `${personalForm.firstName} ${personalForm.lastName}`.trim();

    try {
      const response = await fetch(
        "https://internship-jh6u.vercel.app/api/auth/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: student.id,

            full_name: updatedFullName,

            phone: personalForm.phone,
            date_of_birth: personalForm.date_of_birth,
            gender: personalForm.gender,
            address: personalForm.address,

            university: academicForm.university,
            program: academicForm.program,
            level: academicForm.level,
            student_id: academicForm.student_id,
            gpa: academicForm.gpa,
            expected_graduation:
              academicForm.expected_graduation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to update profile."
        );

        setSaving(false);
        return;
      }

      // =========================================
      // UPDATE STUDENT STATE
      // =========================================

      setStudent(data.student);

      // =========================================
      // UPDATE LOCAL STORAGE
      // =========================================

      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      // =========================================
      // UPDATE PERSONAL FORM
      // =========================================

      const updatedNameParts =
        (data.student.full_name || "")
          .trim()
          .split(" ");

      setPersonalForm({
        firstName: updatedNameParts[0] || "",
        lastName:
          updatedNameParts.slice(1).join(" ") || "",
        phone: data.student.phone || "",
        date_of_birth:
          data.student.date_of_birth || "",
        gender: data.student.gender || "",
        address: data.student.address || "",
      });

      // =========================================
      // UPDATE ACADEMIC FORM
      // =========================================

      setAcademicForm({
        university:
          data.student.university || "",
        program:
          data.student.program || "",
        level:
          data.student.level || "",
        student_id:
          data.student.student_id || "",
        gpa:
          data.student.gpa || "",
        expected_graduation:
          data.student.expected_graduation || "",
      });

      // =========================================
      // CLOSE EDIT SECTION
      // =========================================

      if (type === "personal") {
        setEditingPersonal(false);
      }

      if (type === "academic") {
        setEditingAcademic(false);
      }

      // =========================================
      // SUCCESS MESSAGE
      // =========================================

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    }

    setSaving(false);
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    navigate("/");
  };

  return (
    <div className="dashboard">

      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-logo">
          Internship<span>Portal</span>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className="sidebar-link"
            onClick={() => setSidebarOpen(false)}
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/apply"
            className="sidebar-link"
            onClick={() => setSidebarOpen(false)}
          >
            <span>▣</span>
            My Application
          </Link>

          <Link
            to="/application-status"
            className="sidebar-link"
            onClick={() => setSidebarOpen(false)}
          >
            <span>▤</span>
            Application Status
          </Link>

          <Link
            to="/notifications"
            className="sidebar-link"
            onClick={() => setSidebarOpen(false)}
          >
            <span>♢</span>
            Notifications
          </Link>

          <Link
            to="/profile"
            className="sidebar-link active"
            onClick={() => setSidebarOpen(false)}
          >
            <span>◯</span>
            My Profile
          </Link>

          <Link
            to="/settings"
            className="sidebar-link"
            onClick={() => setSidebarOpen(false)}
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
            <h1>My Profile</h1>

            <p>
              Manage your personal and academic information.
            </p>
          </div>

          <div className="header-profile">

            <div className="notification-icon">
              <NotificationBell />
            </div>

            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-info">

              <strong>
                {fullName}
              </strong>

              <span>
                Applicant
              </span>

            </div>

          </div>

        </header>


        {/* =========================================
            SUCCESS / ERROR MESSAGE
        ========================================= */}

        {success && (
          <div className="profile-success">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* =========================================
            PROFILE OVERVIEW
        ========================================= */}

        <section className="profile-overview">

          <div className="profile-large-avatar">
            {initials}
          </div>

          <div className="profile-overview-info">

            <h2>
              {fullName}
            </h2>

            <p>
              {student.program ||
                "Programme not added"}
            </p>

            <span>
              {student.university ||
                "Institution not added"}
            </span>

          </div>

          <button
            className="profile-photo-btn"
            type="button"
          >
            Change Photo
          </button>

        </section>


        {/* =========================================
            PROFILE COMPLETION
        ========================================= */}

        <section className="profile-completion">

          <div className="completion-info">

            <div>

              <h3>
                Profile Completion
              </h3>

              <p>
                Complete your profile to improve
                your internship application.
              </p>

            </div>

            <strong>
              {profileCompletion}%
            </strong>

          </div>

          <div className="completion-bar">

            <div
              className="completion-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

          <span className="completion-message">

            {profileCompletion === 100
              ? "Your profile is complete."
              : profileCompletion >= 75
              ? "You're almost there. Add your remaining information."
              : profileCompletion >= 50
              ? "Good progress. Complete a few more details."
              : "Complete your profile to improve your internship application."}

          </span>

        </section>


        {/* =========================================
            PERSONAL INFORMATION
        ========================================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your basic personal details.
              </p>

            </div>

            <button
              className="edit-profile-btn"
              onClick={() =>
                setEditingPersonal(
                  !editingPersonal
                )
              }
            >
              {editingPersonal
                ? "Cancel"
                : "Edit"}
            </button>

          </div>


          {!editingPersonal ? (

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  First Name
                </span>

                <strong>
                  {firstName}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Last Name
                </span>

                <strong>
                  {lastName ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Email Address
                </span>

                <strong>
                  {student.email ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Phone Number
                </span>

                <strong>
                  {student.phone ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Date of Birth
                </span>

                <strong>
                  {student.date_of_birth ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Gender
                </span>

                <strong>
                  {student.gender ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail profile-full-width">

                <span>
                  Residential Address
                </span>

                <strong>
                  {student.address ||
                    "Not added"}
                </strong>

              </div>

            </div>

          ) : (

            <div className="profile-edit-form">

              <div className="edit-form-grid">

                <div className="edit-field">

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={personalForm.firstName}
                    onChange={handlePersonalChange}
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={personalForm.lastName}
                    onChange={handlePersonalChange}
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={student.email}
                    disabled
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={personalForm.phone}
                    onChange={handlePersonalChange}
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={
                      personalForm.date_of_birth
                    }
                    onChange={handlePersonalChange}
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={personalForm.gender}
                    onChange={handlePersonalChange}
                  >

                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="edit-field edit-full-width">

                  <label>
                    Residential Address
                  </label>

                  <textarea
                    name="address"
                    value={personalForm.address}
                    onChange={handlePersonalChange}
                    placeholder="Enter your residential address"
                  />

                </div>

              </div>

              <button
                className="save-profile-btn"
                onClick={() =>
                  updateProfile("personal")
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          )}

        </section>


        {/* =========================================
            ACADEMIC INFORMATION
        ========================================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Academic Information
              </h2>

              <p>
                Your current academic details.
              </p>

            </div>

            <button
              className="edit-profile-btn"
              onClick={() =>
                setEditingAcademic(
                  !editingAcademic
                )
              }
            >
              {editingAcademic
                ? "Cancel"
                : "Edit"}
            </button>

          </div>


          {!editingAcademic ? (

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  University / Institution
                </span>

                <strong>
                  {student.university ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Programme
                </span>

                <strong>
                  {student.program ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Level
                </span>

                <strong>
                  {student.level ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Student ID
                </span>

                <strong>
                  {student.student_id ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  GPA / CGPA
                </span>

                <strong>
                  {student.gpa ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Expected Graduation
                </span>

                <strong>
                  {student.expected_graduation ||
                    "Not added"}
                </strong>

              </div>

            </div>

          ) : (

            <div className="profile-edit-form">

              <div className="edit-form-grid">

                <div className="edit-field">

                  <label>
                    University / Institution
                  </label>

                  <input
                    type="text"
                    name="university"
                    value={
                      academicForm.university
                    }
                    onChange={handleAcademicChange}
                    placeholder="University of Cape Coast"
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Programme
                  </label>

                  <input
                    type="text"
                    name="program"
                    value={
                      academicForm.program
                    }
                    onChange={handleAcademicChange}
                    placeholder="Computer Science"
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Level
                  </label>

                  <input
                    type="text"
                    name="level"
                    value={
                      academicForm.level
                    }
                    onChange={handleAcademicChange}
                    placeholder="Level 400"
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Student ID
                  </label>

                  <input
                    type="text"
                    name="student_id"
                    value={
                      academicForm.student_id
                    }
                    onChange={handleAcademicChange}
                  />

                </div>

                <div className="edit-field">

                  <label>
                    GPA / CGPA
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    name="gpa"
                    value={
                      academicForm.gpa
                    }
                    onChange={handleAcademicChange}
                    placeholder="3.42"
                  />

                </div>

                <div className="edit-field">

                  <label>
                    Expected Graduation
                  </label>

                  <input
                    type="number"
                    name="expected_graduation"
                    value={
                      academicForm.expected_graduation
                    }
                    onChange={handleAcademicChange}
                    placeholder="2026"
                  />

                </div>

              </div>

              <button
                className="save-profile-btn"
                onClick={() =>
                  updateProfile("academic")
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          )}

        </section>


        {/* =========================================
            ACCOUNT INFORMATION
        ========================================= */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Account Information
              </h2>

              <p>
                Information about your portal account.
              </p>

            </div>

          </div>


          <div className="profile-details-grid">

            <div className="profile-detail">

              <span>
                Account Status
              </span>

              <strong className="account-active">
                Active
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Account Type
              </span>

              <strong>
                Applicant
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Registered On
              </span>

              <strong>
                {student.created_at
                  ? new Date(
                      student.created_at
                    ).toLocaleDateString()
                  : "Account created successfully"}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Last Login
              </span>

              <strong>
                Today
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;