const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");


// =========================================
// GET STUDENT NOTIFICATIONS
// =========================================

router.get(
  "/student/:studentId",
  async (req, res) => {

    try {

      const { studentId } = req.params;


      // =========================================
      // VALIDATE STUDENT ID
      // =========================================

      if (!studentId) {

        return res.status(400).json({
          message: "Student ID is required.",
        });

      }


      // =========================================
      // GET NOTIFICATIONS
      // =========================================

      const [notifications] =
        await pool.query(

          `SELECT
            id,
            student_id,
            title,
            message,
            type,
            is_read,
            created_at

           FROM notifications

           WHERE student_id = ?

           ORDER BY created_at DESC`,

          [studentId]

        );


      // =========================================
      // SUCCESS
      // =========================================

      res.json({

        notifications,

        unreadCount:
          notifications.filter(
            (notification) =>
              !notification.is_read
          ).length,

      });


    } catch (error) {

      console.error(
        "Get notifications error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to retrieve notifications.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// GET UNREAD NOTIFICATION COUNT
// =========================================

router.get(
  "/student/:studentId/unread-count",
  async (req, res) => {

    try {

      const { studentId } = req.params;


      // =========================================
      // GET COUNT
      // =========================================

      const [result] =
        await pool.query(

          `SELECT COUNT(*) AS unreadCount

           FROM notifications

           WHERE student_id = ?

           AND is_read = FALSE`,

          [studentId]

        );


      res.json({

        unreadCount:
          result[0].unreadCount,

      });


    } catch (error) {

      console.error(
        "Unread notification count error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to retrieve unread notification count.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// MARK ONE NOTIFICATION AS READ
// =========================================

router.put(
  "/:id/read",
  async (req, res) => {

    try {

      const { id } = req.params;


      // =========================================
      // UPDATE NOTIFICATION
      // =========================================

      const [result] =
        await pool.query(

          `UPDATE notifications

           SET is_read = TRUE

           WHERE id = ?`,

          [id]

        );


      // =========================================
      // CHECK IF NOTIFICATION EXISTS
      // =========================================

      if (result.affectedRows === 0) {

        return res.status(404).json({

          message:
            "Notification not found.",

        });

      }


      res.json({

        message:
          "Notification marked as read.",

      });


    } catch (error) {

      console.error(
        "Mark notification as read error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to update notification.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// MARK ALL STUDENT NOTIFICATIONS AS READ
// =========================================

router.put(
  "/student/:studentId/read-all",
  async (req, res) => {

    try {

      const { studentId } = req.params;


      // =========================================
      // UPDATE ALL NOTIFICATIONS
      // =========================================

      await pool.query(

        `UPDATE notifications

         SET is_read = TRUE

         WHERE student_id = ?

         AND is_read = FALSE`,

        [studentId]

      );


      res.json({

        message:
          "All notifications marked as read.",

      });


    } catch (error) {

      console.error(
        "Mark all notifications as read error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to update notifications.",

        error:
          error.message,

      });

    }

  }
);


// =========================================
// CREATE NOTIFICATION
// =========================================
// This can be used by other backend routes
// when something happens to a student's
// application.
// =========================================

router.post(
  "/create",
  async (req, res) => {

    try {

      const {
        student_id,
        title,
        message,
        type,
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


      if (!title) {

        return res.status(400).json({

          message:
            "Notification title is required.",

        });

      }


      if (!message) {

        return res.status(400).json({

          message:
            "Notification message is required.",

        });

      }


      // =========================================
      // CHECK STUDENT
      // =========================================

      const [students] =
        await pool.query(

          `SELECT id

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
      // CREATE NOTIFICATION
      // =========================================

      const [result] =
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
            title,
            message,
            type || "info",
          ]

        );


      // =========================================
      // GET CREATED NOTIFICATION
      // =========================================

      const [notification] =
        await pool.query(

          `SELECT
            id,
            student_id,
            title,
            message,
            type,
            is_read,
            created_at

           FROM notifications

           WHERE id = ?`,

          [result.insertId]

        );


      // =========================================
      // SUCCESS
      // =========================================

      res.status(201).json({

        message:
          "Notification created successfully.",

        notification:
          notification[0],

      });


    } catch (error) {

      console.error(
        "Create notification error:"
      );

      console.error(error);


      res.status(500).json({

        message:
          "Unable to create notification.",

        error:
          error.message,

      });

    }

  }
);


module.exports = router;