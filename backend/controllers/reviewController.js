const Review = require("../models/Review");
const Meal = require("../models/Meal");

const createReview = async (req, res) => {
  try {
    const { mealId, rating, comment } = req.body;

    if (!mealId || rating === undefined) {
      return res.status(400).json({
        message: "Meal ID and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const existingReview = await Review.findOne({
      studentId: req.student._id,
      mealId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this meal"
      });
    }

    const review = await Review.create({
      studentId: req.student._id,
      mealId,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id)
      .populate("studentId", "studentId name")
      .populate("mealId");

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit review",
      error: error.message
    });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      studentId: req.student._id
    })
      .populate("mealId")
      .sort({ createdAt: -1 });

    res.json({
      message: "Reviews retrieved successfully",
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve reviews",
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getMyReviews
};