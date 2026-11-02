const express = require("express");

const {
  getStaffStudents
} = require("../controllers/staffStudentController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.get("/", protectStaff, getStaffStudents);

module.exports = router;