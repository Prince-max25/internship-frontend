
const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/adminDashboardController");

const router = express.Router();


// =========================================
// ADMIN DASHBOARD
// =========================================

router.get("/stats", getDashboardStats);


module.exports = router;
