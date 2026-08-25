import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminDashboard() {

  const API_URL = "https://internship-jh6u.vercel.app";

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/admin/dashboard/stats`
        );

        const data = await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load dashboard data."
          );

        }

        setDashboard(data);

      } catch (error) {

        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error.message ||
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="admin-dashboard">

        <aside className="admin-sidebar">

          <div className="admin-sidebar-logo">

            Internship<span>Portal</span>

            <small>
              ADMIN
            </small>

          </div>

        </aside>


        <main className="admin-main">

          <div
            style={{
              padding: "40px",
              fontSize: "16px",
              color: "#64748b",
            }}
          >
            Loading dashboard...
          </div>

        </main>

      </div>
    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (
      <div className="admin-dashboard">

        <aside className="admin-sidebar">

          <div className="admin-sidebar-logo">

            Internship<span>Portal</span>

            <small>
              ADMIN
            </small>

          </div>

        </aside>


        <main className="admin-main">

          <div
            style={{
              padding: "40px",
            }}
          >

            <h2>
              Dashboard Error
            </h2>

            <p>
              {error}
            </p>

          </div>

        </main>

      </div>
    );

  }


  // =========================================
  // DASHBOARD DATA
  // =========================================

  const statistics =
    dashboard?.statistics || {};

  const recentApplications =
    dashboard?.recentApplications || [];

  const departments =
    dashboard?.departmentDistribution || [];

  const monthlyApplications =
    dashboard?.monthlyApplications || [];


  const totalApplicants =
    statistics.totalApplicants || 0;

  const pendingApplications =
    statistics.pendingApplications || 0;

  const approvedApplications =
    statistics.approvedApplications || 0;

  const rejectedApplications =
    statistics.rejectedApplications || 0;

  const underReviewApplications =
    statistics.underReviewApplications || 0;


  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {

    if (!status) {
      return "pending";
    }

    const value =
      status.toLowerCase();

    if (value === "approved") {
      return "approved";
    }

    if (value === "rejected") {
      return "rejected";
    }

    if (
      value === "under review" ||
      value === "under_review"
    ) {
      return "review";
    }

    return "pending";

  };


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
  // INITIALS
  // =========================================

  const getInitials = (name) => {

    if (!name) {
      return "NA";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (word) => word[0]
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();

  };


  // =========================================
  // DEPARTMENT TOTAL
  // =========================================

  const departmentTotal =
    departments.reduce(
      (total, department) =>
        total +
        Number(
          department.application_count || 0
        ),
      0
    );


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
            className="admin-nav-link active"
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


        {/* =========================================
            HEADER
        ========================================= */}

        <header className="admin-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Here's what's happening with your
              internship portal.
            </p>

          </div>


          <div className="admin-header-right">

            <button
              type="button"
              className="admin-notification"
            >
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
            STATISTICS
        ========================================= */}

        <section className="admin-stat-grid">


          {/* TOTAL */}

          <div className="admin-stat-card">

            <div className="stat-card-top">

              <span>
                Total Applicants
              </span>

              <div className="stat-icon blue">
                ♙
              </div>

            </div>


            <strong>
              {totalApplicants}
            </strong>


            <p>
              Total applications submitted
            </p>

          </div>



          {/* PENDING */}

          <div className="admin-stat-card">

            <div className="stat-card-top">

              <span>
                Pending Applications
              </span>

              <div className="stat-icon orange">
                ◷
              </div>

            </div>


            <strong>
              {pendingApplications}
            </strong>


            <p>

              <span className="warning">
                Needs attention
              </span>

            </p>

          </div>



          {/* APPROVED */}

          <div className="admin-stat-card">

            <div className="stat-card-top">

              <span>
                Approved Applications
              </span>

              <div className="stat-icon green">
                ✓
              </div>

            </div>


            <strong>
              {approvedApplications}
            </strong>


            <p>
              Currently approved
            </p>

          </div>



          {/* REJECTED */}

          <div className="admin-stat-card">

            <div className="stat-card-top">

              <span>
                Rejected Applications
              </span>

              <div className="stat-icon red">
                ×
              </div>

            </div>


            <strong>
              {rejectedApplications}
            </strong>


            <p>
              Currently rejected
            </p>

          </div>

        </section>



        {/* =========================================
            APPLICATION OVERVIEW
        ========================================= */}

        <section className="admin-content-grid">


          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Application Overview
                </h2>

                <p>
                  Current application statistics.
                </p>

              </div>

            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "25px",
              }}
            >

              <div>

                <strong>
                  {pendingApplications}
                </strong>

                <p>
                  Pending
                </p>

              </div>


              <div>

                <strong>
                  {underReviewApplications}
                </strong>

                <p>
                  Under Review
                </p>

              </div>


              <div>

                <strong>
                  {approvedApplications}
                </strong>

                <p>
                  Approved
                </p>

              </div>

            </div>

          </div>



          {/* DEPARTMENT DISTRIBUTION */}

          <div className="admin-panel department-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Applications by Department
                </h2>

                <p>
                  Current application distribution.
                </p>

              </div>

            </div>


            <div className="department-stat">

              <div className="department-circle">

                <strong>
                  {departmentTotal}
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>


            <div className="department-legend">

              {departments.length === 0 ? (

                <p>
                  No department data available.
                </p>

              ) : (

                departments.map(
                  (department, index) => {

                    const count =
                      Number(
                        department.application_count ||
                        0
                      );

                    const percentage =
                      departmentTotal > 0
                        ? Math.round(
                            (count /
                              departmentTotal) *
                              100
                          )
                        : 0;

                    return (

                      <div
                        key={index}
                      >

                        <span
                          className="legend-dot blue-dot"
                        ></span>

                        {department.department_name ||
                          "Unknown"}

                        <strong>
                          {percentage}%
                        </strong>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </div>

        </section>



        {/* =========================================
            RECENT APPLICATIONS
        ========================================= */}

        <section className="admin-panel applications-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Latest internship applications submitted.
              </p>

            </div>


            <Link
              to="/admin/applicants"
              className="view-all"
            >
              View All →
            </Link>

          </div>


          <div className="applications-table-wrapper">

            {recentApplications.length === 0 ? (

              <div
                style={{
                  padding: "30px",
                  color: "#64748b",
                }}
              >
                No applications have been submitted yet.
              </div>

            ) : (

              <table className="applications-table">

                <thead>

                  <tr>

                    <th>
                      Applicant
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

                  {recentApplications.map(
                    (application) => (

                      <tr
                        key={application.id}
                      >

                        <td>

                          <div className="applicant-cell">

                            <div className="table-avatar">

                              {getInitials(
                                application.full_name
                              )}

                            </div>


                            <div>

                              <strong>
                                {application.full_name}
                              </strong>

                              <span>
                                {application.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          {application.program ||
                            "Not specified"}

                        </td>


                        <td>

                          {application.department_name ||
                            "Not specified"}

                        </td>


                        <td>

                          {formatDate(
                            application.submitted_at
                          )}

                        </td>


                        <td>

                          <span
                            className={`status ${getStatusClass(
                              application.application_status
                            )}`}
                          >

                            {application.application_status ||
                              "Pending"}

                          </span>

                        </td>


                        <td>

                          <Link
                            to={`/admin/applicants/${application.id}`}
                            className="view-btn"
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>



        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="quick-actions">

          <h2>
            Quick Actions
          </h2>


          <div className="quick-action-grid">


            <Link
              to="/admin/applicants"
              className="quick-action"
            >

              <div>
                ♙
              </div>

              <span>
                Manage Applicants
              </span>

              <small>
                View and manage applicants
              </small>

            </Link>


            <Link
              to="/admin/applicants"
              className="quick-action"
            >

              <div>
                ▣
              </div>

              <span>
                Review Applications
              </span>

              <small>
                Review pending applications
              </small>

            </Link>


            <Link
              to="/admin/reports"
              className="quick-action"
            >

              <div>
                ▥
              </div>

              <span>
                Generate Report
              </span>

              <small>
                View internship statistics
              </small>

            </Link>


          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;