const express = require("express");

const {
  createVendor,
  getVendors
} = require("../controllers/staffVendorController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, createVendor);
router.get("/", protectStaff, getVendors);

module.exports = router;