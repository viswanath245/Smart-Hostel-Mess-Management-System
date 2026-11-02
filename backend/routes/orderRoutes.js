const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const protectStaff = require("../middleware/staffAuthMiddleware");

const router = express.Router();

router.post("/", protectStaff, createOrder);
router.get("/", protectStaff, getOrders);
router.put("/:id/status", protectStaff, updateOrderStatus);

module.exports = router;