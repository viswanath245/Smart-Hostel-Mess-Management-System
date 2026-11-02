const express = require("express");

const {
  createStaffMeal,
  getStaffMeals,
  updateStaffMeal,
  deleteStaffMeal
} = require("../controllers/staffMealController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, createStaffMeal);
router.get("/", protectStaff, getStaffMeals);
router.put("/:id", protectStaff, updateStaffMeal);
router.delete("/:id", protectStaff, deleteStaffMeal);

module.exports = router;