const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// =========================================
// REGISTER STUDENT
// =========================================

const registerStudent = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      university,
      program,
      student_id,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required.",
      });
    }

    const [existingStudent] = await pool.query(
      "SELECT id FROM students WHERE email = ?",
      [email]
    );

    if (existingStudent.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO students
      (full_name, email, password, phone, university, program, student_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        hashedPassword,
        phone || null,
        university || null,
        program || null,
        student_id || null,
      ]
    );

    res.status(201).json({
      message: "Account created successfully.",
      student: {
        id: result.insertId,
        full_name,
        email,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
};


// =========================================
// LOGIN STUDENT
// =========================================

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const [students] = await pool.query(
      `SELECT *
       FROM students
       WHERE email = ?`,
      [email]
    );

    if (students.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const student = students[0];

    const passwordMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful.",

      token,

      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        phone: student.phone,
        university: student.university,
        program: student.program,
        student_id: student.student_id,
        date_of_birth: student.date_of_birth,
        gender: student.gender,
        address: student.address,
        level: student.level,
        gpa: student.gpa,
        expected_graduation: student.expected_graduation,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
};


// =========================================
// UPDATE STUDENT PROFILE
// =========================================

const updateStudentProfile = async (req, res) => {
  try {

    const {
      id,
      full_name,
      phone,
      university,
      program,
      student_id,
      date_of_birth,
      gender,
      address,
      level,
      gpa,
      expected_graduation,
    } = req.body;


    // Check student ID
    if (!id) {
      return res.status(400).json({
        message: "Student ID is required.",
      });
    }


    // Update student
    const [result] = await pool.query(
      `UPDATE students
       SET
         full_name = ?,
         phone = ?,
         university = ?,
         program = ?,
         student_id = ?,
         date_of_birth = ?,
         gender = ?,
         address = ?,
         level = ?,
         gpa = ?,
         expected_graduation = ?
       WHERE id = ?`,
      [
        full_name || null,
        phone || null,
        university || null,
        program || null,
        student_id || null,
        date_of_birth || null,
        gender || null,
        address || null,
        level || null,
        gpa || null,
        expected_graduation || null,
        id,
      ]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }


    // Get updated student
    const [students] = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        phone,
        university,
        program,
        student_id,
        date_of_birth,
        gender,
        address,
        level,
        gpa,
        expected_graduation
       FROM students
       WHERE id = ?`,
      [id]
    );


    res.json({
      message: "Profile updated successfully.",
      student: students[0],
    });


  } catch (error) {

    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Unable to update profile.",
    });

  }
};


// =========================================
// EXPORT CONTROLLERS
// =========================================

module.exports = {
  registerStudent,
  loginStudent,
  updateStudentProfile,
};