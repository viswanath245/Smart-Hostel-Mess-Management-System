const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const mealRoutes = require("./routes/mealRoutes");
const menuRoutes = require("./routes/menuRoutes");
const mealBookingRoutes = require("./routes/mealBookingRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const voteRoutes = require("./routes/voteRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mealHistoryRoutes = require("./routes/mealHistoryRoutes");

const staffAuthRoutes = require("./routes/staffAuthRoutes");
const staffMealRoutes = require("./routes/staffMealRoutes");
const staffMenuRoutes = require("./routes/staffMenuRoutes");
const staffAttendanceRoutes = require("./routes/staffAttendanceRoutes");
const crowdRoutes = require("./routes/crowdRoutes");
const foodWasteRoutes = require("./routes/foodWasteRoutes");
const staffVendorRoutes = require("./routes/staffVendorRoutes");
const staffInventoryRoutes = require("./routes/staffInventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const staffStudentRoutes = require("./routes/staffStudentRoutes");

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const adminStaffRoutes = require("./routes/adminStaffRoutes");
const adminComplaintRoutes = require("./routes/adminComplaintRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const adminRewardRoutes = require("./routes/adminRewardRoutes");
const adminReportRoutes = require("./routes/adminReportRoutes");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/bookings", mealBookingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/history", mealHistoryRoutes);

app.use("/api/staff/auth", staffAuthRoutes);
app.use("/api/staff/meals", staffMealRoutes);
app.use("/api/staff/menu", staffMenuRoutes);
app.use("/api/staff/attendance", staffAttendanceRoutes);
app.use("/api/staff/crowd", crowdRoutes);
app.use("/api/staff/waste", foodWasteRoutes);
app.use("/api/staff/vendors", staffVendorRoutes);
app.use("/api/staff/inventory", staffInventoryRoutes);
app.use("/api/staff/orders", orderRoutes);
app.use("/api/staff/students", staffStudentRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/admin/staff", adminStaffRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/rewards", adminRewardRoutes);
app.use("/api/admin/reports", adminReportRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Smart Hostel Mess Management System API is running"
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});