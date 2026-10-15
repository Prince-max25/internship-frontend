
const { pool } = require("../config/db");

// =========================================
// GET ALL DEPARTMENTS
// =========================================

const getDepartments = async (req, res) => {
  try {
    const [departments] = await pool.query(`
      SELECT
        d.id,
        d.name,
        d.description,
        d.created_at,
        COUNT(a.id) AS applicants
      FROM departments d
      LEFT JOIN applications a
        ON a.department_id = d.id
      GROUP BY
        d.id,
        d.name,
        d.description,
        d.created_at
      ORDER BY d.id ASC
    `);

    const formattedDepartments = departments.map((department) => ({
      id: department.id,
      name: department.name,
      description: department.description || "",
      applicants: Number(department.applicants) || 0,
      status: "Active",
      created_at: department.created_at,
    }));

    res.json({
      departments: formattedDepartments,
    });

  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      message: "Unable to load departments.",
      error: error.message,
    });
  }
};


// =========================================
// CREATE DEPARTMENT
// =========================================

const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required.",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM departments WHERE name = ?",
      [name.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Department already exists.",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO departments
      (name, description)
      VALUES (?, ?)
      `,
      [
        name.trim(),
        description || null,
      ]
    );

    res.status(201).json({
      message: "Department created successfully.",
      department: {
        id: result.insertId,
        name: name.trim(),
        description: description || "",
        applicants: 0,
        status: "Active",
      },
    });

  } catch (error) {
    console.error("Create department error:", error);

    res.status(500).json({
      message: "Unable to create department.",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE DEPARTMENT
// =========================================

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Department name is required.",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE departments
      SET
        name = ?,
        description = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        description || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.json({
      message: "Department updated successfully.",
    });

  } catch (error) {
    console.error("Update department error:", error);

    res.status(500).json({
      message: "Unable to update department.",
      error: error.message,
    });
  }
};


// =========================================
// DELETE DEPARTMENT
// =========================================

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM departments WHERE id = ?",
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
};


module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
