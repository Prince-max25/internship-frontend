
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminReports.css";
import AdminLogoutButton from "../components/AdminLogoutButton";

function AdminReports() {

  // =========================================
  // STATE
  // =========================================

  const [dateRange, setDateRange] =
    useState("All Time");

  const [department, setDepartment] =
    useState("All Departments");

  const [status, setStatus] =
    useState("All Status");

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================
  // LOAD REPORTS
  // =========================================

  const loadReports = async () => {

    try {

      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append(
        "dateRange",
        dateRange
      );

      params.append(
        "department",
        department
      );

      params.append(
        "status",
        status
      );


      const response = await fetch(
        `http://localhost:5000/api/admin/reports?${params.toString()}`
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load reports."
        );

      }


      setReport(data);

    } catch (error) {

      console.error(
        "Reports loading error:",
        error
      );

      setError(
        error.message ||
        "Unable to load reports."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // LOAD WHEN FILTER CHANGES
  // =========================================

  useEffect(() => {

    loadReports();

  }, [
    dateRange,
    department,
    status,
  ]);


  // =========================================
  // LOADING
  // =========================================

  if (loading && !report) {

    return (
      <div className="admin-dashboard">

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
              className="admin-nav-link active"
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

        <main className="admin-main">

          <div className="reports-loading">
            Loading reports...
          </div>

        </main>

      </div>
    );

  }


  // =========================================
  // FALLBACK
  // =========================================

  if (!report) {
    return null;
  }


  // =========================================
  // DATA
  // =========================================

  const statistics =
    report.statistics || {};

  const reportData =
    report.departments || [];

  const universities =
    report.universities || [];

  const chartData =
    report.chart || [];

  const departmentOptions =
    report.departmentOptions || [];


  // =========================================
  // CHART MAX
  // =========================================

  const maxChartValue =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) =>
              Number(item.value) || 0
          )
        )
      : 0;


  // =========================================
  // GENERATE REPORT
  // =========================================

  const generateReport = () => {

    alert(
      `Report generated for ${dateRange}, ${department}, ${status}.`
    );

  };


  // =========================================
  // RETURN
  // =========================================

  return (

    <div className="admin-dashboard">

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

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
            className="admin-nav-link active"
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


      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <main className="admin-main">


        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <header className="admin-header">

          <div>

            <h1>
              Reports
            </h1>

            <p>
              Analyze internship applications and
              applicant statistics.
            </p>

          </div>


          <div className="admin-header-right">

            <button
              className="admin-notification"
              type="button"
            >
              ♢
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


        {/* ===================================== */}
        {/* ERROR */}
        {/* ===================================== */}

        {error && (

          <div className="profile-error">

            {error}

          </div>

        )}


        {/* ===================================== */}
        {/* FILTERS */}
        {/* ===================================== */}

        <section className="reports-filter-card">


          <div className="report-filter">

            <label>
              Date Range
            </label>


            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(
                  e.target.value
                )
              }
            >

              <option>
                This Month
              </option>

              <option>
                Last Month
              </option>

              <option>
                Last 3 Months
              </option>

              <option>
                Last 6 Months
              </option>

              <option>
                This Year
              </option>

              <option>
                All Time
              </option>

            </select>

          </div>


          <div className="report-filter">

            <label>
              Department
            </label>


            <select
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >

              <option>
                All Departments
              </option>


              {departmentOptions.map(
                (item) => (

                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="report-filter">

            <label>
              Status
            </label>


            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
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


          <button
            className="generate-report-btn"
            onClick={generateReport}
          >
            Generate Report
          </button>

        </section>


        {/* ===================================== */}
        {/* STATISTICS */}
        {/* ===================================== */}

        <section className="report-statistics">


          <div className="report-stat-card">

            <span>
              Total Applicants
            </span>

            <strong>
              {Number(
                statistics.totalApplicants || 0
              ).toLocaleString()}
            </strong>

            <small>
              Registered students
            </small>

          </div>


          <div className="report-stat-card">

            <span>
              Total Applications
            </span>

            <strong>
              {Number(
                statistics.totalApplications || 0
              ).toLocaleString()}
            </strong>

            <small>
              Submitted applications
            </small>

          </div>


          <div className="report-stat-card">

            <span>
              Approved
            </span>

            <strong>
              {Number(
                statistics.approved || 0
              ).toLocaleString()}
            </strong>

            <small>
              {statistics.approvalRate || 0}% approval rate
            </small>

          </div>


          <div className="report-stat-card">

            <span>
              Rejected
            </span>

            <strong>
              {Number(
                statistics.rejected || 0
              ).toLocaleString()}
            </strong>

            <small>
              {statistics.rejectionRate || 0}% rejection rate
            </small>

          </div>

        </section>


        {/* ===================================== */}
        {/* CHARTS */}
        {/* ===================================== */}

        <section className="report-chart-grid">


          {/* APPLICATIONS CHART */}

          <div className="report-card application-chart">

            <div className="report-card-header">

              <div>

                <h2>
                  Applications Overview
                </h2>

                <p>
                  Applications submitted over time.
                </p>

              </div>


              <span className="chart-period">
                2026
              </span>

            </div>


            {chartData.length === 0 ? (

              <div className="empty-report">

                No application data available yet.

              </div>

            ) : (

              <div className="chart-area">


                <div className="chart-y-axis">

                  <span>
                    {maxChartValue}
                  </span>

                  <span>
                    {Math.round(
                      maxChartValue * 0.75
                    )}
                  </span>

                  <span>
                    {Math.round(
                      maxChartValue * 0.5
                    )}
                  </span>

                  <span>
                    {Math.round(
                      maxChartValue * 0.25
                    )}
                  </span>

                  <span>
                    0
                  </span>

                </div>


                <div className="chart">

                  <div className="chart-grid-lines">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                  </div>


                  <div className="chart-bars">

                    {chartData.map(
                      (item) => {

                        const value =
                          Number(
                            item.value
                          ) || 0;


                        const height =
                          maxChartValue > 0
                            ? (
                                value /
                                maxChartValue
                              ) * 100
                            : 0;


                        return (

                          <div
                            className="chart-column"
                            key={`${item.month}-${value}`}
                          >

                            <div className="bar-wrapper">

                              <span className="bar-value">
                                {value}
                              </span>


                              <div
                                className="chart-bar"
                                style={{
                                  height:
                                    `${height}%`,
                                }}
                              />

                            </div>


                            <span className="bar-label">
                              {item.month}
                            </span>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* STATUS */}

          <div className="report-cardstatus-card">

            <div className="report-card-header">

              <div>

                <h2>
                  Application Status
                </h2>

                <p>
                  Current application distribution.
                </p>

              </div>

            </div>


            <div className="status-chart">

              <div className="status-donut">

                <div>

                  <strong>
                    {Number(
                      statistics.totalApplications || 0
                    )}
                  </strong>

                  <span>
                    Applications
                  </span>

                </div>

              </div>

            </div>


            <div className="status-legend">


              <div>

                <span className="legend-dot pending"></span>

                Pending

                <strong>
                  {Number(
                    statistics.pending || 0
                  )}
                </strong>

              </div>


              <div>

                <span className="legend-dot review"></span>

                Under Review

                <strong>
                  {Number(
                    statistics.underReview || 0
                  )}
                </strong>

              </div>


              <div>

                <span className="legend-dot approved"></span>

                Approved

                <strong>
                  {Number(
                    statistics.approved || 0
                  )}
                </strong>

              </div>


              <div>

                <span className="legend-dot rejected"></span>

                Rejected

                <strong>
                  {Number(
                    statistics.rejected || 0
                  )}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================== */}
        {/* DEPARTMENT REPORT */}
        {/* ===================================== */}

        <section className="report-card department-report">


          <div className="report-card-header">

            <div>

              <h2>
                Applications by Department
              </h2>

              <p>
                Breakdown of internship applications
                by department.
              </p>

            </div>

          </div>


          <div className="department-report-table-wrapper">

            <table className="department-report-table">

              <thead>

                <tr>

                  <th>
                    Department
                  </th>

                  <th>
                    Applications
                  </th>

                  <th>
                    Approved
                  </th>

                  <th>
                    Pending
                  </th>

                  <th>
                    Rejected
                  </th>

                  <th>
                    Approval Rate
                  </th>

                </tr>

              </thead>


              <tbody>

                {reportData.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="empty-table"
                    >
                      No department data available.
                    </td>

                  </tr>

                ) : (

                  reportData.map(
                    (item) => {

                      const applications =
                        Number(
                          item.applications
                        ) || 0;

                      const approved =
                        Number(
                          item.approved
                        ) || 0;

                      const pending =
                        Number(
                          item.pending
                        ) || 0;

                      const rejected =
                        Number(
                          item.rejected
                        ) || 0;


                      const approvalRate =
                        applications > 0
                          ? Math.round(
                              (
                                approved /
                                applications
                              ) * 100
                            )
                          : 0;


                      return (

                        <tr
                          key={item.id}
                        >

                          <td>

                            <strong>
                              {item.department}
                            </strong>

                          </td>


                          <td>
                            {applications}
                          </td>


                          <td>

                            <span className="approved-number">
                              {approved}
                            </span>

                          </td>


                          <td>

                            <span className="pending-number">
                              {pending}
                            </span>

                          </td>


                          <td>

                            <span className="rejected-number">
                              {rejected}
                            </span>

                          </td>


                          <td>

                            <div className="rate-wrapper">

                              <div className="rate-bar">

                                <span
                                  style={{
                                    width:
                                      `${approvalRate}%`,
                                  }}
                                />

                              </div>


                              <strong>
                                {approvalRate}%
                              </strong>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ===================================== */}
        {/* UNIVERSITY REPORT */}
        {/* ===================================== */}

        <section className="report-card university-report">


          <div className="report-card-header">

            <div>

              <h2>
                Applicants by University
              </h2>

              <p>
                Where registered applicants are coming from.
              </p>

            </div>

          </div>


          <div className="university-list">

            {universities.length === 0 ? (

              <div className="empty-report">

                No university data available yet.

              </div>

            ) : (

              universities.map(
                (university) => {

                  const applicants =
                    Number(
                      university.applicants
                    ) || 0;


                  const totalApplicants =
                    Number(
                      statistics.totalApplicants
                    ) || 0;


                  const percentage =
                    totalApplicants > 0
                      ? Math.round(
                          (
                            applicants /
                            totalApplicants
                          ) * 100
                        )
                      : 0;


                  return (

                    <div
                      className="university-item"
                      key={university.name}
                    >

                      <div className="university-info">

                        <span>
                          {university.name}
                        </span>

                        <strong>
                          {applicants}
                        </strong>

                      </div>


                      <div className="university-bar">

                        <span
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>

        </section>


        {/* ===================================== */}
        {/* EXPORT */}
        {/* ===================================== */}

        <section className="export-reports">

          <div>

            <h2>
              Export Reports
            </h2>

            <p>
              Download detailed reports for record keeping
              and analysis.
            </p>

          </div>


          <div className="export-report-buttons">

            <button type="button">
              ↓ Applicants Report
            </button>

            <button type="button">
              ↓ Applications Report
            </button>

            <button type="button">
              ↓ Department Report
            </button>

            <button type="button">
              ↓ Approved Applicants
            </button>

          </div>

        </section>

      </main>

    </div>

  );

}

export default AdminReports;
