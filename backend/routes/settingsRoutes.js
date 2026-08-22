const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");

// =========================================
// GET STUDENT SETTINGS
// =========================================

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required.",
      });
    }

    const [students] = await pool.query(
      "SELECT id FROM students WHERE id = ?",
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const [settings] = await pool.query(
      `SELECT
        id,
        student_id,
        email_notifications,
        application_updates,
        deadline_reminders,
        profile_visibility,
        dark_mode,
        created_at,
        updated_at
       FROM settings
       WHERE student_id = ?`,
      [studentId]
    );

    // =========================================
    // CREATE DEFAULT SETTINGS IF NONE EXIST
    // =========================================

    if (settings.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO settings
        (
          student_id,
          email_notifications,
          application_updates,
          deadline_reminders,
          profile_visibility,
          dark_mode
        )
        VALUES (?, TRUE, TRUE, TRUE, TRUE, FALSE)`,
        [studentId]
      );

      const [newSettings] = await pool.query(
        `SELECT
          id,
          student_id,
          email_notifications,
          application_updates,
          deadline_reminders,
          profile_visibility,
          dark_mode,
          created_at,
          updated_at
         FROM settings
         WHERE id = ?`,
        [result.insertId]
      );

      return res.json({
        settings: newSettings[0],
      });
    }

    res.json({
      settings: settings[0],
    });
  } catch (error) {
    console.error("Get student settings error:", error);

    res.status(500).json({
      message: "Unable to retrieve student settings.",
      error: error.message,
    });
  }
});


// =========================================
// UPDATE STUDENT SETTINGS
// =========================================

router.put("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const {
      email_notifications,
      application_updates,
      deadline_reminders,
      profile_visibility,
      dark_mode,
    } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required.",
      });
    }

    // =========================================
    // CHECK STUDENT
    // =========================================

    const [students] = await pool.query(
      "SELECT id FROM students WHERE id = ?",
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    // =========================================
    // CHECK EXISTING SETTINGS
    // =========================================

    const [existingSettings] = await pool.query(
      "SELECT id FROM settings WHERE student_id = ?",
      [studentId]
    );

    // =========================================
    // CREATE SETTINGS IF THEY DON'T EXIST
    // =========================================

    if (existingSettings.length === 0) {
      await pool.query(
        `INSERT INTO settings
        (
          student_id,
          email_notifications,
          application_updates,
          deadline_reminders,
          profile_visibility,
          dark_mode
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          email_notifications ?? true,
          application_updates ?? true,
          deadline_reminders ?? true,
          profile_visibility ?? true,
          dark_mode ?? false,
        ]
      );
    } else {
      // =========================================
      // UPDATE SETTINGS
      // =========================================

      await pool.query(
        `UPDATE settings
         SET
           email_notifications = ?,
           application_updates = ?,
           deadline_reminders = ?,
           profile_visibility = ?,
           dark_mode = ?,
           updated_at = CURRENT_TIMESTAMP
         WHERE student_id = ?`,
        [
          email_notifications ?? true,
          application_updates ?? true,
          deadline_reminders ?? true,
          profile_visibility ?? true,
          dark_mode ?? false,
          studentId,
        ]
      );
    }

    // =========================================
    // GET UPDATED SETTINGS
    // =========================================

    const [updatedSettings] = await pool.query(
      `SELECT
        id,
        student_id,
        email_notifications,
        application_updates,
        deadline_reminders,
        profile_visibility,
        dark_mode,
        created_at,
        updated_at
       FROM settings
       WHERE student_id = ?`,
      [studentId]
    );

    res.json({
      message: "Settings updated successfully.",
      settings: updatedSettings[0],
    });
  } catch (error) {
    console.error("Update student settings error:", error);

    res.status(500).json({
      message: "Unable to update student settings.",
      error: error.message,
    });
  }
});


// =========================================
// RESET SETTINGS TO DEFAULT
// =========================================

router.put("/student/:studentId/reset", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required.",
      });
    }

    const [result] = await pool.query(
      `UPDATE settings
       SET
         email_notifications = TRUE,
         application_updates = TRUE,
         deadline_reminders = TRUE,
         profile_visibility = TRUE,
         dark_mode = FALSE,
         updated_at = CURRENT_TIMESTAMP
       WHERE student_id = ?`,
      [studentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student settings not found.",
      });
    }

    const [settings] = await pool.query(
      `SELECT
        id,
        student_id,
        email_notifications,
        application_updates,
        deadline_reminders,
        profile_visibility,
        dark_mode,
        created_at,
        updated_at
       FROM settings
       WHERE student_id = ?`,
      [studentId]
    );

    res.json({
      message: "Settings reset successfully.",
      settings: settings[0],
    });
  } catch (error) {
    console.error("Reset settings error:", error);

    res.status(500).json({
      message: "Unable to reset settings.",
      error: error.message,
    });
  }
});

module.exports = router;