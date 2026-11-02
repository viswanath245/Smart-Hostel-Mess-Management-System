const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Vendor", "vendors", ["vendorId", "vendorName", "phone", "address"], {});
