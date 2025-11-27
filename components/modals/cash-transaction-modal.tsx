"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Transaction } from "@/lib/types"

interface CashTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Transaction) => Promise<void>
}

export default function CashTransactionModal({ isOpen, onClose, onSave }: CashTransactionModalProps) {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"debit" | "credit">("debit")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!amount) {
      alert("Please enter an amount")
      return
    }

    setSaving(true)
    try {
      await onSave({
        recipient_identifier: "CASH",
        recipient_name: "Cash",
        amount: Number.parseFloat(amount),
        type,
        transaction_date: new Date().toISOString(),
        category: "personal",
        source: "manual",
      })
      setAmount("")
      onClose()
    } catch (err) {
      console.error("Failed to save transaction:", err)
      alert("Failed to save transaction")
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Banknote className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Cash Transaction</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Transaction Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType("debit")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    type === "debit" ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Withdraw</p>
                  <p className="text-xs text-gray-500">Money Out</p>
                </button>
                <button
                  onClick={() => setType("credit")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    type === "credit" ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Deposit</p>
                  <p className="text-xs text-gray-500">Money In</p>
                </button>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Amount (KES)</Label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl"
            >
              {saving ? "Saving..." : "Save Transaction"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
