const express = require("express");

const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getAllStaff,
  getStaffById,
  updateStaff,
} = require("../controllers/adminStaffController");

// Get all staff
router.get(
  "/",
  adminAuthMiddleware,
  getAllStaff
);

// Get one staff member
router.get(
  "/:id",
  adminAuthMiddleware,
  getStaffById
);

// Update staff
router.put(
  "/:id",
  adminAuthMiddleware,
  updateStaff
);

module.exports = router;