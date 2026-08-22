const { pool } = require("../config/db");

// =========================================
// ADMIN DASHBOARD STATS
// =========================================

const getDashboardStats = async (req, res) => {
  try {

    // Total applicants
    const [totalResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
    `);

    // Pending
    const [pendingResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'pending'
    `);

    // Approved
    const [approvedResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'approved'
    `);

    // Rejected
    const [rejectedResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'rejected'
    `);

    // Under review
    const [reviewResult] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM applications
      WHERE LOWER(application_status) = 'under review'
    `);

    // Applications by department
    const [departmentResult] = await pool.query(`
      SELECT
        d.name AS department,
        COUNT(a.id) AS total
      FROM applications a
      LEFT JOIN departments d
        ON a.department_id = d.id
      GROUP BY d.id, d.name
      ORDER BY total DESC
    `);

    // Recent applications
    const [recentResult] = await pool.query(`
      SELECT
        a.id AS application_id,
        a.application_status,
        a.submitted_at,

        s.full_name,
        s.email,
        s.program,

        d.name AS department

      FROM applications a

      INNER JOIN students s
        ON a.student_id = s.id

      LEFT JOIN departments d
        ON a.department_id = d.id

      ORDER BY a.submitted_at DESC
      LIMIT 5
    `);

    res.json({
      stats: {
        totalApplicants: totalResult[0].total,
        pendingApplications: pendingResult[0].total,
        approvedApplications: approvedResult[0].total,
        rejectedApplications: rejectedResult[0].total,
        underReviewApplications: reviewResult[0].total,
      },

      departments: departmentResult,

      recentApplications: recentResult,
    });

  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );

    res.status(500).json({
      message: "Unable to load dashboard data.",
      error: error.message,
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  getDashboardStats,
};