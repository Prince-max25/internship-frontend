
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Apply.css";
import NotificationBell from "../components/NotificationBell";

function Apply() {
  const navigate = useNavigate();

  // =========================================
  // GET LOGGED-IN STUDENT
  // =========================================

  const storedStudent = localStorage.getItem("student");

  let student = null;

  try {
    student = storedStudent ? JSON.parse(storedStudent) : null;
  } catch (error) {
    console.error("Invalid student data:", error);
    localStorage.removeItem("student");
  }

  // =========================================
  // STATE
  // =========================================

  const [currentStep, setCurrentStep] = useState(1);

  const [departments, setDepartments] = useState([]);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    country: "Ghana",

    university: "",
    program: "",
    level: "",
    student_id: "",
    gpa: "",
    expected_graduation: "",

    department_id: "",
    start_date: "",
    end_date: "",
    preferred_location: "",
    motivation: "",

    cv: null,
    transcript: null,
    cover_letter: null,
  });

  // =========================================
  // CHECK LOGIN
  // =========================================

  useEffect(() => {
    if (!student) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // =========================================
  // LOAD STUDENT DATA
  // =========================================

  useEffect(() => {
    if (!student) return;

    const nameParts = (student.full_name || "")
      .trim()
      .split(/\s+/);

    setFormData((prev) => ({
      ...prev,

      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",

      email: student.email || "",
      phone: student.phone || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "",
      address: student.address || "",

      university: student.university || "",
      program: student.program || "",
      level: student.level || "",
      student_id: student.student_id || "",
      gpa: student.gpa || "",
      expected_graduation:
        student.expected_graduation || "",
    }));
  }, []);

  // =========================================
  // LOAD DEPARTMENTS
  // =========================================

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/departments"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load departments."
          );
        }

        setDepartments(data);
      } catch (error) {
        console.error(
          "Department loading error:",
          error
        );

        setError(
          "Unable to load internship departments."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  // =========================================
  // HANDLE TEXT INPUTS
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // HANDLE FILES
  // =========================================

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
    ];

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Only PDF, DOC and DOCX files are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        `${file.name} is larger than the 5MB limit.`
      );

      e.target.value = "";
      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  // =========================================
  // NEXT STEP
  // =========================================

  const nextStep = () => {
    setError("");
    setMessage("");

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================================
  // PREVIOUS STEP
  // =========================================

  const previousStep = () => {
    setError("");
    setMessage("");

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================================
  // SUBMIT APPLICATION
  // =========================================

  const submitApplication = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!student || !student.id) {
        throw new Error(
          "Student information could not be found. Please log in again."
        );
      }

      if (!formData.department_id) {
        throw new Error(
          "Please select a department."
        );
      }

      if (!formData.cv) {
        throw new Error(
          "Please upload your CV."
        );
      }

      if (!formData.transcript) {
        throw new Error(
          "Please upload your academic transcript."
        );
      }

      if (!formData.cover_letter) {
        throw new Error(
          "Please upload your cover letter."
        );
      }

      

      // =========================================
      // CREATE MULTIPART FORMDATA
      // =========================================

      const dataToSend = new FormData();

      dataToSend.append(
        "student_id",
        String(student.id)
      );

      dataToSend.append(
        "department_id",
        String(formData.department_id)
      );

      dataToSend.append(
        "start_date",
        formData.start_date || ""
      );

      dataToSend.append(
        "end_date",
        formData.end_date || ""
      );

      dataToSend.append(
        "preferred_location",
        formData.preferred_location || ""
      );

      dataToSend.append(
        "motivation",
        formData.motivation || ""
      );

      // =========================================
      // UPLOAD ACTUAL FILES
      // =========================================

      dataToSend.append(
        "cv",
        formData.cv
      );

      dataToSend.append(
        "transcript",
        formData.transcript
      );

      dataToSend.append(
        "cover_letter",
        formData.cover_letter
      );

      // =========================================
      // SEND APPLICATION
      // =========================================

      const response = await fetch(
        "http://localhost:5000/api/applications/submit",
        {
          method: "POST",
          body: dataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit application."
        );
      }

      // =========================================
      // SUCCESS
      // =========================================

      setMessage(
        "Application submitted successfully!"
      );

      setTimeout(() => {
        navigate("/application-status");
      }, 4500);
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      setError(
        error.message ||
          "Unable to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    navigate("/");
  };

  // =========================================
  // SIDEBAR
  // =========================================

  const sidebarLinks = [
    {
      path: "/dashboard",
      icon: "⌂",
      label: "Dashboard",
    },
    {
      path: "/apply",
      icon: "▣",
      label: "My Application",
    },
    {
      path: "/application-status",
      icon: "▤",
      label: "Application Status",
    },
    {
      path: "/notifications",
      icon: "♢",
      label: "Notifications",
    },
    {
      path: "/profile",
      icon: "◯",
      label: "My Profile",
    },
    {
      path: "/settings",
      icon: "⚙",
      label: "Settings",
    },
  ];

  // =========================================
  // STEPS
  // =========================================

  const steps = [
    "Personal Information",
    "Academic Information",
    "Internship Preferences",
    "Documents",
    "Review & Submit",
  ];

  // =========================================
  // IF NOT LOGGED IN
  // =========================================

  if (!student) {
    return null;
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="dashboard application-page">

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          Internship<span>Portal</span>
        </div>

        <nav className="sidebar-nav">

          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${
                link.path === "/apply"
                  ? "active"
                  : ""
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>
              My Application
            </h1>

            <p>
              Complete and submit your internship application.
            </p>
          </div>

          <div className="header-profile">

            <div className="notification-icon">
              <NotificationBell />
            </div>

            <div className="profile-avatar">
              {(
                formData.firstName[0] || "S"
              ).toUpperCase()}
              {(
                formData.lastName[0] || ""
              ).toUpperCase()}
            </div>

            <div className="profile-info">

              <strong>
                {formData.firstName}{" "}
                {formData.lastName}
              </strong>

              <span>
                Applicant
              </span>

            </div>

          </div>

        </header>

        {/* ===================================== */}
        {/* APPLICATION CONTENT */}
        {/* ===================================== */}

        <div className="application-content">

          {/* TITLE */}

          <div className="application-title">

            <div>

              <p>
                INTERNSHIP APPLICATION
              </p>

              <h2>
                Complete Your Application
              </h2>

              <span>
                Provide accurate information to complete
                your internship application.
              </span>

            </div>

            <Link
              to="/dashboard"
              className="save-exit"
            >
              Save & Exit
            </Link>

          </div>

          {/* ===================================== */}
          {/* MESSAGES */}
          {/* ===================================== */}

          {message && (
            <div className="profile-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* ===================================== */}
          {/* STEPS */}
          {/* ===================================== */}

          <div className="step-container">

            {steps.map((step, index) => {

              const stepNumber = index + 1;

              return (
                <div
                  className={`step ${
                    currentStep === stepNumber
                      ? "active"
                      : currentStep > stepNumber
                      ? "completed"
                      : ""
                  }`}
                  key={step}
                >

                  <div className="step-number">

                    {currentStep > stepNumber
                      ? "✓"
                      : stepNumber}

                  </div>

                  <span>
                    {step}
                  </span>

                </div>
              );
            })}

          </div>

          {/* ===================================== */}
          {/* APPLICATION CARD */}
          {/* ===================================== */}

          <div className="application-card">

            {/* ================================= */}
            {/* STEP 1 */}
            {/* ================================= */}

            {currentStep === 1 && (
              <section>

                <div className="form-section-header">

                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Your information has been loaded
                    from your profile.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="application-field">

                    <label>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
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

                  <div className="application-field full-width">

                    <label>
                      Residential Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </section>
            )}

            {/* ================================= */}
            {/* STEP 2 */}
            {/* ================================= */}

            {currentStep === 2 && (
              <section>

                <div className="form-section-header">

                  <h2>
                    Academic Information
                  </h2>

                  <p>
                    Provide your academic information.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="application-field full-width">

                    <label>
                      University / Institution
                    </label>

                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Programme of Study
                    </label>

                    <input
                      type="text"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Level / Year
                    </label>

                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select level
                      </option>

                      <option value="Level 100">
                        Level 100
                      </option>

                      <option value="Level 200">
                        Level 200
                      </option>

                      <option value="Level 300">
                        Level 300
                      </option>

                      <option value="Level 400">
                        Level 400
                      </option>

                      <option value="Graduate">
                        Graduate
                      </option>

                    </select>

                  </div>

                  <div className="application-field">

                    <label>
                      Student ID
                    </label>

                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      GPA / CGPA
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Expected Graduation Year
                    </label>

                    <input
                      type="number"
                      name="expected_graduation"
                      value={formData.expected_graduation}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </section>
            )}

            {/* ================================= */}
            {/* STEP 3 */}
            {/* ================================= */}

            {currentStep === 3 && (
              <section>

                <div className="form-section-header">

                  <h2>
                    Internship Preferences
                  </h2>

                  <p>
                    Tell us what type of internship
                    you're looking for.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="application-field full-width">

                    <label>
                      Preferred Department
                    </label>

                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      disabled={loadingDepartments}
                    >

                      <option value="">
                        {loadingDepartments
                          ? "Loading departments..."
                          : "Select a department"}
                      </option>

                      {departments.map(
                        (department) => (
                          <option
                            key={department.id}
                            value={department.id}
                          >
                            {department.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="application-field">

                    <label>
                      Preferred Start Date
                    </label>

                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field">

                    <label>
                      Preferred End Date
                    </label>

                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="application-field full-width">

                    <label>
                      Preferred Location
                    </label>

                    <input
                      type="text"
                      name="preferred_location"
                      value={
                        formData.preferred_location
                      }
                      onChange={handleChange}
                      placeholder="Where would you prefer to undertake your internship?"
                    />

                  </div>

                  <div className="application-field full-width">

                    <label>
                      Why are you interested in this internship?
                    </label>

                    <textarea
                      rows="6"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder="Tell us why you are interested..."
                    />

                  </div>

                </div>

              </section>
            )}

            {/* ================================= */}
            {/* STEP 4 */}
            {/* ================================= */}

            {currentStep === 4 && (
              <section>

                <div className="form-section-header">

                  <h2>
                    Required Documents
                  </h2>

                  <p>
                    Upload the documents required
                    for your application.
                  </p>

                </div>

                <div className="upload-list">

                  {/* CV */}

                  <div className="upload-box">

                    <div>

                      <h3>
                        Curriculum Vitae (CV)
                      </h3>

                      <p>
                        PDF, DOC or DOCX • Maximum 5MB
                      </p>

                      {formData.cv && (
                        <small>
                          Selected:{" "}
                          {formData.cv.name}
                        </small>
                      )}

                    </div>

                    <label className="upload-btn">

                      Choose File

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "cv"
                          )
                        }
                      />

                    </label>

                  </div>

                  {/* TRANSCRIPT */}

                  <div className="upload-box">

                    <div>

                      <h3>
                        Academic Transcript
                      </h3>

                      <p>
                        PDF, DOC or DOCX • Maximum 5MB
                      </p>

                      {formData.transcript && (
                        <small>
                          Selected:{" "}
                          {formData.transcript.name}
                        </small>
                      )}

                    </div>

                    <label className="upload-btn">

                      Choose File

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "transcript"
                          )
                        }
                      />

                    </label>

                  </div>

                  {/* COVER LETTER */}

                  <div className="upload-box">

                    <div>

                      <h3>
                        Cover Letter
                      </h3>

                      <p>
                        PDF, DOC or DOCX • Maximum 5MB
                      </p>

                      {formData.cover_letter && (
                        <small>
                          Selected:{" "}
                          {formData.cover_letter.name}
                        </small>
                      )}

                    </div>

                    <label className="upload-btn">

                      Choose File

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "cover_letter"
                          )
                        }
                      />

                    </label>

                  </div>

                </div>

              </section>
            )}

            {/* ================================= */}
            {/* STEP 5 */}
            {/* ================================= */}

            {currentStep === 5 && (
              <section>

                <div className="form-section-header">

                  <h2>
                    Review & Submit
                  </h2>

                  <p>
                    Review your information carefully
                    before submitting.
                  </p>

                </div>

                <div className="review-section">

                  {/* PERSONAL */}

                  <div className="review-group">

                    <div className="review-heading">

                      <h3>
                        Personal Information
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(1)
                        }
                      >
                        Edit
                      </button>

                    </div>

                    <div className="review-details">

                      <p>
                        <span>
                          Full Name
                        </span>

                        {formData.firstName}{" "}
                        {formData.lastName}
                      </p>

                      <p>
                        <span>
                          Email
                        </span>

                        {formData.email}
                      </p>

                      <p>
                        <span>
                          Phone
                        </span>

                        {formData.phone ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                  {/* ACADEMIC */}

                  <div className="review-group">

                    <div className="review-heading">

                      <h3>
                        Academic Information
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(2)
                        }
                      >
                        Edit
                      </button>

                    </div>

                    <div className="review-details">

                      <p>
                        <span>
                          University
                        </span>

                        {formData.university ||
                          "Not provided"}
                      </p>

                      <p>
                        <span>
                          Programme
                        </span>

                        {formData.program ||
                          "Not provided"}
                      </p>

                      <p>
                        <span>
                          Level
                        </span>

                        {formData.level ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                  {/* INTERNSHIP */}

                  <div className="review-group">

                    <div className="review-heading">

                      <h3>
                        Internship Preferences
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(3)
                        }
                      >
                        Edit
                      </button>

                    </div>

                    <div className="review-details">

                      <p>
                        <span>
                          Department
                        </span>

                        {departments.find(
                          (department) =>
                            String(
                              department.id
                            ) ===
                            String(
                              formData.department_id
                            )
                        )?.name ||
                          "Not selected"}
                      </p>

                      <p>
                        <span>
                          Start Date
                        </span>

                        {formData.start_date ||
                          "Not provided"}
                      </p>

                      <p>
                        <span>
                          End Date
                        </span>

                        {formData.end_date ||
                          "Not provided"}
                      </p>

                      <p>
                        <span>
                          Location
                        </span>

                        {formData.preferred_location ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                  {/* DOCUMENTS */}

                  <div className="review-group">

                    <div className="review-heading">

                      <h3>
                        Documents
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentStep(4)
                        }
                      >
                        Edit
                      </button>

                    </div>

                    <div className="review-details">

                      <p>
                        <span>
                          CV
                        </span>

                        {formData.cv
                          ? formData.cv.name
                          : "Not uploaded"}
                      </p>

                      <p>
                        <span>
                          Transcript
                        </span>

                        {formData.transcript
                          ? formData.transcript.name
                          : "Not uploaded"}
                      </p>

                      <p>
                        <span>
                          Cover Letter
                        </span>

                        {formData.cover_letter
                          ? formData.cover_letter.name
                          : "Not uploaded"}
                      </p>

                    </div>

                  </div>

                  <div className="submission-warning">

                    <strong>
                      Before you submit
                    </strong>

                    <p>
                      Make sure all information provided
                      is accurate. Once submitted, you
                      may not be able to edit your
                      application.
                    </p>

                  </div>

                </div>

              </section>
            )}

            {/* ================================= */}
            {/* NAVIGATION */}
            {/* ================================= */}

            <div className="application-navigation">

              {currentStep > 1 ? (

                <button
                  type="button"
                  className="previous-btn"
                  onClick={previousStep}
                >
                  ← Previous
                </button>

              ) : (

                <Link
                  to="/dashboard"
                  className="cancel-btn"
                >
                  Cancel
                </Link>

              )}

              {currentStep < 5 ? (

                <button
                  type="button"
                  className="next-btn"
                  onClick={nextStep}
                >
                  Continue →
                </button>

              ) : (

                <button
                  type="button"
                  className="submit-btn"
                  onClick={submitApplication}
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application"}
                </button>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Apply;
