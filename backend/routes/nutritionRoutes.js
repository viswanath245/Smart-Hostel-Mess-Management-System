const express = require("express");

const {
  getNutrition,
  getNutritionRecommendation
} = require("../controllers/nutritionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getNutrition);
router.get("/recommendation", protect, getNutritionRecommendation);

module.exports = router;