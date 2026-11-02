const express = require("express");

const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getAllStudents,
  getStudentById,
  updateStudent,
} = require("../controllers/adminStudentController");

// Get all students
router.get(
  "/",
  adminAuthMiddleware,
  getAllStudents
);

// Get one student
router.get(
  "/:id",
  adminAuthMiddleware,
  getStudentById
);

// Update student
router.put(
  "/:id",
  adminAuthMiddleware,
  updateStudent
);

module.exports = router;