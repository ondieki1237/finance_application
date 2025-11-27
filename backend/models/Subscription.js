const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  provider: String,
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
    required: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "paused", "cancelled"],
    default: "active",
  },
  category: String,
  icon: String,
  notes: String,
  autoRenew: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

subscriptionSchema.index({ userId: 1, status: 1 })
subscriptionSchema.index({ userId: 1, nextBillingDate: 1 })

module.exports = mongoose.model("Subscription", subscriptionSchema)
