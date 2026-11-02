const Reward = require("../models/Reward");

// GET all rewards
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .populate("studentId", "studentId name email")
      .sort({ rewardDate: -1 });

    res.status(200).json(rewards);
  } catch (error) {
    console.error("Get all rewards error:", error);
    res.status(500).json({
      message: "Failed to fetch rewards",
      error: error.message
    });
  }
};

// GET single reward
const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id.trim())
      .populate("studentId", "studentId name email");

    if (!reward) {
      return res.status(404).json({
        message: "Reward not found"
      });
    }

    res.status(200).json(reward);
  } catch (error) {
    console.error("Get reward error:", error);
    res.status(500).json({
      message: "Failed to fetch reward",
      error: error.message
    });
  }
};

// CREATE reward
const createReward = async (req, res) => {
  try {
    const {
      studentId,
      pointsEarned,
      reason,
      rewardDate
    } = req.body;

    if (!studentId || pointsEarned === undefined || !reason) {
      return res.status(400).json({
        message: "Student ID, points earned and reason are required"
      });
    }

    if (Number(pointsEarned) < 1) {
      return res.status(400).json({
        message: "Points earned must be at least 1"
      });
    }

    const reward = await Reward.create({
      studentId,
      pointsEarned: Number(pointsEarned),
      reason,
      ...(rewardDate ? { rewardDate } : {})
    });

    const populatedReward = await Reward.findById(reward._id)
      .populate("studentId", "studentId name email");

    res.status(201).json(populatedReward);
  } catch (error) {
    console.error("Create reward error:", error);
    res.status(500).json({
      message: "Failed to create reward",
      error: error.message
    });
  }
};

// UPDATE reward
const updateReward = async (req, res) => {
  try {
    const { pointsEarned, reason, rewardDate } = req.body;

    const reward = await Reward.findById(req.params.id.trim());

    if (!reward) {
      return res.status(404).json({
        message: "Reward not found"
      });
    }

    if (pointsEarned !== undefined) {
      if (Number(pointsEarned) < 1) {
        return res.status(400).json({
          message: "Points earned must be at least 1"
        });
      }

      reward.pointsEarned = Number(pointsEarned);
    }

    if (reason !== undefined) {
      reward.reason = reason;
    }

    if (rewardDate !== undefined) {
      reward.rewardDate = rewardDate;
    }

    await reward.save();

    const updatedReward = await Reward.findById(reward._id)
      .populate("studentId", "studentId name email");

    res.status(200).json(updatedReward);
  } catch (error) {
    console.error("Update reward error:", error);
    res.status(500).json({
      message: "Failed to update reward",
      error: error.message
    });
  }
};

// DELETE reward
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id.trim());

    if (!reward) {
      return res.status(404).json({
        message: "Reward not found"
      });
    }

    res.status(200).json({
      message: "Reward deleted successfully"
    });
  } catch (error) {
    console.error("Delete reward error:", error);
    res.status(500).json({
      message: "Failed to delete reward",
      error: error.message
    });
  }
};

module.exports = {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward
};