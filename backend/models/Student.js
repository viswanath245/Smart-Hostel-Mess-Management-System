const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Student", "students", ["studentId", "name", "email", "password", "phone", "hostelBlock", "roomNo", "healthGoal", "rewardPoints"], {"rewardPoints": 0});
