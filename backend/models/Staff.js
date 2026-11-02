const { defineModel } = require("../config/mysqlModel");
module.exports = defineModel("Staff", "staff", ["staffId", "name", "email", "password", "role"], {"role": "Mess Staff"});
