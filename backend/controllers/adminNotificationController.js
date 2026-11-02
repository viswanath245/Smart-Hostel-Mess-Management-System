const Notification = require("../models/Notification");

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("studentId", "studentId name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notifications retrieved successfully",
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Server error while retrieving notifications.",
    });
  }
};

// Get one notification
exports.getNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id.trim();

    const notification = await Notification.findById(
      notificationId
    ).populate("studentId", "studentId name email");

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      message: "Notification retrieved successfully",
      notification,
    });
  } catch (error) {
    console.error("Get notification error:", error);

    res.status(500).json({
      message: "Server error while retrieving notification.",
    });
  }
};

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const {
      studentId,
      title,
      message,
      notificationDate,
      status,
    } = req.body;

    if (!studentId || !title || !message) {
      return res.status(400).json({
        message: "studentId, title and message are required.",
      });
    }

    const notification = new Notification({
      studentId,
      title,
      message,
      notificationDate,
      status,
    });

    await notification.save();

    const createdNotification = await Notification.findById(
      notification._id
    ).populate("studentId", "studentId name email");

    res.status(201).json({
      message: "Notification created successfully",
      notification: createdNotification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      message: "Server error while creating notification.",
    });
  }
};

// Update notification status
exports.updateNotification = async (req, res) => {
  try {
    const notificationId = req.params.id.trim();

    const { status } = req.body;

    const notification = await Notification.findById(
      notificationId
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    if (status !== undefined) {
      notification.status = status;
    }

    await notification.save();

    const updatedNotification = await Notification.findById(
      notification._id
    ).populate("studentId", "studentId name email");

    res.status(200).json({
      message: "Notification updated successfully",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Update notification error:", error);

    res.status(500).json({
      message: "Server error while updating notification.",
    });
  }
};