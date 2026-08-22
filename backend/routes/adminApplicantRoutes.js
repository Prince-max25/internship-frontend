const express = require("express");

const {
  getApplicantById,
} = require("../controllers/adminApplicantController");

const router = express.Router();

router.get("/:id", getApplicantById);

module.exports = router;