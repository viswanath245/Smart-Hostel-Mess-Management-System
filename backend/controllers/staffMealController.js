const Meal = require("../models/Meal");

const createStaffMeal = async (req, res) => {
  try {
    const {
      mealName,
      mealType,
      mealDate,
      calories,
      nutritionInfo,
      preparationStatus
    } = req.body;

    if (!mealName || !mealType || !mealDate) {
      return res.status(400).json({
        message:
          "Meal name, meal type and meal date are required"
      });
    }

    const meal = await Meal.create({
      mealName,
      mealType,
      mealDate,
      calories,
      nutritionInfo,
      preparationStatus
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

const getStaffMeals = async (req, res) => {
  try {
    const meals = await Meal.find()
      .sort({ mealDate: 1, mealType: 1 });

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

const updateStaffMeal = async (req, res) => {
  try {
    const mealId = req.params.id.trim();

    const {
      mealName,
      mealType,
      mealDate,
      calories,
      nutritionInfo,
      preparationStatus
    } = req.body;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    if (mealName !== undefined) {
      meal.mealName = mealName;
    }

    if (mealType !== undefined) {
      meal.mealType = mealType;
    }

    if (mealDate !== undefined) {
      meal.mealDate = mealDate;
    }

    if (calories !== undefined) {
      meal.calories = calories;
    }

    if (nutritionInfo !== undefined) {
      meal.nutritionInfo = nutritionInfo;
    }

    if (preparationStatus !== undefined) {
      meal.preparationStatus = preparationStatus;
    }

    await meal.save();

    res.json({
      message: "Meal updated successfully",
      meal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update meal",
      error: error.message
    });
  }
};

const deleteStaffMeal = async (req, res) => {
  try {
    const mealId = req.params.id.trim();

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    await Meal.findByIdAndDelete(mealId);

    res.json({
      message: "Meal deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete meal",
      error: error.message
    });
  }
};


module.exports = {
  createStaffMeal,
  getStaffMeals,
  updateStaffMeal,
  deleteStaffMeal
};