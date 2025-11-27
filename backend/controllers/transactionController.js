const Transaction = require("../models/Transaction")
const User = require("../models/User")
const Recipient = require("../models/Recipient")
const Alert = require("../models/Alert")

exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, recipientId, paymentMethod, tags } = req.body

    const transaction = new Transaction({
      userId: req.userId,
      type,
      category,
      amount,
      description,
      recipientId,
      paymentMethod,
      tags,
    })

    await transaction.save()

    // Update user balance
    if (type === "income") {
      await User.findByIdAndUpdate(req.userId, { $inc: { balance: amount } })
    } else if (type === "expense") {
      await User.findByIdAndUpdate(req.userId, { $inc: { balance: -amount } })
    }

    // Update recipient stats if exists
    if (recipientId) {
      await Recipient.findByIdAndUpdate(recipientId, {
        $inc: { transactionCount: 1, totalAmount: amount },
        lastTransactionDate: Date.now(),
      })
    }

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit = 20, page = 1 } = req.query

    const filter = { userId: req.userId }
    if (type) filter.type = type
    if (category) filter.category = category
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    const skip = (page - 1) * limit
    const transactions = await Transaction.find(filter)
      .populate("recipientId")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Transaction.countDocuments(filter)

    res.status(200).json({
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("recipientId")
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    res.status(200).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Transaction.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Transaction deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
