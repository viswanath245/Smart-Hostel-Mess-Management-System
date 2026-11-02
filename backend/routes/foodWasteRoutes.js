const express = require("express");

const {
  recordFoodWaste,
  getFoodWasteRecords
} = require("../controllers/foodWasteController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, recordFoodWaste);
router.get("/", protectStaff, getFoodWasteRecords);

module.exports = router;