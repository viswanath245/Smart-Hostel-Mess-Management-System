const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "No authentication token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "Admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    const admin = await Admin.findById(
      decoded.id
    ).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = adminAuthMiddleware;