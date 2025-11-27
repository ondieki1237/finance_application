const Recipient = require("../models/Recipient")

exports.createRecipient = async (req, res) => {
  try {
    const { name, email, phone, accountNumber, bankName, purpose } = req.body

    const recipient = new Recipient({
      userId: req.userId,
      name,
      email,
      phone,
      accountNumber,
      bankName,
      purpose,
    })

    await recipient.save()
    res.status(201).json(recipient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getRecipients = async (req, res) => {
  try {
    const { isFavorite, limit = 20, page = 1 } = req.query

    const filter = { userId: req.userId }
    if (isFavorite) filter.isFavorite = JSON.parse(isFavorite)

    const skip = (page - 1) * limit
    const recipients = await Recipient.find(filter)
      .sort({ transactionCount: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Recipient.countDocuments(filter)

    res.status(200).json({
      recipients,
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

exports.getRecipientById = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id)
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }
    if (recipient.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    res.status(200).json(recipient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateRecipient = async (req, res) => {
  try {
    let recipient = await Recipient.findById(req.params.id)
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }
    if (recipient.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    recipient = await Recipient.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(recipient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.toggleFavorite = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id)
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }
    if (recipient.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    recipient.isFavorite = !recipient.isFavorite
    await recipient.save()
    res.status(200).json(recipient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id)
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" })
    }
    if (recipient.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Recipient.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Recipient deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
