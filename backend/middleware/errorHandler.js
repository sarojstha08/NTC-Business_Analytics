// ============================================================
// Global Error Handler Middleware
// ============================================================

function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err.stack || err.message);

  // Prisma known errors
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      error: "A record with this data already exists.",
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      error: "Record not found.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
}

module.exports = errorHandler;
