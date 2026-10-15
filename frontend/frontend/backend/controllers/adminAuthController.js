const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// =========================================
// ADMIN LOGIN
// =========================================

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username/email and password are required.",
      });
    }

    // Find admin by username OR email
    const [admins] = await pool.query(
      `SELECT *
       FROM admins
       WHERE username = ? OR email = ?`,
      [username, username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        message: "Invalid username/email or password.",
      });
    }

    const admin = admins[0];

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username/email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Admin login successful.",

      token,

      admin: {
        id: admin.id,
        full_name: admin.full_name,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
};


// =========================================
// GET ADMIN SETTINGS
// =========================================

const getAdminSettings = async (req, res) => {
  try {
    const adminId = req.params.id;

    if (!adminId) {
      return res.status(400).json({
        message: "Admin ID is required.",
      });
    }

    const [admins] = await pool.query(
      `SELECT
        id,
        full_name,
        username,
        email
       FROM admins
       WHERE id = ?`,
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        message: "Administrator not found.",
      });
    }

    res.json({
      admin: admins[0],
    });

  } catch (error) {
    console.error("Get admin settings error:", error);

    res.status(500).json({
      message: "Unable to retrieve administrator settings.",
    });
  }
};


// =========================================
// UPDATE ADMIN PROFILE
// =========================================

const updateAdminSettings = async (req, res) => {
  try {
    const adminId = req.params.id;

    const {
      full_name,
      email,
    } = req.body;

    if (!adminId) {
      return res.status(400).json({
        message: "Admin ID is required.",
      });
    }

    if (!full_name || !email) {
      return res.status(400).json({
        message: "Full name and email are required.",
      });
    }

    // Check if admin exists
    const [existing] = await pool.query(
      `SELECT id
       FROM admins
       WHERE id = ?`,
      [adminId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Administrator not found.",
      });
    }

    // Check if email belongs to another admin
    const [emailExists] = await pool.query(
      `SELECT id
       FROM admins
       WHERE email = ?
       AND id != ?`,
      [email, adminId]
    );

    if (emailExists.length > 0) {
      return res.status(409).json({
        message: "This email is already being used by another administrator.",
      });
    }

    // Update profile
    await pool.query(
      `UPDATE admins
       SET full_name = ?,
           email = ?
       WHERE id = ?`,
      [
        full_name,
        email,
        adminId,
      ]
    );

    res.json({
      message: "Administrator settings updated successfully.",
    });

  } catch (error) {
    console.error("Update admin settings error:", error);

    res.status(500).json({
      message: "Unable to update administrator settings.",
    });
  }
};


// =========================================
// CHANGE ADMIN PASSWORD
// =========================================

const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.params.id;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;


    // =========================================
    // VALIDATION
    // =========================================

    if (!adminId) {
      return res.status(400).json({
        message: "Admin ID is required.",
      });
    }

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }


    // =========================================
    // CHECK PASSWORD LENGTH
    // =========================================

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters.",
      });
    }


    // =========================================
    // CHECK PASSWORD MATCH
    // =========================================

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message:
          "New passwords do not match.",
      });
    }


    // =========================================
    // GET ADMIN PASSWORD
    // =========================================

    const [admins] = await pool.query(
      `SELECT
        id,
        password
       FROM admins
       WHERE id = ?`,
      [adminId]
    );


    if (admins.length === 0) {
      return res.status(404).json({
        message:
          "Administrator not found.",
      });
    }

    const admin = admins[0];


    // =========================================
    // VERIFY CURRENT PASSWORD
    // =========================================

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );


    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Current password is incorrect.",
      });
    }


    // =========================================
    // PREVENT SAME PASSWORD
    // =========================================

    const samePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );


    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from your current password.",
      });
    }


    // =========================================
    // HASH NEW PASSWORD
    // =========================================

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );


    // =========================================
    // UPDATE PASSWORD
    // =========================================

    await pool.query(
      `UPDATE admins
       SET password = ?
       WHERE id = ?`,
      [
        hashedPassword,
        adminId,
      ]
    );


    // =========================================
    // SUCCESS
    // =========================================

    res.json({
      message:
        "Password changed successfully.",
    });

  } catch (error) {
    console.error(
      "Change admin password error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to change password.",
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  loginAdmin,
  getAdminSettings,
  updateAdminSettings,
  changeAdminPassword,
};