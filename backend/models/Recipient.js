const mongoose = require("mongoose")

const recipientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  accountNumber: String,
  bankName: String,
  purpose: {
    type: String,
    enum: ["personal", "business", "family", "friend", "other"],
    default: "other",
  },
  avatar: String,
  transactionCount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  lastTransactionDate: Date,
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

recipientSchema.index({ userId: 1 })
recipientSchema.index({ userId: 1, isFavorite: 1 })

module.exports = mongoose.model("Recipient", recipientSchema)
