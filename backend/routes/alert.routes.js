const express = require("express")
const {
  createAlert,
  getAlerts,
  getAlertById,
  markAsRead,
  markAllAsRead,
  deleteAlert,
} = require("../controllers/alertController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, createAlert)
router.get("/", auth, getAlerts)
router.get("/:id", auth, getAlertById)
router.put("/:id/read", auth, markAsRead)
router.put("/read-all", auth, markAllAsRead)
router.delete("/:id", auth, deleteAlert)

module.exports = router
