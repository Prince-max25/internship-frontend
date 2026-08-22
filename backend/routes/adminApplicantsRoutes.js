const express = require("express");

const {
  getApplicants,
  getApplicantById,
} = require("../controllers/adminApplicantsController");

const router = express.Router();


// =========================================
// GET ALL APPLICANTS
// =========================================

router.get("/", getApplicants);


// =========================================
// GET ONE APPLICANT
// =========================================

router.get("/:id", getApplicantById);


module.exports = router;