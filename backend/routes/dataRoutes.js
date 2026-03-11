// ============================================================
// Data Management Routes (Admin only)
// ============================================================

const express = require("express");
const router = express.Router();
const { addRecord, updateRecord, deleteRecord } = require("../controllers/dataController");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const { validateFapData, handleValidationErrors } = require("../middleware/validate");

// All data routes require authentication + admin role
router.use(authenticate, authorizeAdmin);

// POST /api/data/add
router.post("/add", validateFapData, handleValidationErrors, addRecord);

// PUT /api/data/update/:id
router.put("/update/:id", updateRecord);

// DELETE /api/data/delete/:id
router.delete("/delete/:id", deleteRecord);

module.exports = router;
