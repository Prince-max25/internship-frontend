import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminApplicants.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminApplicants() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://internship-jh6u.vercel.app";

  // =========================================
  // GET APPLICANTS
  // =========================================

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/applicants`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load applicants."
          );
        }

        setApplicants(data.applicants || []);

      } catch (error) {
        console.error("Applicants error:", error);

        setError(
          error.message || "Unable to load applicants."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // STATUS
  // =========================================

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return status
      .toLowerCase()
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // =========================================
  // INITIALS
  // =========================================

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

  // =========================================
  // FILTER
  // =========================================

  const filteredApplicants = applicants.filter(
    (applicant) => {
      const applicantName =
        applicant.full_name || "";

      const applicantEmail =
        applicant.email || "";

      const applicantProgramme =
        applicant.program || "";

      const applicantDepartment =
        applicant.department_name || "";

      const applicantStatus =
        formatStatus(
          applicant.application_status
        );

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        applicantName
          .toLowerCase()
          .includes(searchValue) ||
        applicantEmail
          .toLowerCase()
          .includes(searchValue) ||
        applicantProgramme
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        department === "All Departments" ||
        applicantDepartment === department;

      const matchesStatus =
        status === "All Status" ||
        applicantStatus === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    }
  );

  // =========================================
  // SUMMARY
  // =========================================

  const totalApplicants = applicants.length;

  const activeApplications =
    applicants.filter(
      (applicant) =>
        applicant.application_status &&
        applicant.application_status
          .toLowerCase() !== "rejected"
    ).length;

  const pendingApplications =
    applicants.filter(
      (applicant) =>
        !applicant.application_status ||
        applicant.application_status
          .toLowerCase() === "pending"
    ).length;

  const withoutApplication = 0;

  // =========================================
  // LOADING
  // =========================================

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

          <div
            style={{
              padding: "40px",
              fontSize: "17px",
              color: "#64748b",
            }}
          >
            Loading applicants...
          </div>

        </main>

      </div>
    );
  }

  // =========================================
  // MAIN
  // =========================================

  return (
    <div className="admin-dashboard">

      {/* =========================================
          SIDEBAR
      ========================================= */}

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


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <h1>
              Applicants
            </h1>

            <p>
              View and manage internship applicants.
            </p>

          </div>


          <div className="admin-header-right">

            <button className="admin-notification">
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


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (

          <div
            style={{
              marginBottom: "25px",
              padding: "15px 20px",
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "10px",
            }}
          >
            {error}
          </div>

        )}


        {/* =========================================
            SUMMARY
        ========================================= */}

        <section className="applicant-summary">

          <div>
            <span>
              Total Applicants
            </span>

            <strong>
              {totalApplicants}
            </strong>
          </div>


          <div>
            <span>
              Pending Applications
            </span>

            <strong>
              {pendingApplications}
            </strong>
          </div>


          <div>
            <span>
              Active Applications
            </span>

            <strong>
              {activeApplications}
            </strong>
          </div>


          <div>
            <span>
              Without Application
            </span>

            <strong>
              {withoutApplication}
            </strong>
          </div>

        </section>


        {/* =========================================
            APPLICANTS PANEL
        ========================================= */}

        <section className="applicants-panel">

          <div className="applicants-panel-header">

            <div>

              <h2>
                All Applicants
              </h2>

              <p>
                Search and filter registered applicants.
              </p>

            </div>

          </div>


          {/* =========================================
              FILTERS
          ========================================= */}

          <div className="applicant-filters">

            <div className="applicant-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search by name, email or programme..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >

              <option>
                All Departments
              </option>

              <option>
                Information Technology
              </option>

              <option>
                Engineering
              </option>

              <option>
                Finance
              </option>

              <option>
                Human Resources
              </option>

              <option>
                Operations
              </option>

              <option>
                Administration
              </option>

            </select>


            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option>
                All Status
              </option>

              <option>
                Pending
              </option>

              <option>
                Under Review
              </option>

              <option>
                Approved
              </option>

              <option>
                Rejected
              </option>

            </select>

          </div>


          {/* =========================================
              TABLE
          ========================================= */}

          <div className="applicants-table-wrapper">

            <table className="applicants-table">

              <thead>

                <tr>

                  <th>
                    Applicant
                  </th>

                  <th>
                    University
                  </th>

                  <th>
                    Programme
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Date Applied
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredApplicants.map(
                  (applicant) => {

                    const applicantStatus =
                      formatStatus(
                        applicant.application_status
                      );

                    return (

                      <tr
                        key={
                          applicant.application_id
                        }
                      >

                        {/* APPLICANT */}

                        <td>

                          <div className="applicant-person">

                            <div className="applicant-avatar">

                              {getInitials(
                                applicant.full_name
                              )}

                            </div>

                            <div>

                              <strong>
                                {applicant.full_name}
                              </strong>

                              <span>
                                {applicant.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* UNIVERSITY */}

                        <td>
                          {applicant.university ||
                            "Not specified"}
                        </td>


                        {/* PROGRAMME */}

                        <td>
                          {applicant.program ||
                            "Not specified"}
                        </td>


                        {/* DEPARTMENT */}

                        <td>
                          {applicant.department_name ||
                            "Not specified"}
                        </td>


                        {/* DATE */}

                        <td>
                          {formatDate(
                            applicant.submitted_at
                          )}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`applicant-status ${applicantStatus
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >

                            {applicantStatus}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <Link
                            to={`/admin/applicants/${applicant.application_id}`}
                            className="applicant-view-btn"
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>


            {/* EMPTY */}

            {filteredApplicants.length === 0 && (

              <div className="no-applicants">

                <div>
                  ⌕
                </div>

                <h3>
                  No applicants found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

              </div>

            )}

          </div>


          {/* =========================================
              PAGINATION INFO
          ========================================= */}

          <div className="applicant-pagination">

            <span>

              Showing{" "}

              <strong>
                {filteredApplicants.length}
              </strong>{" "}

              of{" "}

              <strong>
                {applicants.length}
              </strong>{" "}

              applicants

            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminApplicants;