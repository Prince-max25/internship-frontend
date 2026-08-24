const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { pool } = require("../config/db");

// =========================================
// MULTER STORAGE (IN-MEMORY)
// =========================================
// Serverless environments like Vercel are read-only.
// Storing files in memory allows processing/uploading
// without throwing filesystem permissions errors.
const storage = multer.memoryStorage();

// =========================================
// FILE FILTER
// =========================================
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC and DOCX files are allowed."), false);
  }
};

// =========================================
// MULTER UPLOAD
// =========================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =========================================
// GET ALL DEPARTMENTS
// =========================================
router.get("/departments", async (req, res) => {
  try {
    const [departments] = await pool.query(
      `SELECT id, name, description FROM departments ORDER BY id ASC`
    );
    res.json(departments);
  } catch (error) {
    console.error("Departments error:", error);
    res.status(500).json({
      message: "Unable to load departments.",
      error: error.message,
    });
  }
});

// =========================================
// SUBMIT APPLICATION
// =========================================
router.post(
  "/submit",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "cover_letter", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        student_id,
        department_id,
        start_date,
        end_date,
        preferred_location,
        motivation,
      } = req.body;

      // =========================================
      // VALIDATION
      // =========================================
      if (!student_id) {
        return res.status(400).json({ message: "Student ID is required." });
      }

      if (!department_id) {
        return res.status(400).json({ message: "Please select a department." });
      }

      // =========================================
      // CHECK STUDENT
      // =========================================
      const [students] = await pool.query(
        `SELECT id, full_name, email FROM students WHERE id = ?`,
        [student_id]
      );

      if (students.length === 0) {
        return res.status(404).json({ message: "Student account not found." });
      }

      // =========================================
      // CHECK DEPARTMENT
      // =========================================
      const [departments] = await pool.query(
        `SELECT id, name FROM departments WHERE id = ?`,
        [department_id]
      );

      if (departments.length === 0) {
        return res.status(404).json({ message: "Selected department does not exist." });
      }

      // =========================================
      // CHECK EXISTING APPLICATION
      // =========================================
      const [existingApplication] = await pool.query(
        `SELECT id FROM applications WHERE student_id = ? LIMIT 1`,
        [student_id]
      );

      if (existingApplication.length > 0) {
        return res.status(409).json({ message: "You have already submitted an application." });
      }

      // =========================================
      // GET UPLOADED FILES & BUFFER HANDLERS
      // =========================================
      // Files are now available as buffers: req.files.cv[0].buffer
      // TODO: Pass file buffers to your Cloud Storage service (e.g. AWS S3, Cloudinary, Vercel Blob)
      const cvPath = req.files?.cv?.[0] ? `cloud_url_or_name_${req.files.cv[0].originalname}` : null;
      const transcriptPath = req.files?.transcript?.[0] ? `cloud_url_or_name_${req.files.transcript[0].originalname}` : null;
      const coverLetterPath = req.files?.cover_letter?.[0] ? `cloud_url_or_name_${req.files.cover_letter[0].originalname}` : null;

      // =========================================
      // INSERT APPLICATION
      // =========================================
      const [result] = await pool.query(
        `INSERT INTO applications
        (
          student_id,
          department_id,
          application_status,
          cv_path,
          transcript_path,
          cover_letter,
          start_date,
          end_date,
          preferred_location,
          motivation,
          submitted_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          student_id,
          department_id,
          "Pending",
          cvPath,
          transcriptPath,
          coverLetterPath,
          start_date || null,
          end_date || null,
          preferred_location || null,
          motivation || null,
        ]
      );

      // =========================================
      // CREATE NOTIFICATION
      // =========================================
      await pool.query(
        `INSERT INTO notifications
        (
          student_id,
          title,
          message,
          type,
          is_read,
          created_at
        )
        VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          student_id,
          "Application Submitted",
          `Your internship application has been successfully submitted for the ${departments[0].name} department and is now pending review.`,
          "application",
        ]
      );

      // =========================================
      // GET CREATED APPLICATION
      // =========================================
      const [application] = await pool.query(
        `SELECT
          a.id,
          a.student_id,
          a.department_id,
          d.name AS department_name,
          d.description AS department_description,
          a.application_status,
          a.cv_path,
          a.transcript_path,
          a.cover_letter,
          a.start_date,
          a.end_date,
          a.preferred_location,
          a.motivation,
          a.submitted_at,
          a.updated_at
         FROM applications a
         LEFT JOIN departments d ON a.department_id = d.id
         WHERE a.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        message: "Application submitted successfully.",
        application: application[0],
      });
    } catch (error) {
      console.error("Application submission error:", error);

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "One of your files is larger than 5MB." });
      }

      if (error.message && error.message.includes("Only PDF, DOC and DOCX files are allowed")) {
        return res.status(400).json({ message: "Only PDF, DOC and DOCX files are allowed." });
      }

      res.status(500).json({
        message: error.message || "Unable to submit application.",
      });
    }
  }
);

// =========================================
// GET STUDENT APPLICATION
// =========================================
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [applications] = await pool.query(
      `SELECT
        a.id,
        a.student_id,
        a.department_id,
        d.name AS department_name,
        d.description AS department_description,
        a.application_status,
        a.cv_path,
        a.transcript_path,
        a.cover_letter,
        a.start_date,
        a.end_date,
        a.preferred_location,
        a.motivation,
        a.submitted_at,
        a.updated_at
       FROM applications a
       LEFT JOIN departments d ON a.department_id = d.id
       WHERE a.student_id = ?
       LIMIT 1`,
      [studentId]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: "No application found." });
    }

    res.json({ application: applications[0] });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({
      message: "Unable to retrieve application.",
      error: error.message,
    });
  }
});

module.exports = router;