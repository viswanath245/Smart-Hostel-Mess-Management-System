const Menu = require("../models/Menu");
const Meal = require("../models/Meal");

const createStaffMenuItem = async (req, res) => {
  try {
    const { mealId, foodItem, day } = req.body;

    if (!mealId || !foodItem || !day) {
      return res.status(400).json({
        message: "Meal ID, food item and day are required"
      });
    }

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    const menuItem = await Menu.create({
      mealId,
      foodItem,
      day
    });

    const populatedMenuItem = await Menu.findById(
      menuItem._id
    ).populate("mealId");

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: populatedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu item",
      error: error.message
    });
  }
};

const getStaffMenu = async (req, res) => {
  try {
    const menu = await Menu.find()
      .populate("mealId")
      .sort({ day: 1, foodItem: 1 });

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

const updateStaffMenuItem = async (req, res) => {
  try {
    const { mealId, foodItem, day } = req.body;

    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    if (mealId !== undefined) {
      const meal = await Meal.findById(mealId);

      if (!meal) {
        return res.status(404).json({
          message: "Meal not found"
        });
      }

      menuItem.mealId = mealId;
    }

    if (foodItem !== undefined) {
      menuItem.foodItem = foodItem;
    }

    if (day !== undefined) {
      menuItem.day = day;
    }

    await menuItem.save();

    const populatedMenuItem = await Menu.findById(
      menuItem._id
    ).populate("mealId");

    res.json({
      message: "Menu item updated successfully",
      menuItem: populatedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu item",
      error: error.message
    });
  }
};

const deleteStaffMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message
    });
  }
};

module.exports = {
  createStaffMenuItem,
  getStaffMenu,
  updateStaffMenuItem,
  deleteStaffMenuItem
};