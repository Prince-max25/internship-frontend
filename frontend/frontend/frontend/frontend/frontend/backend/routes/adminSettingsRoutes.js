const express = require("express");

const {
  getAdminSettings,
  updateGeneralSettings,
  updateApplicationSettings,
  updateNotificationSettings,
  changeAdminPassword,
} = require("../controllers/adminSettingsController");

const router = express.Router();


// GET SETTINGS
router.get("/", getAdminSettings);


// GENERAL SETTINGS
router.put(
  "/general",
  updateGeneralSettings
);


// APPLICATION SETTINGS
router.put(
  "/applications",
  updateApplicationSettings
);


// NOTIFICATION SETTINGS
router.put(
  "/notifications",
  updateNotificationSettings
);


// CHANGE PASSWORD
router.put(
  "/security/password",
  changeAdminPassword
);


module.exports = router;