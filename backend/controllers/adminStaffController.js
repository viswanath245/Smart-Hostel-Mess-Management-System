const Staff = require("../models/Staff");

// ========================================
// GET ALL STAFF
// ========================================
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Staff retrieved successfully",
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Admin get staff error:", error);

    res.status(500).json({
      message: "Server error while retrieving staff.",
    });
  }
};

// ========================================
// GET ONE STAFF MEMBER
// ========================================
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select("-password");

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found.",
      });
    }

    res.status(200).json({
      message: "Staff retrieved successfully",
      staff,
    });
  } catch (error) {
    console.error("Admin get staff error:", error);

    res.status(500).json({
      message: "Server error while retrieving staff.",
    });
  }
};

// ========================================
// UPDATE STAFF
// ========================================
exports.updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id.trim();

    const {
      name,
      email,
      role,
    } = req.body;

    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found.",
      });
    }

    if (name !== undefined) {
      staff.name = name;
    }

    if (email !== undefined) {
      staff.email = email.toLowerCase();
    }

    if (role !== undefined) {
      staff.role = role;
    }

    await staff.save();

    const updatedStaff = await Staff.findById(
      staff._id
    ).select("-password");

    res.status(200).json({
      message: "Staff updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    console.error("Admin update staff error:", error);

    res.status(500).json({
      message: "Server error while updating staff.",
    });
  }
};