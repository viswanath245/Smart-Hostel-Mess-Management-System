
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

function generateAdminToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      adminId: admin.adminId,
      role: admin.role
    },
    process.env.JWT_SECRET || "development_secret_change_me",
    { expiresIn: "7d" }
  );
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || password === undefined || password === null) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [rows] = await pool.execute(
      `SELECT id, adminId, name, email, password, role
       FROM admins
       WHERE email = ?
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const admin = rows[0];
    const token = generateAdminToken(admin);

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      user: {
        id: admin.id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      message: "Admin login failed"
    });
  }
};

module.exports = { loginAdmin };
