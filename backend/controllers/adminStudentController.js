const Student = require("../models/Student");

// ========================================
// GET ALL STUDENTS
// ========================================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Students retrieved successfully",
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Admin get students error:", error);

    res.status(500).json({
      message: "Server error while retrieving students.",
    });
  }
};

// ========================================
// GET ONE STUDENT
// ========================================
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      student,
    });
  } catch (error) {
    console.error("Admin get student error:", error);

    res.status(500).json({
      message: "Server error while retrieving student.",
    });
  }
};

// ========================================
// UPDATE STUDENT
// ========================================
exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id.trim();

    const {
      name,
      phone,
      hostelBlock,
      roomNo,
      healthGoal,
    } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    if (name !== undefined) {
      student.name = name;
    }

    if (phone !== undefined) {
      student.phone = phone;
    }

    if (hostelBlock !== undefined) {
      student.hostelBlock = hostelBlock;
    }

    if (roomNo !== undefined) {
      student.roomNo = roomNo;
    }

    if (healthGoal !== undefined) {
      student.healthGoal = healthGoal;
    }

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .select("-password");

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Admin update student error:", error);

    res.status(500).json({
      message: "Server error while updating student.",
    });
  }
};