"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Check, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Recipient } from "@/lib/types"

const defaultPurposes = [
  { id: "family_support", label: "Family Support", icon: "👨‍👩‍👧‍👦" },
  { id: "business_expense", label: "Business Expense", icon: "💼" },
  { id: "school_fees", label: "School Fees", icon: "🎓" },
  { id: "loan_repayment", label: "Loan Repayment", icon: "💳" },
  { id: "investment", label: "Investment", icon: "📈" },
  { id: "personal", label: "Personal", icon: "🛍️" },
  { id: "utility", label: "Utility Bills", icon: "💡" },
  { id: "savings", label: "Savings", icon: "🏦" },
]

interface PurposeTagModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: Recipient | null
  onSave: (purpose: string) => Promise<void>
}

export default function PurposeTagModal({ isOpen, onClose, recipient, onSave }: PurposeTagModalProps) {
  const [selectedPurpose, setSelectedPurpose] = useState(recipient?.default_purpose || "")
  const [customPurpose, setCustomPurpose] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const purpose = showCustomInput ? customPurpose : selectedPurpose
    await onSave(purpose)
    setSaving(false)
    onClose()
  }

  if (!isOpen || !recipient) return null

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
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{recipient.name || "Unknown"}</h2>
                <p className="text-white/80 text-sm">{recipient.identifier}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs">Transactions</p>
                <p className="text-xl font-bold">{recipient.total_transactions || 0}</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs">Total Sent</p>
                <p className="text-xl font-bold">KES {(recipient.total_amount_sent || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">What is this payment for?</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {defaultPurposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => {
                    setSelectedPurpose(purpose.id)
                    setShowCustomInput(false)
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPurpose === purpose.id && !showCustomInput
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-100 hover:border-teal-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{purpose.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{purpose.label}</span>
                  {selectedPurpose === purpose.id && !showCustomInput && (
                    <Check className="w-4 h-4 text-teal-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCustomInput(true)}
              className={`w-full mt-3 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
                showCustomInput ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <Plus className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Create Custom Purpose</span>
            </button>

            {showCustomInput && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <Input
                  placeholder="e.g., Rent Payment, Supplier - John"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <Button
              onClick={handleSave}
              disabled={(!selectedPurpose && !customPurpose) || saving}
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl"
            >
              {saving ? "Saving..." : "Save Purpose"}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">Future transactions will be auto-tagged</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
