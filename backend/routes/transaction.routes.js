const express = require("express")
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, createTransaction)
router.get("/", auth, getTransactions)
router.get("/:id", auth, getTransactionById)
router.put("/:id", auth, updateTransaction)
router.delete("/:id", auth, deleteTransaction)

module.exports = router
