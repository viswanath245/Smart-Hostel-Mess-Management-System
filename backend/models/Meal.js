const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Meal", "meals", ["mealName", "mealType", "mealDate", "calories", "nutritionInfo", "preparationStatus"], {"calories": 0, "preparationStatus": "Planned"});
