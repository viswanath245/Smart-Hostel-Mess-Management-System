const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("FoodWaste", "food_waste", ["mealId", "date", "foodPrepared", "foodWasted", "wastePercentage"], {});
