const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Inventory", "inventory", ["vendorId", "itemName", "quantity", "reorderLevel", "lastUpdated"], {});
