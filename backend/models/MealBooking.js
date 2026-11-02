const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("MealBooking", "meal_bookings", ["studentId", "mealId", "bookingDate", "status", "additionalMeal"], {"status": "Booked", "additionalMeal": false});
