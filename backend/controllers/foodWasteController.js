const FoodWaste = require("../models/FoodWaste");
const Meal = require("../models/Meal");

const recordFoodWaste = async (req, res) => {
  try {
    const {
      mealId,
      date,
      foodPrepared,
      foodWasted
    } = req.body;

    if (
      !mealId ||
      !date ||
      foodPrepared === undefined ||
      foodWasted === undefined
    ) {
      return res.status(400).json({
        message:
          "Meal ID, date, food prepared and food wasted are required"
      });
    }

    if (foodPrepared <= 0) {
      return res.status(400).json({
        message: "Food prepared must be greater than 0"
      });
    }

    if (foodWasted < 0) {
      return res.status(400).json({
        message: "Food wasted cannot be negative"
      });
    }

    if (foodWasted > foodPrepared) {
      return res.status(400).json({
        message:
          "Food wasted cannot be greater than food prepared"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const wastePercentage = Number(
      ((foodWasted / foodPrepared) * 100).toFixed(2)
    );

    const waste = await FoodWaste.create({
      mealId,
      date,
      foodPrepared,
      foodWasted,
      wastePercentage
    });

    const populatedWaste =
      await FoodWaste.findById(waste._id)
        .populate("mealId");

    res.status(201).json({
      message: "Food waste data recorded successfully",
      waste: populatedWaste
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record food waste data",
      error: error.message
    });
  }
};

const getFoodWasteRecords = async (req, res) => {
  try {
    const wasteRecords =
      await FoodWaste.find()
        .populate("mealId")
        .sort({ date: -1 });

    res.json({
      message:
        "Food waste records retrieved successfully",
      count: wasteRecords.length,
      wasteRecords
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to retrieve food waste records",
      error: error.message
    });
  }
};

module.exports = {
  recordFoodWaste,
  getFoodWasteRecords
};