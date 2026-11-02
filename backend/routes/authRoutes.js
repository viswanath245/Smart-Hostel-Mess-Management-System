
const express = require("express");

const {
  registerStudent,
  loginStudent
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Authenticated student retrieved successfully",
    student: req.student
  });
});

module.exports = router;
