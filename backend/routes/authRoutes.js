// ============================================================
// Auth Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { validateRegister, validateLogin, handleValidationErrors } = require("../middleware/validate");

// POST /api/auth/register
router.post("/register", validateRegister, handleValidationErrors, register);

// POST /api/auth/login
router.post("/login", validateLogin, handleValidationErrors, login);

module.exports = router;
