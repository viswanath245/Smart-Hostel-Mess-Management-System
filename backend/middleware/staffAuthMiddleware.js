const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

const protectStaff = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Not authorized. Please log in as staff."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "Mess Staff") {
      return res.status(403).json({
        message: "Staff access required"
      });
    }

    const staff = await Staff.findById(
      decoded.id
    ).select("-password");

    if (!staff) {
      return res.status(401).json({
        message: "Staff member not found"
      });
    }

    req.staff = staff;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired staff token"
    });
  }
};

module.exports = protectStaff;