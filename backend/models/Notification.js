const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Notification", "notifications", ["studentId", "title", "message", "notificationDate", "status"], {"status": "Unread"});
