const express = require("express");

const {
  registerStudent,
  loginStudent,
  updateStudentProfile,
} = require("../controllers/authController");

const router = express.Router();


// Register
router.post("/register", registerStudent);


// Login
router.post("/login", loginStudent);


// Update profile
router.put("/profile", updateStudentProfile);


module.exports = router;