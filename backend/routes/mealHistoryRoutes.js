const express = require("express");

const {
  getMyMealHistory
} = require("../controllers/mealHistoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyMealHistory);

module.exports = router;