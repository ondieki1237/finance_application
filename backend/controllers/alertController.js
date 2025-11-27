const Alert = require("../models/Alert")

exports.createAlert = async (req, res) => {
  try {
    const { type, title, description, amount, icon } = req.body

    const alert = new Alert({
      userId: req.userId,
      type,
      title,
      description,
      amount,
      icon,
    })

    await alert.save()
    res.status(201).json(alert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAlerts = async (req, res) => {
  try {
    const { isRead, type, limit = 20, page = 1 } = req.query

    const filter = { userId: req.userId }
    if (isRead !== undefined) filter.isRead = JSON.parse(isRead)
    if (type) filter.type = type

    const skip = (page - 1) * limit
    const alerts = await Alert.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit))

    const total = await Alert.countDocuments(filter)

    res.status(200).json({
      alerts,
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

exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" })
    }
    if (alert.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    res.status(200).json(alert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" })
    }
    if (alert.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    alert.isRead = true
    await alert.save()
    res.status(200).json(alert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany({ userId: req.userId, isRead: false }, { isRead: true })
    res.status(200).json({ message: "All alerts marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" })
    }
    if (alert.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Alert.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Alert deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
