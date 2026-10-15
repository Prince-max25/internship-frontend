const { pool } = require("../config/db");

// =========================================
// GET ALL APPLICANTS
// =========================================

const getApplicants = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.student_id,
        a.department_id,
        a.application_status,
        a.submitted_at,
        a.updated_at,

        s.full_name,
        s.email,
        s.university,
        s.program,

        d.name AS department_name

      FROM applications a

      INNER JOIN students s
        ON a.student_id = s.id

      LEFT JOIN departments d
        ON a.department_id = d.id

      ORDER BY a.submitted_at DESC
    `);

    res.json({
      applicants: rows,
    });

  } catch (error) {
    console.error("Get applicants error:", error);

    res.status(500).json({
      message: "Unable to load applicants.",
      error: error.message,
    });
  }
};


// =========================================
// GET APPLICANT BY ID
// =========================================

const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Application ID is required.",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        a.id AS application_id,
        a.student_id,
        a.department_id,
        a.application_status,
        a.cv_path,
        a.transcript_path,
        a.cover_letter,
        a.submitted_at,
        a.updated_at,
        a.start_date,
        a.end_date,
        a.preferred_location,
        a.motivation,

        s.full_name,
        s.email,
        s.phone,
        s.university,
        s.program,
        s.student_id AS student_number,
        s.date_of_birth,
        s.gender,
        s.address,
        s.level,
        s.gpa,
        s.expected_graduation,

        d.name AS department_name

      FROM applications a

      INNER JOIN students s
        ON a.student_id = s.id

      LEFT JOIN departments d
        ON a.department_id = d.id

      WHERE a.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Applicant not found.",
      });
    }

    res.status(200).json({
      applicant: rows[0],
    });

  } catch (error) {
    console.error("Get applicant profile error:", error);

    res.status(500).json({
      message: "Unable to load applicant profile.",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE APPLICANT STATUS
// =========================================

const updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("STATUS UPDATE:", {
      applicationId: id,
      requestedStatus: status,
    });

    // =========================================
    // VALIDATE STATUS
    // =========================================

    const allowedStatuses = [
      "Pending",
      "Under Review",
      "Accepted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Use Pending, Under Review, Accepted, or Rejected.",
      });
    }

    // =========================================
    // CHECK APPLICATION
    // =========================================

    const [applications] = await pool.query(
      `
      SELECT
        a.id,
        a.student_id,
        a.application_status,
        s.full_name

      FROM applications a

      INNER JOIN students s
        ON a.student_id = s.id

      WHERE a.id = ?
      `,
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    const application = applications[0];

    // =========================================
    // UPDATE DATABASE
    // =========================================

    const [result] = await pool.query(
      `
      UPDATE applications
      SET
        application_status = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [status, id]
    );

    console.log("DATABASE UPDATE:", {
      affectedRows: result.affectedRows,
      applicationId: id,
      status,
    });

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Application status was not updated.",
      });
    }

    // =========================================
    // CREATE NOTIFICATION
    // =========================================

    let title = null;
    let message = null;
    let type = null;

    if (status === "Accepted") {
      title = "Application Approved";

      message =
        "Congratulations! Your internship application has been approved.";

      type = "approved";
    }

    if (status === "Rejected") {
      title = "Application Rejected";

      message =
        "Your internship application was not approved at this time.";

      type = "rejected";
    }

    if (status === "Under Review") {
      title = "Application Under Review";

      message =
        "Your internship application is currently under review.";

      type = "info";
    }

    if (title) {
      await pool.query(
        `
        INSERT INTO notifications
        (
          student_id,
          title,
          message,
          type,
          is_read,
          created_at
        )

        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          FALSE,
          NOW()
        )
        `,
        [
          application.student_id,
          title,
          message,
          type,
        ]
      );
    }

    // =========================================
    // RETURN UPDATED APPLICATION
    // =========================================

    const [updatedRows] = await pool.query(
      `
      SELECT
        a.id AS application_id,
        a.application_status,
        a.updated_at

      FROM applications a

      WHERE a.id = ?
      `,
      [id]
    );

    res.status(200).json({
      message: `Application status updated to ${status}.`,
      applicant: updatedRows[0],
    });

  } catch (error) {
    console.error(
      "Update applicant status error:",
      error
    );

    res.status(500).json({
      message: "Unable to update application status.",
      error: error.message,
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  getApplicants,
  getApplicantById,
  updateApplicantStatus,
};