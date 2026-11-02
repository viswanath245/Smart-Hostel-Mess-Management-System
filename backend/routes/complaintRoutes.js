const express = require("express");

const {
  createComplaint,
  getMyComplaints
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);

module.exports = router;