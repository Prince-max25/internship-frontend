const { pool } = require("../config/db");

// =========================================
// GET ALL APPLICANTS
// =========================================

const getApplicants = async (req, res) => {
  try {
    const [rows] = await pool.query(`
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

        s.id AS student_database_id,
        s.full_name,
        s.email,
        s.phone,
        s.university,
        s.program,
        s.student_id AS student_number,
        s.level,
        s.gpa,

        d.name AS department_name

      FROM applications a

      INNER JOIN students s
        ON a.student_id = s.id

      LEFT JOIN departments d
        ON a.department_id = d.id

      ORDER BY a.submitted_at DESC
    `);

    return res.status(200).json({
      applicants: rows,
    });

  } catch (error) {
    console.error("Get applicants error:", error);

    return res.status(500).json({
      message: "Unable to load applicants.",
      error: error.message,
    });
  }
};


// =========================================
// GET ONE APPLICANT
// =========================================

const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Applicant ID is required.",
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

        s.id AS student_database_id,
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

    return res.status(200).json({
      applicant: rows[0],
    });

  } catch (error) {
    console.error("Get applicant profile error:", error);

    return res.status(500).json({
      message: "Unable to load applicant profile.",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE APPLICANT STATUS
// APPROVE / REJECT
// =========================================

const updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    console.log("Updating application:", id);
    console.log("New status:", status);

    // =========================================
    // VALIDATE ID
    // =========================================

    if (!id) {
      return res.status(400).json({
        message: "Application ID is required.",
      });
    }

    // =========================================
    // VALIDATE STATUS
    // =========================================

    const allowedStatuses = [
  "pending",
  "under review",
  "approved",
  "rejected",
];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected.",
      });
    }

    // =========================================
    // FIND APPLICATION
    // =========================================

    const [applications] = await pool.query(
      `
      SELECT
        a.id,
        a.student_id,
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
        message: "Applicant not found.",
      });
    }

    const application = applications[0];

    // =========================================
    // UPDATE STATUS
    // =========================================

    const [updateResult] = await pool.query(
      `
      UPDATE applications

      SET
        application_status = ?,
        updated_at = NOW()

      WHERE id = ?
      `,
      [
        status,
        id,
      ]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        message: "Application status was not updated.",
      });
    }

    // =========================================
    // CREATE NOTIFICATION
    // =========================================

    let title;
    let message;
    let type;

    if (status === "approved") {
      title = "Application Approved";

      message =
        "Congratulations! Your internship application has been approved.";

      type = "approved";
    }

    if (status === "rejected") {
      title = "Application Update";

      message =
        "Your internship application was not approved at this time.";

      type = "rejected";
    }

    // =========================================
    // INSERT STUDENT NOTIFICATION
    // =========================================

    try {
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

    } catch (notificationError) {
      console.error(
        "Notification creation error:",
        notificationError
      );

      // Don't fail the approval/rejection
      // just because notification creation failed.
    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({
      message: `Application ${status} successfully.`,
      status,
      applicationId: id,
    });

  } catch (error) {
    console.error(
      "Update applicant status error:",
      error
    );

    return res.status(500).json({
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