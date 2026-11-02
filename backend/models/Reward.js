const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Reward", "rewards", ["studentId", "pointsEarned", "reason", "rewardDate"], {});
