const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Complaint", "complaints", ["studentId", "subject", "description", "status", "complaintDate"], {"status": "Pending"});
