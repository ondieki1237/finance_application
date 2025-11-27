const Subscription = require("../models/Subscription")
const Alert = require("../models/Alert")

exports.createSubscription = async (req, res) => {
  try {
    const { name, provider, amount, frequency, nextBillingDate, category, icon } = req.body

    const subscription = new Subscription({
      userId: req.userId,
      name,
      provider,
      amount,
      frequency,
      nextBillingDate,
      category,
      icon,
    })

    await subscription.save()

    // Create alert for new subscription
    await Alert.create({
      userId: req.userId,
      type: "subscription",
      title: `New subscription: ${name}`,
      description: `$${amount} will be charged ${frequency}`,
      subscriptionId: subscription._id,
      icon: icon || "bell",
    })

    res.status(201).json(subscription)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSubscriptions = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query

    const filter = { userId: req.userId }
    if (status) filter.status = status

    const skip = (page - 1) * limit
    const subscriptions = await Subscription.find(filter)
      .sort({ nextBillingDate: 1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Subscription.countDocuments(filter)

    res.status(200).json({
      subscriptions,
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

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }
    if (subscription.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    res.status(200).json(subscription)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }
    if (subscription.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )
    res.status(200).json(subscription)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" })
    }
    if (subscription.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Subscription.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Subscription deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
