const Reward = require("../models/Reward");
const Student = require("../models/Student");

const addReward = async (req, res) => {
  try {
    const { pointsEarned, reason } = req.body;

    if (!pointsEarned || !reason) {
      return res.status(400).json({
        message: "Points earned and reason are required"
      });
    }

    if (pointsEarned < 1) {
      return res.status(400).json({
        message: "Points earned must be at least 1"
      });
    }

    const reward = await Reward.create({
      studentId: req.student._id,
      pointsEarned,
      reason
    });

    await Student.findByIdAndUpdate(
      req.student._id,
      {
        $inc: {
          rewardPoints: pointsEarned
        }
      }
    );

    const populatedReward = await Reward.findById(reward._id)
      .populate("studentId", "studentId name rewardPoints");

    res.status(201).json({
      message: "Reward added successfully",
      reward: populatedReward
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add reward",
      error: error.message
    });
  }
};

const getMyRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({
      studentId: req.student._id
    }).sort({ rewardDate: -1 });

    const student = await Student.findById(req.student._id)
      .select("rewardPoints");

    res.json({
      message: "Rewards retrieved successfully",
      totalPoints: student.rewardPoints,
      count: rewards.length,
      rewards
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve rewards",
      error: error.message
    });
  }
};

module.exports = {
  addReward,
  getMyRewards
};