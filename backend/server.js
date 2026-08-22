const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testDatabaseConnection } = require("./config/db");

// =========================================
// ROUTES
// =========================================
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const adminDepartmentRoutes = require("./routes/adminDepartmentRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminApplicantsRoutes = require("./routes/adminApplicantsRoutes");
const adminReportsRoutes = require("./routes/adminReportsRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const adminApplicantRoutes = require("./routes/adminApplicantRoutes");
const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// =========================================
// STUDENT ROUTES
// =========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);


// =========================================
// ADMIN ROUTES
// =========================================

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

app.use(
  "/api/admin/applicants",
  adminApplicantsRoutes
);

app.use(
  "/api/admin/applicant",
  adminApplicantRoutes
);

app.use(
  "/api/admin/departments",
  adminDepartmentRoutes
);

app.use(
  "/api/admin/reports",
  adminReportsRoutes
);

app.use(
  "/api/admin/notifications",
  adminNotificationRoutes
);

app.use(
  "/api/admin/settings",
  adminSettingsRoutes
);

// =========================================
// TEST ROUTE
// =========================================

app.get("/", (req, res) => {

  res.json({
    message: "Internship Portal API is running 🚀",
  });

});


// =========================================
// START SERVER
// =========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

  await testDatabaseConnection();

});