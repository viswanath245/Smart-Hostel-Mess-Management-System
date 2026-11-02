
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

function generateStaffToken(staff) {
  return jwt.sign(
    {
      id: staff.id,
      staffId: staff.staffId,
      role: staff.role
    },
    process.env.JWT_SECRET || "development_secret_change_me",
    { expiresIn: "7d" }
  );
}

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || password === undefined || password === null) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [rows] = await pool.execute(
      `SELECT id, staffId, name, email, password, role
       FROM staff
       WHERE email = ?
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const staff = rows[0];
    const token = generateStaffToken(staff);

    return res.status(200).json({
      message: "Staff login successful",
      token,
      staff: {
        id: staff.id,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        role: staff.role
      },
      user: {
        id: staff.id,
        staffId: staff.staffId,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (error) {
    console.error("Staff login error:", error.message);

    return res.status(500).json({
      message: "Staff login failed"
    });
  }
};

module.exports = { loginStaff };
