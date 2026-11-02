const Meal = require("../models/Meal");

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find().sort({ mealDate: 1 });

    res.json({
      message: "Meals retrieved successfully",
      count: meals.length,
      meals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve meals",
      error: error.message
    });
  }
};

const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    res.json({
      message: "Meal retrieved successfully",
      meal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve meal",
      error: error.message
    });
  }
};

const createMeal = async (req, res) => {
  try {
    const {
      mealName,
      mealType,
      mealDate,
      calories,
      nutritionInfo
    } = req.body;

    if (!mealName || !mealType || !mealDate) {
      return res.status(400).json({
        message: "Meal name, meal type and meal date are required"
      });
    }

    const meal = await Meal.create({
      mealName,
      mealType,
      mealDate,
      calories,
      nutritionInfo
    });

    res.status(201).json({
      message: "Meal created successfully",
      meal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create meal",
      error: error.message
    });
  }
};

module.exports = {
  getMeals,
  getMealById,
  createMeal
};