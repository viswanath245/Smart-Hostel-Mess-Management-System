const Student = require("../models/Student");
const Staff = require("../models/Staff");
const Meal = require("../models/Meal");
const MealBooking = require("../models/MealBooking");
const Attendance = require("../models/Attendance");
const Complaint = require("../models/Complaint");
const Reward = require("../models/Reward");
const Notification = require("../models/Notification");
const Order = require("../models/Order");
const CrowdMonitoring = require("../models/CrowdMonitoring");
const FoodWaste = require("../models/FoodWaste");

const getAdminReports = async (req, res) => {
  try {
    const [
      totalStudents,
      totalStaff,
      totalMeals,
      totalBookings,
      totalAttendance,
      totalComplaints,
      totalRewards,
      totalNotifications,
      totalOrders,
      totalCrowdRecords,
      totalWasteRecords,

      presentCount,
      absentCount,
      missedAttendanceCount,

      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,

      unreadNotifications,
      readNotifications,

      pendingOrders,
      orderedOrders,
      deliveredOrders,
      cancelledOrders,

      rewardAggregation,

      preparedAggregation,
      wastedAggregation
    ] = await Promise.all([
      Student.countDocuments(),
      Staff.countDocuments(),
      Meal.countDocuments(),
      MealBooking.countDocuments(),
      Attendance.countDocuments(),
      Complaint.countDocuments(),
      Reward.countDocuments(),
      Notification.countDocuments(),
      Order.countDocuments(),
      CrowdMonitoring.countDocuments(),
      FoodWaste.countDocuments(),

      Attendance.countDocuments({ status: "Present" }),
      Attendance.countDocuments({ status: "Absent" }),
      Attendance.countDocuments({ status: "Missed" }),

      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" }),

      Notification.countDocuments({ status: "Unread" }),
      Notification.countDocuments({ status: "Read" }),

      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Ordered" }),
      Order.countDocuments({ status: "Delivered" }),
      Order.countDocuments({ status: "Cancelled" }),

      Reward.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$pointsEarned" }
          }
        }
      ]),

      FoodWaste.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$foodPrepared" }
          }
        }
      ]),

      FoodWaste.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$foodWasted" }
          }
        }
      ])
    ]);

    // Convert aggregation results into numbers
    const totalRewardPoints =
      rewardAggregation.length > 0
        ? rewardAggregation[0].total
        : 0;

    const totalFoodPrepared =
      preparedAggregation.length > 0
        ? preparedAggregation[0].total
        : 0;

    const totalFoodWasted =
      wastedAggregation.length > 0
        ? wastedAggregation[0].total
        : 0;

    // Attendance percentage
    const attendanceTotal =
      presentCount +
      absentCount +
      missedAttendanceCount;

    const attendancePercentage =
      attendanceTotal > 0
        ? Number(
            ((presentCount / attendanceTotal) * 100).toFixed(2)
          )
        : 0;

    // Complaint resolution percentage
    const complaintResolutionPercentage =
      totalComplaints > 0
        ? Number(
            (
              (resolvedComplaints / totalComplaints) *
              100
            ).toFixed(2)
          )
        : 0;

    // Food waste percentage
    const wastePercentage =
      totalFoodPrepared > 0
        ? Number(
            (
              (totalFoodWasted / totalFoodPrepared) *
              100
            ).toFixed(2)
          )
        : 0;

    res.status(200).json({
      overview: {
        totalStudents,
        totalStaff,
        totalMeals,
        totalBookings,
        totalAttendance,
        totalComplaints,
        totalRewards,
        totalNotifications,
        totalOrders,
        totalCrowdRecords,
        totalWasteRecords
      },

      attendance: {
        present: presentCount,
        absent: absentCount,
        missed: missedAttendanceCount,
        attendancePercentage
      },

      complaints: {
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        resolutionPercentage:
          complaintResolutionPercentage
      },

      notifications: {
        unread: unreadNotifications,
        read: readNotifications
      },

      orders: {
        pending: pendingOrders,
        ordered: orderedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },

      rewards: {
        totalPoints: totalRewardPoints
      },

      foodWaste: {
        totalPrepared: totalFoodPrepared,
        totalWasted: totalFoodWasted,
        wastePercentage
      }
    });

  } catch (error) {
    console.error("Admin reports error:", error);

    res.status(500).json({
      message: "Failed to generate admin reports",
      error: error.message
    });
  }
};

module.exports = {
  getAdminReports
};