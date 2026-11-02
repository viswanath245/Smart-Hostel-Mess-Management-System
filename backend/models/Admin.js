const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Admin", "admins", ["adminId", "name", "email", "password", "role"], {"role": "Admin"});
