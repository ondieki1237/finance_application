"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction, TransactionCategory } from "@/lib/types"

const categories: { value: TransactionCategory; label: string; emoji: string }[] = [
  { value: "family_support", label: "Family Support", emoji: "👨‍👩‍👧‍👦" },
  { value: "business_expense", label: "Business", emoji: "💼" },
  { value: "school_fees", label: "School Fees", emoji: "🎓" },
  { value: "loan_repayment", label: "Loan", emoji: "💳" },
  { value: "investment", label: "Investment", emoji: "📈" },
  { value: "personal", label: "Personal", emoji: "🛍️" },
  { value: "income", label: "Income", emoji: "💰" },
  { value: "savings", label: "Savings", emoji: "🏦" },
  { value: "utility", label: "Utility", emoji: "💡" },
  { value: "subscription", label: "Subscription", emoji: "🔄" },
  { value: "betting", label: "Betting", emoji: "🎰" },
  { value: "transport", label: "Transport", emoji: "🚗" },
  { value: "food", label: "Food", emoji: "🍔" },
  { value: "airtime", label: "Airtime", emoji: "📱" },
  { value: "data_bundle", label: "Data Bundle", emoji: "📶" },
  { value: "healthcare", label: "Healthcare", emoji: "🏥" },
  { value: "rent", label: "Rent", emoji: "🏠" },
  { value: "other", label: "Other", emoji: "📋" },
]

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Transaction) => Promise<void>
}

export default function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
  const [type, setType] = useState<"debit" | "credit">("debit")
  const [formData, setFormData] = useState({
    recipient_identifier: "",
    recipient_name: "",
    amount: "",
    category: "other" as TransactionCategory,
    purpose: "",
    transaction_date: new Date().toISOString().split("T")[0],
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!formData.recipient_identifier || !formData.amount) {
      alert("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      await onSave({
        recipient_identifier: formData.recipient_identifier,
        recipient_name: formData.recipient_name,
        amount: Number.parseFloat(formData.amount),
        type,
        transaction_date: new Date(formData.transaction_date).toISOString(),
        purpose: formData.purpose,
        category: formData.category,
        source: "manual",
      })
      setFormData({
        recipient_identifier: "",
        recipient_name: "",
        amount: "",
        category: "other",
        purpose: "",
        transaction_date: new Date().toISOString().split("T")[0],
      })
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
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-b border-gray-700">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Add Transaction</h2>
          </div>

          {/* Type Selection */}
          <div className="p-6 border-b border-gray-200">
            <Label className="text-gray-700 font-semibold mb-3 block">Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("debit")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === "debit" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <ArrowUpRight className={`w-6 h-6 mb-2 ${type === "debit" ? "text-orange-600" : "text-gray-400"}`} />
                <p className="font-semibold text-gray-900">Send</p>
                <p className="text-xs text-gray-500">Money Out</p>
              </button>
              <button
                onClick={() => setType("credit")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === "credit" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                }`}
              >
                <ArrowDownLeft className={`w-6 h-6 mb-2 ${type === "credit" ? "text-green-600" : "text-gray-400"}`} />
                <p className="font-semibold text-gray-900">Receive</p>
                <p className="text-xs text-gray-500">Money In</p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Recipient Number</Label>
              <Input
                placeholder="e.g., 254712345678"
                value={formData.recipient_identifier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recipient_identifier: e.target.value,
                  })
                }
                className="h-12"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Recipient Name</Label>
              <Input
                placeholder="e.g., Jane Mwangi"
                value={formData.recipient_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recipient_name: e.target.value,
                  })
                }
                className="h-12"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Amount (KES)</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    category: v as TransactionCategory,
                  })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Purpose (Optional)</Label>
              <Input
                placeholder="e.g., Rent Payment"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="h-12"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Date</Label>
              <Input
                type="date"
                value={formData.transaction_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transaction_date: e.target.value,
                  })
                }
                className="h-12"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-6 bg-gray-50 border-t border-gray-200">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl"
            >
              {saving ? "Saving..." : "Add Transaction"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
