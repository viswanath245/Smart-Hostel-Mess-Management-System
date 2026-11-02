const Vote = require("../models/Vote");

const createVote = async (req, res) => {
  try {
    const { foodItem } = req.body;

    if (!foodItem) {
      return res.status(400).json({
        message: "Food item is required"
      });
    }

    const existingVote = await Vote.findOne({
      studentId: req.student._id,
      foodItem: foodItem.trim()
    });

    if (existingVote) {
      return res.status(400).json({
        message: "You have already voted for this food item"
      });
    }

    const vote = await Vote.create({
      studentId: req.student._id,
      foodItem: foodItem.trim()
    });

    const populatedVote = await Vote.findById(vote._id)
      .populate("studentId", "studentId name");

    res.status(201).json({
      message: "Vote submitted successfully",
      vote: populatedVote
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit vote",
      error: error.message
    });
  }
};

const getMyVotes = async (req, res) => {
  try {
    const votes = await Vote.find({
      studentId: req.student._id
    }).sort({ voteDate: -1 });

    res.json({
      message: "Votes retrieved successfully",
      count: votes.length,
      votes
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve votes",
      error: error.message
    });
  }
};

module.exports = {
  createVote,
  getMyVotes
};