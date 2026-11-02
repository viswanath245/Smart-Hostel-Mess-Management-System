const Student = require("../models/Student");

const getStaffStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select(
        "studentId name email hostelBlock roomNo"
      )
      .sort({ studentId: 1 });

    res.json({
      message:
        "Students retrieved successfully",
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to retrieve students",
      error: error.message
    });
  }
};

module.exports = {
  getStaffStudents
};