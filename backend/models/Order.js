const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Order", "orders", ["vendorId", "itemName", "quantity", "orderDate", "status"], {"status": "Pending"});
