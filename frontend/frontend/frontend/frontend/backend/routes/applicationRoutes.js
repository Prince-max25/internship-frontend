const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

const { pool } = require("../config/db");


// =========================================
// UPLOAD DIRECTORY
// =========================================
// On Vercel, the deployed code directory (/var/task/...)
// is READ-ONLY. Only os.tmpdir() (mapped to /tmp) is
// writable, and even that is wiped between invocations,
// so uploaded files won't persist reliably there either.
//
// This keeps local dev working exactly as before, while
// preventing the whole app from crashing on Vercel. Real
// file persistence in production still needs a proper fix
// (e.g. uploading to Cloudinary / Supabase Storage / S3
// instead of local disk) — this is a stopgap, not that fix.

const uploadDirectory = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads", "applications")
  : path.join(__dirname, "..", "uploads", "applications");

try {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
      recursive: true,
    });
  }
} catch (error) {
  console.error(
    "Could not create upload directory. File uploads will fail until this is resolved:",
    error.message
  );
  // Deliberately not re-throwing: letting this fail silently
  // at startup means the rest of the API (auth, dashboard,
  // profile, etc.) keeps working even though uploads won't.
}


// =========================================
// MULTER STORAGE
// =========================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;

    cb(null, uniqueName);
  },

});


// =========================================
// FILE FILTER
// =========================================

const fileFilter = (req, file, cb) => {

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension =
    path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed."
      ),
      false
    );

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

router.get(
  "/departments",
  async (req, res) => {

    try {

      const [departments] =
        await pool.query(

          `SELECT
            id,
            name,
            description

           FROM departments

           ORDER BY id ASC`

        );

      res.json(departments);

    } catch (error) {

      console.error(
        "Departments error:"
      );

      console.error(error);

      res.status(500).json({

        message:
          "Unable to load departments.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// SUBMIT APPLICATION
// =========================================

router.post(
  "/submit",

  upload.fields([

    {
      name: "cv",
      maxCount: 1,
    },

    {
      name: "transcript",
      maxCount: 1,
    },

    {
      name: "cover_letter",
      maxCount: 1,
    },

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

        return res.status(400).json({

          message:
            "Student ID is required.",

        });

      }


      if (!department_id) {

        return res.status(400).json({

          message:
            "Please select a department.",

        });

      }


      // =========================================
      // CHECK STUDENT
      // =========================================

      const [students] =
        await pool.query(

          `SELECT
            id,
            full_name,
            email

           FROM students

           WHERE id = ?`,

          [student_id]

        );


      if (students.length === 0) {

        return res.status(404).json({

          message:
            "Student account not found.",

        });

      }


      // =========================================
      // CHECK DEPARTMENT
      // =========================================

      const [departments] =
        await pool.query(

          `SELECT
            id,
            name

           FROM departments

           WHERE id = ?`,

          [department_id]

        );


      if (departments.length === 0) {

        return res.status(404).json({

          message:
            "Selected department does not exist.",

        });

      }


      // =========================================
      // CHECK EXISTING APPLICATION
      // =========================================

      const [existingApplication] =
        await pool.query(

          `SELECT
            id

           FROM applications

           WHERE student_id = ?

           LIMIT 1`,

          [student_id]

        );


      if (existingApplication.length > 0) {

        return res.status(409).json({

          message:
            "You have already submitted an application.",

        });

      }


      // =========================================
      // GET UPLOADED FILES
      // =========================================

      const cvFile =
        req.files?.cv?.[0] || null;

      const transcriptFile =
        req.files?.transcript?.[0] || null;

      const coverLetterFile =
        req.files?.cover_letter?.[0] || null;


      // =========================================
      // FILE PATHS
      // =========================================

      const cvPath = cvFile
        ? `/uploads/applications/${cvFile.filename}`
        : null;

      const transcriptPath = transcriptFile
        ? `/uploads/applications/${transcriptFile.filename}`
        : null;

      const coverLetterPath = coverLetterFile
        ? `/uploads/applications/${coverLetterFile.filename}`
        : null;


      // =========================================
      // INSERT APPLICATION
      // =========================================

      const [result] =
        await pool.query(

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

          VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,

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

        VALUES
        (?, ?, ?, ?, FALSE, NOW())`,

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

      const [application] =
        await pool.query(

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

           LEFT JOIN departments d
             ON a.department_id = d.id

           WHERE a.id = ?`,

          [result.insertId]

        );


      // =========================================
      // SUCCESS
      // =========================================

      res.status(201).json({

        message:
          "Application submitted successfully.",

        application:
          application[0],

      });


    } catch (error) {

      console.error(
        "Application submission error:"
      );

      console.error(error);


      // =========================================
      // MULTER FILE SIZE ERROR
      // =========================================

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res.status(400).json({

          message:
            "One of your files is larger than 5MB.",

        });

      }


      // =========================================
      // MULTER FILE TYPE ERROR
      // =========================================

      if (
        error.message &&
        error.message.includes(
          "Only PDF, DOC and DOCX files are allowed"
        )
      ) {

        return res.status(400).json({

          message:
            "Only PDF, DOC and DOCX files are allowed.",

        });

      }


      // =========================================
      // GENERAL ERROR
      // =========================================

      res.status(500).json({

        message:
          error.message ||
          "Unable to submit application.",

      });

    }

  }
);


// =========================================
// GET STUDENT APPLICATION
// =========================================

router.get(
  "/student/:studentId",

  async (req, res) => {

    try {

      const {
        studentId,
      } = req.params;


      // =========================================
      // GET APPLICATION
      // =========================================

      const [applications] =
        await pool.query(

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

           LEFT JOIN departments d
             ON a.department_id = d.id

           WHERE a.student_id = ?

           LIMIT 1`,

          [studentId]

        );


      // =========================================
      // NO APPLICATION
      // =========================================

      if (
        applications.length === 0
      ) {

        return res.status(404).json({

          message:
            "No application found.",

        });

      }


      // =========================================
      // SUCCESS
      // =========================================

      res.json({

        application:
          applications[0],

      });


    } catch (error) {

      console.error(
        "Get application error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to retrieve application.",

        error:
          error.message,

      });

    }

  }
);


module.exports = router;