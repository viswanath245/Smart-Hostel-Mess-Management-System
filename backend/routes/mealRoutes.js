const express = require("express");

const {
  getMeals,
  getMealById,
  createMeal
} = require("../controllers/mealController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMeals);
router.get("/:id", protect, getMealById);
router.post("/", protect, createMeal);

module.exports = router;