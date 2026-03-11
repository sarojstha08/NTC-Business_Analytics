// ============================================================
// Auth Controller — Login & Register
// ============================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: "User with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "ANALYST",
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
