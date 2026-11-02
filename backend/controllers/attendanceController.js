const Attendance = require("../models/Attendance");
const Meal = require("../models/Meal");

const recordAttendance = async (req, res) => {
  try {
    const { mealId, status } = req.body;

    if (!mealId || !status) {
      return res.status(400).json({
        message: "Meal ID and attendance status are required"
      });
    }

    if (!["Present", "Absent", "Missed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const existingAttendance = await Attendance.findOne({
      studentId: req.student._id,
      mealId
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already recorded for this meal"
      });
    }

    const attendance = await Attendance.create({
      studentId: req.student._id,
      mealId,
      status
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("studentId", "studentId name")
      .populate("mealId");

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance: populatedAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record attendance",
      error: error.message
    });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentId: req.student._id
    })
      .populate("mealId")
      .sort({ attendanceTime: -1 });

    res.json({
      message: "Attendance retrieved successfully",
      count: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve attendance",
      error: error.message
    });
  }
};

module.exports = {
  recordAttendance,
  getMyAttendance
};