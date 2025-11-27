const express = require("express")
const {
  createRecipient,
  getRecipients,
  getRecipientById,
  updateRecipient,
  toggleFavorite,
  deleteRecipient,
} = require("../controllers/recipientController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, createRecipient)
router.get("/", auth, getRecipients)
router.get("/:id", auth, getRecipientById)
router.put("/:id", auth, updateRecipient)
router.put("/:id/favorite", auth, toggleFavorite)
router.delete("/:id", auth, deleteRecipient)

module.exports = router
