const express = require("express");

const {
  createNotification,
  getMyNotifications,
  markNotificationAsRead
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNotification);
router.get("/my", protect, getMyNotifications);
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;