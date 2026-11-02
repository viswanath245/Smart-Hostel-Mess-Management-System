const express = require("express");

const {
  createMenuItem,
  getMenu,
  getMenuByMeal
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMenu);
router.get("/meal/:mealId", protect, getMenuByMeal);
router.post("/", protect, createMenuItem);

module.exports = router;