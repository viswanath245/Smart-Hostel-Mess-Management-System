const Student = require("../models/Student");

const getProfile = async (req, res) => {
  try {
    res.json({
      message: "Profile retrieved successfully",
      student: req.student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve profile",
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      hostelBlock,
      roomNo,
      healthGoal
    } = req.body;

    const student = await Student.findById(req.student._id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    if (name !== undefined) student.name = name;
    if (phone !== undefined) student.phone = phone;
    if (hostelBlock !== undefined) student.hostelBlock = hostelBlock;
    if (roomNo !== undefined) student.roomNo = roomNo;
    if (healthGoal !== undefined) student.healthGoal = healthGoal;

    await student.save();

    res.json({
      message: "Profile updated successfully",
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        hostelBlock: student.hostelBlock,
        roomNo: student.roomNo,
        healthGoal: student.healthGoal,
        rewardPoints: student.rewardPoints
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};