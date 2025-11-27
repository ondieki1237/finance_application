"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Recipient } from "@/lib/types"

interface FrequentRecipientPromptProps {
  recipient: Recipient
  onTag: () => void
  onDismiss: () => void
}

export default function FrequentRecipientPrompt({ recipient, onTag, onDismiss }: FrequentRecipientPromptProps) {
  if (!recipient) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20"
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg">Frequent Recipient Detected</h3>
            <p className="text-white/90 text-sm mt-1">
              You've sent money to <span className="font-semibold">{recipient.name || recipient.identifier}</span>{" "}
              {recipient.total_transactions} times.
            </p>
            <p className="text-white/70 text-sm mt-1">Would you like to document what these payments are for?</p>

            <Button onClick={onTag} className="mt-4 bg-white text-orange-600 hover:bg-white/90 font-semibold">
              Tag Purpose
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-white/10 rounded-full" />
      </motion.div>
    </AnimatePresence>
  )
}
