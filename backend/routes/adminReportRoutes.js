const express = require("express");

const {
  getAdminReports
} = require("../controllers/adminReportController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get(
  "/",
  adminAuthMiddleware,
  getAdminReports
);

module.exports = router;