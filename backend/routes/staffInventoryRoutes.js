const express = require("express");

const {
  createInventoryItem,
  getInventory,
  updateInventory
} = require("../controllers/staffInventoryController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, createInventoryItem);
router.get("/", protectStaff, getInventory);
router.put("/:id", protectStaff, updateInventory);

module.exports = router;