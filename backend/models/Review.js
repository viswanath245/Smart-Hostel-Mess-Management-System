const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Review", "reviews", ["studentId", "mealId", "rating", "comment"], {});
