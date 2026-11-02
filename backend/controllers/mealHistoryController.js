const MealBooking = require("../models/MealBooking");
const Attendance = require("../models/Attendance");

const getMyMealHistory = async (req, res) => {
  try {
    const bookings = await MealBooking.find({
      studentId: req.student._id
    })
      .populate("mealId")
      .sort({ bookingDate: -1 });

    const attendance = await Attendance.find({
      studentId: req.student._id
    })
      .populate("mealId")
      .sort({ attendanceTime: -1 });

    res.json({
      message: "Meal history retrieved successfully",
      totalBookings: bookings.length,
      totalAttendance: attendance.length,
      history: {
        bookings,
        attendance
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve meal history",
      error: error.message
    });
  }
};

module.exports = {
  getMyMealHistory
};