
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

function generateToken(student) {
  return jwt.sign(
    {
      id: student.id,
      studentId: student.studentId
    },
    process.env.JWT_SECRET || "development_secret_change_me",
    {
      expiresIn: "7d"
    }
  );
}

function formatStudent(student) {
  return {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    email: student.email,
    phone: student.phone,
    hostelBlock: student.hostelBlock,
    roomNo: student.roomNo,
    healthGoal: student.healthGoal,
    rewardPoints: student.rewardPoints
  };
}

// REGISTER STUDENT
const registerStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      password,
      phone,
      hostelBlock,
      roomNo,
      healthGoal
    } = req.body;

    if (!studentId || !name || !email || !password) {
      return res.status(400).json({
        message: "Student ID, name, email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingStudents] = await pool.execute(
      `SELECT id
       FROM students
       WHERE studentId = ? OR email = ?
       LIMIT 1`,
      [studentId.trim(), normalizedEmail]
    );

    if (existingStudents.length > 0) {
      return res.status(409).json({
        message: "Student ID or email already exists"
      });
    }

    // Password is stored as plain text, as requested.
    const [result] = await pool.execute(
      `INSERT INTO students
       (studentId, name, email, password, phone,
        hostelBlock, roomNo, healthGoal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId.trim(),
        name.trim(),
        normalizedEmail,
        password,
        phone || null,
        hostelBlock || null,
        roomNo || null,
        healthGoal || null
      ]
    );

    const [rows] = await pool.execute(
      `SELECT id, studentId, name, email, phone,
              hostelBlock, roomNo, healthGoal, rewardPoints
       FROM students
       WHERE id = ?`,
      [result.insertId]
    );

    const student = rows[0];
    const token = generateToken(student);

    return res.status(201).json({
      message: "Student registered successfully",
      token,
      student: formatStudent(student)
    });
  } catch (error) {
    console.error("Student registration error:", error.message);

    return res.status(500).json({
      message: "Registration failed"
    });
  }
};

// LOGIN STUDENT
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || password === undefined || password === null) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await pool.execute(
      `SELECT id, studentId, name, email, password, phone,
              hostelBlock, roomNo, healthGoal, rewardPoints
       FROM students
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const student = rows[0];

    // Direct comparison: no bcrypt and no password hashing.
    if (password !== student.password) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(student);

    return res.status(200).json({
      message: "Login successful",
      token,
      student: formatStudent(student)
    });
  } catch (error) {
    console.error("Student login error:", error.message);

    return res.status(500).json({
      message: "Login failed"
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent
};
