const User = require("../models/User")
const jwt = require("jsonwebtoken")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    user = new User({
      name,
      email,
      password,
      phone,
      incomeSources: req.body.incomeSources || [],
    })

    await user.save()

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, avatar, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
