const { pool } = require("../config/db");

// =========================================
// ADMIN DASHBOARD
// =========================================

const getAdminDashboard = async (req, res) => {
  try {

    // =========================================
    // TOTAL APPLICATIONS
    // =========================================

    const [totalResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
    `);

    const totalApplicants = totalResult[0].total;


    // =========================================
    // PENDING APPLICATIONS
    // =========================================

    const [pendingResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'pending'
    `);

    const pendingApplications = pendingResult[0].total;


    // =========================================
    // APPROVED APPLICATIONS
    // =========================================

    const [approvedResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'approved'
    `);

    const approvedApplications = approvedResult[0].total;


    // =========================================
    // REJECTED APPLICATIONS
    // =========================================

    const [rejectedResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'rejected'
    `);

    const rejectedApplications = rejectedResult[0].total;


    // =========================================
    // UNDER REVIEW
    // =========================================

    const [reviewResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'under review'
    `);

    const underReviewApplications = reviewResult[0].total;


    // =========================================
    // RECENT APPLICATIONS
    // =========================================

    const [recentApplications] = await pool.query(`
      SELECT
        applications.id,
        applications.application_status,
        applications.submitted_at,
        students.full_name,
        students.email,
        students.program,
        departments.name AS department_name
      FROM applications

      INNER JOIN students
        ON applications.student_id = students.id

      LEFT JOIN departments
        ON applications.department_id = departments.id

      ORDER BY applications.submitted_at DESC

      LIMIT 10
    `);


    // =========================================
    // APPLICATIONS BY DEPARTMENT
    // =========================================

    const [departmentResults] = await pool.query(`
      SELECT
        departments.name AS department_name,
        COUNT(applications.id) AS application_count

      FROM applications

      LEFT JOIN departments
        ON applications.department_id = departments.id

      GROUP BY
        departments.id,
        departments.name

      ORDER BY application_count DESC
    `);


    // =========================================
    // MONTHLY APPLICATIONS
    // =========================================

    const [monthlyResults] = await pool.query(`
      SELECT
        MONTH(submitted_at) AS month_number,
        DATE_FORMAT(submitted_at, '%b') AS month,
        COUNT(*) AS application_count

      FROM applications

      WHERE submitted_at IS NOT NULL
        AND YEAR(submitted_at) = YEAR(CURDATE())

      GROUP BY
        MONTH(submitted_at),
        DATE_FORMAT(submitted_at, '%b')

      ORDER BY month_number
    `);


    // =========================================
    // RESPONSE
    // =========================================

    res.json({

      statistics: {
        totalApplicants,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        underReviewApplications,
      },

      recentApplications,

      departmentDistribution:
        departmentResults,

      monthlyApplications:
        monthlyResults,

    });

  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load admin dashboard.",
    });

  }
};


module.exports = {
  getAdminDashboard,
};