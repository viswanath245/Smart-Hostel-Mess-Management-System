const Meal = require("../models/Meal");

const getNutrition = async (req, res) => {
  try {
    const meals = await Meal.find(
      {},
      {
        mealName: 1,
        mealType: 1,
        mealDate: 1,
        calories: 1,
        nutritionInfo: 1
      }
    ).sort({ mealDate: 1 });

    res.json({
      message: "Nutrition information retrieved successfully",
      count: meals.length,
      nutrition: meals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve nutrition information",
      error: error.message
    });
  }
};

const getNutritionRecommendation = async (req, res) => {
  try {
    const healthGoal = req.student.healthGoal || "Maintain Weight";

    const meals = await Meal.find(
      {},
      {
        mealName: 1,
        mealType: 1,
        mealDate: 1,
        calories: 1,
        nutritionInfo: 1
      }
    ).sort({ mealDate: 1 });

    let recommendation;

    if (healthGoal.toLowerCase() === "build muscle") {
      recommendation =
        "Choose meals that provide good protein sources along with balanced carbohydrates and regular meal timing.";
    } else if (healthGoal.toLowerCase() === "lose weight") {
      recommendation =
        "Prefer balanced meals with vegetables, adequate protein and moderate calorie intake.";
    } else {
      recommendation =
        "Maintain a balanced diet with a mix of carbohydrates, protein, vegetables, fruits and adequate hydration.";
    }

    res.json({
      message: "Nutrition recommendation generated successfully",
      healthGoal,
      recommendation,
      suggestedMeals: meals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate nutrition recommendation",
      error: error.message
    });
  }
};

module.exports = {
  getNutrition,
  getNutritionRecommendation
};