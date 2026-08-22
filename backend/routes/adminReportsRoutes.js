
const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");


// =========================================
// GET REPORT DATA
// =========================================

router.get("/", async (req, res) => {
  try {
    const {
      dateRange = "All Time",
      department = "All Departments",
      status = "All Status",
    } = req.query;


    // =========================================
    // DATE FILTER
    // =========================================

    let dateCondition = "";
    let dateParams = [];

    const today = new Date();

    if (dateRange === "This Month") {
      dateCondition = `
        AND a.submitted_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      `;
    }

    else if (dateRange === "Last Month") {
      dateCondition = `
        AND a.submitted_at >= DATE_FORMAT(
          DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
          '%Y-%m-01'
        )
        AND a.submitted_at < DATE_FORMAT(
          CURDATE(),
          '%Y-%m-01'
        )
      `;
    }

    else if (dateRange === "Last 3 Months") {
      dateCondition = `
        AND a.submitted_at >= DATE_SUB(
          CURDATE(),
          INTERVAL 3 MONTH
        )
      `;
    }

    else if (dateRange === "Last 6 Months") {
      dateCondition = `
        AND a.submitted_at >= DATE_SUB(
          CURDATE(),
          INTERVAL 6 MONTH
        )
      `;
    }

    else if (dateRange === "This Year") {
      dateCondition = `
        AND a.submitted_at >= DATE_FORMAT(
          CURDATE(),
          '%Y-01-01'
        )
      `;
    }


    // =========================================
    // DEPARTMENT FILTER
    // =========================================

    let departmentCondition = "";

    if (
      department &&
      department !== "All Departments"
    ) {
      departmentCondition = `
        AND d.name = ?
      `;

      dateParams.push(department);
    }


    // =========================================
    // STATUS FILTER
    // =========================================

    let statusCondition = "";

    if (
      status &&
      status !== "All Status"
    ) {
      statusCondition = `
        AND a.application_status = ?
      `;

      dateParams.push(status);
    }


    // =========================================
    // TOTAL APPLICANTS
    // =========================================

    const [applicantResult] =
      await pool.query(`
        SELECT COUNT(*) AS total
        FROM students
      `);

    const totalApplicants =
      Number(
        applicantResult[0]?.total || 0
      );


    // =========================================
    // APPLICATION STATISTICS
    // =========================================

    const [statistics] =
      await pool.query(
        `
        SELECT

          COUNT(*) AS totalApplications,

          SUM(
            CASE
              WHEN a.application_status = 'Pending'
              THEN 1
              ELSE 0
            END
          ) AS pending,

          SUM(
            CASE
              WHEN a.application_status = 'Under Review'
              THEN 1
              ELSE 0
            END
          ) AS underReview,

          SUM(
            CASE
              WHEN a.application_status = 'Approved'
              THEN 1
              ELSE 0
            END
          ) AS approved,

          SUM(
            CASE
              WHEN a.application_status = 'Rejected'
              THEN 1
              ELSE 0
            END
          ) AS rejected

        FROM applications a

        LEFT JOIN departments d
          ON a.department_id = d.id

        WHERE 1 = 1

        ${dateCondition}

        ${departmentCondition}

        ${statusCondition}
        `,
        dateParams
      );


    const stats = statistics[0] || {};

    const totalApplications =
      Number(
        stats.totalApplications || 0
      );

    const pending =
      Number(stats.pending || 0);

    const underReview =
      Number(stats.underReview || 0);

    const approved =
      Number(stats.approved || 0);

    const rejected =
      Number(stats.rejected || 0);


    // =========================================
    // APPLICATIONS BY DEPARTMENT
    // =========================================

    const [departmentReport] =
      await pool.query(
        `
        SELECT

          d.id,
          d.name AS department,

          COUNT(a.id) AS applications,

          SUM(
            CASE
              WHEN a.application_status = 'Approved'
              THEN 1
              ELSE 0
            END
          ) AS approved,

          SUM(
            CASE
              WHEN a.application_status = 'Pending'
              THEN 1
              ELSE 0
            END
          ) AS pending,

          SUM(
            CASE
              WHEN a.application_status = 'Under Review'
              THEN 1
              ELSE 0
            END
          ) AS underReview,

          SUM(
            CASE
              WHEN a.application_status = 'Rejected'
              THEN 1
              ELSE 0
            END
          ) AS rejected

        FROM departments d

        LEFT JOIN applications a
          ON a.department_id = d.id

        GROUP BY
          d.id,
          d.name

        ORDER BY
          applications DESC
        `
      );


    // =========================================
    // APPLICANTS BY UNIVERSITY
    // =========================================

    const [universityReport] =
      await pool.query(`
        SELECT

          university AS name,

          COUNT(*) AS applicants

        FROM students

        WHERE university IS NOT NULL
        AND university != ''

        GROUP BY university

        ORDER BY applicants DESC

        LIMIT 10
      `);


    // =========================================
    // APPLICATIONS OVER TIME
    // =========================================

    const [monthlyReport] =
      await pool.query(`
        SELECT

          DATE_FORMAT(
            submitted_at,
            '%b'
          ) AS month,

          COUNT(*) AS value

        FROM applications

        WHERE submitted_at IS NOT NULL

        GROUP BY
          YEAR(submitted_at),
          MONTH(submitted_at)

        ORDER BY
          YEAR(submitted_at),
          MONTH(submitted_at)

        LIMIT 12
      `);


    // =========================================
    // GET DEPARTMENTS
    // =========================================

    const [departments] =
      await pool.query(`
        SELECT
          id,
          name,
          description
        FROM departments
        ORDER BY name ASC
      `);


    // =========================================
    // RESPONSE
    // =========================================

    res.json({

      statistics: {
        totalApplicants,
        totalApplications,
        pending,
        underReview,
        approved,
        rejected,

        approvalRate:
          totalApplications > 0
            ? Math.round(
                (approved /
                  totalApplications) *
                  100
              )
            : 0,

        rejectionRate:
          totalApplications > 0
            ? Math.round(
                (rejected /
                  totalApplications) *
                  100
              )
            : 0,
      },

      departments:
        departmentReport,

      universities:
        universityReport,

      chart:
        monthlyReport,

      departmentOptions:
        departments,

      filters: {
        dateRange,
        department,
        status,
      },

    });

  } catch (error) {

    console.error(
      "Reports error:"
    );

    console.error(error);

    res.status(500).json({

      message:
        "Unable to load reports.",

      error:
        error.message,

    });

  }
});


module.exports = router;
