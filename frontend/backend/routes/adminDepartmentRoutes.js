const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");

// =========================================
// GET ALL DEPARTMENTS
// =========================================

router.get("/", async (req, res) => {
  try {
    const [departments] = await pool.query(`
      SELECT
        id,
        name,
        description,
        created_at
      FROM departments
      ORDER BY id ASC
    `);

    res.json(departments);

  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      message: "Unable to load departments.",
      error: error.message,
    });
  }
});


// =========================================
// CREATE DEPARTMENT
// =========================================

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required.",
      });
    }

    const [existing] = await pool.query(
      `SELECT id FROM departments WHERE name = ? LIMIT 1`,
      [name.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Department already exists.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO departments
       (name, description)
       VALUES (?, ?)`,
      [
        name.trim(),
        description?.trim() || null,
      ]
    );

    const [department] = await pool.query(
      `SELECT
        id,
        name,
        description,
        created_at
       FROM departments
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: "Department created successfully.",
      department: department[0],
    });

  } catch (error) {
    console.error("Create department error:", error);

    res.status(500).json({
      message: "Unable to create department.",
      error: error.message,
    });
  }
});


// =========================================
// UPDATE DEPARTMENT
// =========================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required.",
      });
    }

    const [result] = await pool.query(
      `UPDATE departments
       SET name = ?, description = ?
       WHERE id = ?`,
      [
        name.trim(),
        description?.trim() || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    const [department] = await pool.query(
      `SELECT
        id,
        name,
        description,
        created_at
       FROM departments
       WHERE id = ?`,
      [id]
    );

    res.json({
      message: "Department updated successfully.",
      department: department[0],
    });

  } catch (error) {
    console.error("Update department error:", error);

    res.status(500).json({
      message: "Unable to update department.",
      error: error.message,
    });
  }
});


// =========================================
// DELETE DEPARTMENT
// =========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [applications] = await pool.query(
      `SELECT id
       FROM applications
       WHERE department_id = ?
       LIMIT 1`,
      [id]
    );

    if (applications.length > 0) {
      return res.status(409).json({
        message:
          "This department cannot be deleted because it has applications assigned to it.",
      });
    }

    const [result] = await pool.query(
      `DELETE FROM departments
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.json({
      message: "Department deleted successfully.",
    });

  } catch (error) {
    console.error("Delete department error:", error);

    res.status(500).json({
      message: "Unable to delete department.",
      error: error.message,
    });
  }
});


module.exports = router;