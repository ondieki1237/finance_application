const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("[v0] MongoDB connected successfully"))
  .catch((err) => {
    console.error("[v0] MongoDB connection error:", err.message)
    process.exit(1)
  })

// Routes (will be imported)
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/users", require("./routes/user.routes"))
app.use("/api/transactions", require("./routes/transaction.routes"))
app.use("/api/recipients", require("./routes/recipient.routes"))
app.use("/api/subscriptions", require("./routes/subscription.routes"))
app.use("/api/alerts", require("./routes/alert.routes"))

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[v0] Error:", err.message)
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  })
})

const PORT = process.env.PORT || 1800
app.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`)
})

module.exports = app
