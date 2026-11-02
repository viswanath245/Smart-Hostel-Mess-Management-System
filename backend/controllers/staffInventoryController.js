const Inventory = require("../models/Inventory");
const Vendor = require("../models/Vendor");

const getStockStatus = (quantity, reorderLevel) => {
  return quantity <= reorderLevel
    ? "Low Stock"
    : "Normal Stock";
};

const createInventoryItem = async (req, res) => {
  try {
    const {
      vendorId,
      itemName,
      quantity,
      reorderLevel
    } = req.body;

    if (
      !vendorId ||
      !itemName ||
      quantity === undefined ||
      reorderLevel === undefined
    ) {
      return res.status(400).json({
        message:
          "Vendor ID, item name, quantity and reorder level are required"
      });
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found"
      });
    }

    if (quantity < 0 || reorderLevel < 0) {
      return res.status(400).json({
        message:
          "Quantity and reorder level cannot be negative"
      });
    }

    const inventory = await Inventory.create({
      vendorId,
      itemName,
      quantity,
      reorderLevel
    });

    const populatedInventory =
      await Inventory.findById(inventory._id)
        .populate("vendorId");

    res.status(201).json({
      message: "Inventory item created successfully",
      stockStatus: getStockStatus(
        inventory.quantity,
        inventory.reorderLevel
      ),
      inventory: populatedInventory
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create inventory item",
      error: error.message
    });
  }
};

const getInventory = async (req, res) => {
  try {
    const inventory =
      await Inventory.find()
        .populate("vendorId")
        .sort({ itemName: 1 });

    const inventoryWithStatus = inventory.map(
      (item) => ({
        ...item.toObject(),
        stockStatus: getStockStatus(
          item.quantity,
          item.reorderLevel
        )
      })
    );

    res.json({
      message: "Inventory retrieved successfully",
      count: inventoryWithStatus.length,
      inventory: inventoryWithStatus
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve inventory",
      error: error.message
    });
  }
};

const updateInventory = async (req, res) => {
  try {
    const {
      itemName,
      quantity,
      reorderLevel,
      vendorId
    } = req.body;

    const inventory =
      await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory item not found"
      });
    }

    if (vendorId !== undefined) {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found"
        });
      }

      inventory.vendorId = vendorId;
    }

    if (itemName !== undefined) {
      inventory.itemName = itemName;
    }

    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({
          message: "Quantity cannot be negative"
        });
      }

      inventory.quantity = quantity;
    }

    if (reorderLevel !== undefined) {
      if (reorderLevel < 0) {
        return res.status(400).json({
          message:
            "Reorder level cannot be negative"
        });
      }

      inventory.reorderLevel = reorderLevel;
    }

    inventory.lastUpdated = new Date();

    await inventory.save();

    const populatedInventory =
      await Inventory.findById(inventory._id)
        .populate("vendorId");

    res.json({
      message: "Inventory updated successfully",
      stockStatus: getStockStatus(
        inventory.quantity,
        inventory.reorderLevel
      ),
      inventory: populatedInventory
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update inventory",
      error: error.message
    });
  }
};

module.exports = {
  createInventoryItem,
  getInventory,
  updateInventory
};