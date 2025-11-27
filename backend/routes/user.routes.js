const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/User")

const router = express.Router()

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/balance/update", auth, async (req, res) => {
  try {
    const { amount } = req.body
    const user = await User.findByIdAndUpdate(req.userId, { $inc: { balance: amount } }, { new: true })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
