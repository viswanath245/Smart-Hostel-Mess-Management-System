const CrowdMonitoring = require("../models/CrowdMonitoring");
const Meal = require("../models/Meal");

const determineCrowdLevel = (studentCount) => {
  if (studentCount < 30) {
    return "Low";
  }

  if (studentCount <= 80) {
    return "Normal";
  }

  return "High";
};

const recordCrowd = async (req, res) => {
  try {
    const { mealId, date, studentCount } = req.body;

    if (
      !mealId ||
      !date ||
      studentCount === undefined
    ) {
      return res.status(400).json({
        message:
          "Meal ID, date and student count are required"
      });
    }

    if (studentCount < 0) {
      return res.status(400).json({
        message:
          "Student count cannot be negative"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const crowdLevel =
      determineCrowdLevel(studentCount);

    const crowd = await CrowdMonitoring.create({
      mealId,
      date,
      studentCount,
      crowdLevel
    });

    const populatedCrowd =
      await CrowdMonitoring.findById(crowd._id)
        .populate("mealId");

    res.status(201).json({
      message: "Crowd data recorded successfully",
      crowd: populatedCrowd
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record crowd data",
      error: error.message
    });
  }
};

const getCrowdRecords = async (req, res) => {
  try {
    const crowdRecords =
      await CrowdMonitoring.find()
        .populate("mealId")
        .sort({ date: -1 });

    res.json({
      message:
        "Crowd records retrieved successfully",
      count: crowdRecords.length,
      crowdRecords
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to retrieve crowd records",
      error: error.message
    });
  }
};

module.exports = {
  recordCrowd,
  getCrowdRecords
};