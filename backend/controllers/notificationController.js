const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required"
      });
    }

    const notification = await Notification.create({
      studentId: req.student._id,
      title,
      message
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message
    });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      studentId: req.student._id
    }).sort({ notificationDate: -1 });

    res.json({
      message: "Notifications retrieved successfully",
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve notifications",
      error: error.message
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        studentId: req.student._id
      },
      {
        status: "Read"
      },
      {
        new: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.json({
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message
    });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markNotificationAsRead
};