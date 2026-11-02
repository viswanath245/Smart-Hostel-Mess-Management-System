const express = require("express");

const {
  recordStaffAttendance,
  getStaffAttendance
} = require("../controllers/staffAttendanceController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, recordStaffAttendance);
router.get("/", protectStaff, getStaffAttendance);

module.exports = router;