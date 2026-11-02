const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Vote", "votes", ["studentId", "foodItem", "voteDate"], {});
