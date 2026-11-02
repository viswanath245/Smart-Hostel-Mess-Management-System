const Vendor = require("../models/Vendor");

const createVendor = async (req, res) => {
  try {
    const {
      vendorId,
      vendorName,
      phone,
      address
    } = req.body;

    if (!vendorId || !vendorName) {
      return res.status(400).json({
        message: "Vendor ID and vendor name are required"
      });
    }

    const existingVendor = await Vendor.findOne({
      $or: [
        { vendorId },
        { vendorName }
      ]
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Vendor ID or vendor name already exists"
      });
    }

    const vendor = await Vendor.create({
      vendorId,
      vendorName,
      phone,
      address
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create vendor",
      error: error.message
    });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .sort({ vendorName: 1 });

    res.json({
      message: "Vendors retrieved successfully",
      count: vendors.length,
      vendors
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve vendors",
      error: error.message
    });
  }
};

module.exports = {
  createVendor,
  getVendors
};