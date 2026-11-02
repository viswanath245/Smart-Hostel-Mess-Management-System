const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Meal = require("../models/Meal");

const recordStaffAttendance = async (req, res) => {
  try {
    const { studentId, mealId, status } = req.body;

    if (!studentId || !mealId || !status) {
      return res.status(400).json({
        message: "Student ID, meal ID and status are required"
      });
    }

    if (!["Present", "Absent", "Missed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status"
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const existingAttendance = await Attendance.findOne({
      studentId,
      mealId
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already recorded for this student and meal"
      });
    }

    const attendance = await Attendance.create({
      studentId,
      mealId,
      status
    });

    const populatedAttendance = await Attendance.findById(
      attendance._id
    )
      .populate("studentId", "studentId name email")
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

const getStaffAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId", "studentId name email")
      .populate("mealId")
      .sort({ attendanceTime: -1 });

    res.json({
      message: "Attendance records retrieved successfully",
      count: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve attendance records",
      error: error.message
    });
  }
};

module.exports = {
  recordStaffAttendance,
  getStaffAttendance
};