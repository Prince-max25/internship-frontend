const express = require("express");

const {
  loginAdmin,
  getAdminSettings,
  updateAdminSettings,
  changeAdminPassword,
} = require("../controllers/adminAuthController");

const router = express.Router();


// =========================================
// ADMIN LOGIN
// =========================================

router.post(
  "/login",
  loginAdmin
);


// =========================================
// GET ADMIN SETTINGS
// =========================================

router.get(
  "/settings/:id",
  getAdminSettings
);


// =========================================
// UPDATE ADMIN SETTINGS
// =========================================

router.put(
  "/settings/:id",
  updateAdminSettings
);


// =========================================
// CHANGE ADMIN PASSWORD
// =========================================

router.put(
  "/change-password/:id",
  changeAdminPassword
);


module.exports = router;