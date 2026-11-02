const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
} = require("../controllers/adminNotificationController");

// Get all notifications
router.get("/", adminAuthMiddleware, getAllNotifications);

// Get one notification
router.get("/:id", adminAuthMiddleware, getNotificationById);

// Create notification
router.post("/", adminAuthMiddleware, createNotification);

// Update notification
router.put("/:id", adminAuthMiddleware, updateNotification);

module.exports = router;