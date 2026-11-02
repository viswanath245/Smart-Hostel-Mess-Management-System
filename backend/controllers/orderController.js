const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

const createOrder = async (req, res) => {
  try {
    const {
      vendorId,
      itemName,
      quantity
    } = req.body;

    if (!vendorId || !itemName || quantity === undefined) {
      return res.status(400).json({
        message:
          "Vendor ID, item name and quantity are required"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Order quantity must be greater than 0"
      });
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found"
      });
    }

    const order = await Order.create({
      vendorId,
      itemName,
      quantity
    });

    const populatedOrder =
      await Order.findById(order._id)
        .populate("vendorId");

    res.status(201).json({
      message: "Ingredient order created successfully",
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ingredient order",
      error: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("vendorId")
      .sort({ orderDate: -1 });

    res.json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Ordered",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    const populatedOrder =
      await Order.findById(order._id)
        .populate("vendorId");

    res.json({
      message: "Order status updated successfully",
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};