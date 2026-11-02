const Menu = require("../models/Menu");

const createMenuItem = async (req, res) => {
  try {
    const {
      mealId,
      foodItem,
      day
    } = req.body;

    if (!mealId || !foodItem || !day) {
      return res.status(400).json({
        message: "Meal ID, food item and day are required"
      });
    }

    const menuItem = await Menu.create({
      mealId,
      foodItem,
      day
    });

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu item",
      error: error.message
    });
  }
};

const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find()
      .populate("mealId")
      .sort({ day: 1 });

    res.json({
      message: "Menu retrieved successfully",
      count: menu.length,
      menu
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve menu",
      error: error.message
    });
  }
};

const getMenuByMeal = async (req, res) => {
  try {
    const menu = await Menu.find({
      mealId: req.params.mealId
    }).populate("mealId");

    res.json({
      message: "Meal menu retrieved successfully",
      count: menu.length,
      menu
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve meal menu",
      error: error.message
    });
  }
};

module.exports = {
  createMenuItem,
  getMenu,
  getMenuByMeal
};