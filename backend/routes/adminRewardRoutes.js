const express = require("express");

const {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward
} = require("../controllers/adminRewardController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAllRewards);

router.get("/:id", adminAuthMiddleware, getRewardById);

router.post("/", adminAuthMiddleware, createReward);

router.put("/:id", adminAuthMiddleware, updateReward);

router.delete("/:id", adminAuthMiddleware, deleteReward);

module.exports = router;