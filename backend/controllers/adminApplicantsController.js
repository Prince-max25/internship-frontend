const { pool } = require("../config/db");

// =========================================
// GET ALL APPLICANTS
// =========================================

const getApplicants = async (req, res) => {
  try {
    const [applicants] = await pool.query(`
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

        s.id,
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

    res.json({
      applicants,
    });

  } catch (error) {
    console.error("Get applicants error:", error);

    res.status(500).json({
      message: "Unable to load applicants.",
    });
  }
};


// =========================================
// GET SINGLE APPLICANT
// =========================================

const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [applicants] = await pool.query(`
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

        s.id,
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
    `, [id]);

    if (applicants.length === 0) {
      return res.status(404).json({
        message: "Applicant not found.",
      });
    }

    res.json({
      applicant: applicants[0],
    });

  } catch (error) {
    console.error("Get applicant error:", error);

    res.status(500).json({
      message: "Unable to load applicant.",
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  getApplicants,
  getApplicantById,
};