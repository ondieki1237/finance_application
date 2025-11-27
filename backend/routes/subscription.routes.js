const express = require("express")
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/subscriptionController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, createSubscription)
router.get("/", auth, getSubscriptions)
router.get("/:id", auth, getSubscriptionById)
router.put("/:id", auth, updateSubscription)
router.delete("/:id", auth, deleteSubscription)

module.exports = router
