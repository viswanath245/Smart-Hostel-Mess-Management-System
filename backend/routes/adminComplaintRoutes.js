const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getAllComplaints,
  getComplaintById,
  updateComplaint,
} = require("../controllers/adminComplaintController");

// Get all complaints
router.get("/", adminAuthMiddleware, getAllComplaints);

// Get one complaint
router.get("/:id", adminAuthMiddleware, getComplaintById);

// Update complaint
router.put("/:id", adminAuthMiddleware, updateComplaint);

module.exports = router;