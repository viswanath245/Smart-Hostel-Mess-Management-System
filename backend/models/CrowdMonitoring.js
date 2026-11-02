const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("CrowdMonitoring", "crowd_monitoring", ["mealId", "date", "studentCount", "crowdLevel"], {});
