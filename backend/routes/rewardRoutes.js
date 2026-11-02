const express = require("express");

const {
  addReward,
  getMyRewards
} = require("../controllers/rewardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addReward);
router.get("/my", protect, getMyRewards);

module.exports = router;