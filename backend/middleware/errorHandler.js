const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  console.error("[v0] Error:", {
    status,
    message,
    stack: err.stack,
  })

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err }),
  })
}

module.exports = errorHandler
