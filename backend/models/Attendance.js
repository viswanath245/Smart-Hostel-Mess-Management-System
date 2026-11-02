const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Attendance", "attendance", ["studentId", "mealId", "attendanceTime", "status"], {});
