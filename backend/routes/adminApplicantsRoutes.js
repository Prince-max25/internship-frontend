const express = require("express");

const {
  getApplicants,
  getApplicantById,
  updateApplicantStatus,
} = require("../controllers/adminApplicantsController");

const router = express.Router();


// =========================================
// GET ALL APPLICANTS
// GET /api/admin/applicants
// =========================================

router.get(
  "/",
  getApplicants
);


// =========================================
// GET ONE APPLICANT
// GET /api/admin/applicants/:id
// =========================================

router.get(
  "/:id",
  getApplicantById
);


// =========================================
// APPROVE / REJECT APPLICANT
// PUT /api/admin/applicants/:id/status
// =========================================

router.put(
  "/:id/status",
  updateApplicantStatus
);


module.exports = router;