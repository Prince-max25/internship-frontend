const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

// =========================================
// GET ADMIN SETTINGS
// =========================================

const getAdminSettings = async (req, res) => {
  try {
    const [settings] = await pool.query(
      `SELECT *
       FROM portal_settings
       ORDER BY id ASC
       LIMIT 1`
    );

    if (settings.length === 0) {
      return res.status(404).json({
        message: "Portal settings not found.",
      });
    }

    res.json({
      settings: settings[0],
    });

  } catch (error) {
    console.error("Get admin settings error:", error);

    res.status(500).json({
      message: "Unable to load admin settings.",
    });
  }
};


// =========================================
// UPDATE GENERAL SETTINGS
// =========================================

const updateGeneralSettings = async (req, res) => {
  try {
    const {
      portal_name,
      admin_email,
      phone,
      description,
    } = req.body;

    if (!portal_name || !admin_email) {
      return res.status(400).json({
        message: "Portal name and administrator email are required.",
      });
    }

    await pool.query(
      `UPDATE portal_settings
       SET
         portal_name = ?,
         admin_email = ?,
         phone = ?,
         description = ?
       WHERE id = 1`,
      [
        portal_name,
        admin_email,
        phone || "",
        description || "",
      ]
    );

    res.json({
      message: "General settings updated successfully.",
    });

  } catch (error) {
    console.error("Update general settings error:", error);

    res.status(500).json({
      message: "Unable to update general settings.",
    });
  }
};


// =========================================
// UPDATE APPLICATION SETTINGS
// =========================================

const updateApplicationSettings = async (req, res) => {
  try {
    const {
      accepting_applications,
      require_documents,
      allow_multiple_applications,
      auto_notification,
    } = req.body;

    await pool.query(
      `UPDATE portal_settings
       SET
         accepting_applications = ?,
         require_documents = ?,
         allow_multiple_applications = ?,
         auto_notification = ?
       WHERE id = 1`,
      [
        accepting_applications ? 1 : 0,
        require_documents ? 1 : 0,
        allow_multiple_applications ? 1 : 0,
        auto_notification ? 1 : 0,
      ]
    );

    res.json({
      message: "Application settings updated successfully.",
    });

  } catch (error) {
    console.error("Update application settings error:", error);

    res.status(500).json({
      message: "Unable to update application settings.",
    });
  }
};


// =========================================
// UPDATE NOTIFICATION SETTINGS
// =========================================

const updateNotificationSettings = async (req, res) => {
  try {
    const {
      new_application_notifications,
      application_update_notifications,
      system_update_notifications,
      email_notifications,
    } = req.body;

    await pool.query(
      `UPDATE portal_settings
       SET
         new_application_notifications = ?,
         application_update_notifications = ?,
         system_update_notifications = ?,
         email_notifications = ?
       WHERE id = 1`,
      [
        new_application_notifications ? 1 : 0,
        application_update_notifications ? 1 : 0,
        system_update_notifications ? 1 : 0,
        email_notifications ? 1 : 0,
      ]
    );

    res.json({
      message: "Notification settings updated successfully.",
    });

  } catch (error) {
    console.error("Update notification settings error:", error);

    res.status(500).json({
      message: "Unable to update notification settings.",
    });
  }
};


// =========================================
// CHANGE ADMIN PASSWORD
// =========================================

const changeAdminPassword = async (req, res) => {
  try {
    const {
      adminId,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !adminId ||
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const [admins] = await pool.query(
      `SELECT id, password
       FROM admins
       WHERE id = ?`,
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        message: "Administrator not found.",
      });
    }

    const admin = admins[0];

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await pool.query(
      `UPDATE admins
       SET password = ?
       WHERE id = ?`,
      [
        hashedPassword,
        adminId,
      ]
    );

    res.json({
      message: "Administrator password changed successfully.",
    });

  } catch (error) {
    console.error("Change admin password error:", error);

    res.status(500).json({
      message: "Unable to change administrator password.",
    });
  }
};


module.exports = {
  getAdminSettings,
  updateGeneralSettings,
  updateApplicationSettings,
  updateNotificationSettings,
  changeAdminPassword,
};