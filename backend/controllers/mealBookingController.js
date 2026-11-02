const MealBooking = require("../models/MealBooking");
const Meal = require("../models/Meal");

const createBooking = async (req, res) => {
  try {
    const { mealId, additionalMeal } = req.body;

    if (!mealId) {
      return res.status(400).json({
        message: "Meal ID is required"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const existingBooking = await MealBooking.findOne({
      studentId: req.student._id,
      mealId,
      status: "Booked"
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked this meal"
      });
    }

    const booking = await MealBooking.create({
      studentId: req.student._id,
      mealId,
      additionalMeal: additionalMeal || false
    });

    const populatedBooking = await MealBooking.findById(booking._id)
      .populate("studentId", "studentId name email")
      .populate("mealId");

    res.status(201).json({
      message: "Meal booked successfully",
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book meal",
      error: error.message
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await MealBooking.find({
      studentId: req.student._id
    })
      .populate("mealId")
      .sort({ bookingDate: -1 });

    res.json({
      message: "Bookings retrieved successfully",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve bookings",
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings
};