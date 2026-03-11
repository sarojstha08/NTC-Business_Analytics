// ============================================================
// Input Validation Middleware using express-validator
// ============================================================

const { body, validationResult } = require("express-validator");

/**
 * Validation rules for FAP control data
 */
const validateFapData = [
  body("regionId").isInt({ min: 1 }).withMessage("Valid regionId is required"),
  body("serviceId").isInt({ min: 1 }).withMessage("Valid serviceId is required"),
  body("timePeriodId").isInt({ min: 1 }).withMessage("Valid timePeriodId is required"),
  body("categoryId").isInt({ min: 1 }).withMessage("Valid categoryId is required"),
  body("activeUsers").isInt({ min: 0 }).withMessage("activeUsers must be a non-negative integer"),
  body("nonRenewalUsers").isInt({ min: 0 }).withMessage("nonRenewalUsers must be a non-negative integer"),
  body("revenue").isFloat({ min: 0 }).withMessage("revenue must be a non-negative number"),
  body("occupancyPercentage").isFloat({ min: 0, max: 100 }).withMessage("occupancyPercentage must be 0-100"),
  body("dataUsage").isFloat({ min: 0 }).withMessage("dataUsage must be a non-negative number"),
  body("callVolume").isInt({ min: 0 }).withMessage("callVolume must be a non-negative integer"),
  body("peakUsageTime").notEmpty().withMessage("peakUsageTime is required"),
];

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["ADMIN", "ANALYST"]).withMessage("Role must be ADMIN or ANALYST"),
];

/**
 * Validation rules for login
 */
const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Handle validation errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = {
  validateFapData,
  validateRegister,
  validateLogin,
  handleValidationErrors,
};
