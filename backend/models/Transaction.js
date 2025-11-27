const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense", "transfer"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipient",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "bank_transfer", "cash", "digital_wallet"],
    default: "card",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ userId: 1, category: 1 })

module.exports = mongoose.model("Transaction", transactionSchema)
