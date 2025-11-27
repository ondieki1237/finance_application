const mongoose = require("mongoose")

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "large_expense", "subscription", "anomaly", "savings_tip", "low_balance"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  amount: Number,
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  icon: String,
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

alertSchema.index({ userId: 1, createdAt: -1 })
alertSchema.index({ userId: 1, isRead: 1 })

module.exports = mongoose.model("Alert", alertSchema)
