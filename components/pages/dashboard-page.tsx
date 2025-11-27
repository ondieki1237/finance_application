"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, TrendingUp, TrendingDown, Plus, ChevronRight, Scan, Bell, Banknote } from "lucide-react"
import Link from "next/link"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { Button } from "@/components/ui/button"
import TransactionItem from "@/components/transactions/transaction-item"
import AlertCard from "@/components/alerts/alert-card"
import FrequentRecipientPrompt from "@/components/recipients/frequent-recipient-prompt"
import PurposeTagModal from "@/components/recipients/purpose-tag-modal"
import AddTransactionModal from "@/components/modals/add-transaction-modal"
import CashTransactionModal from "@/components/modals/cash-transaction-modal"
import type { Transaction, Recipient, Alert, Subscription } from "@/lib/types"
import { api } from "@/lib/api-client"

const LOGO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692847a65ee9f54f23c65416/af2217181_smo-logo.png"

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCashModal, setShowCashModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([])

  const { data: transactions = [] } = useSWR<Transaction[]>("/api/transactions", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const { data: recipients = [] } = useSWR<Recipient[]>("/api/recipients", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const { data: alerts = [] } = useSWR<Alert[]>("/api/alerts", async (url) => fetch(url).then((r) => r.json()))

  const { data: subscriptions = [] } = useSWR<Subscription[]>("/api/subscriptions", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const monthlyTx = transactions.filter((t) => {
      const date = new Date(t.transaction_date)
      return date >= monthStart && date <= monthEnd
    })

    const income = monthlyTx.filter((t) => t.type === "credit").reduce((sum, t) => sum + (t.amount || 0), 0)
    const expense = monthlyTx.filter((t) => t.type === "debit").reduce((sum, t) => sum + (t.amount || 0), 0)

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    }
  }, [transactions])

  const handleCreateTransaction = async (data: Transaction) => {
    try {
      await api.transactions.create(data)
    } catch (err) {
      console.error("Failed to create transaction:", err)
    }
  }

  const recentTransactions = transactions.slice(0, 5)
  const unreadAlerts = alerts.filter((a) => !a.is_read).length
  const activeAlerts = alerts.filter((a) => !a.is_dismissed).slice(0, 2)

  const frequentUntagged = recipients.find(
    (r) => (r.total_transactions || 0) >= 3 && !r.default_purpose && !dismissedPrompts.includes(r.id || ""),
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Balance Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-4 pb-32 rounded-b-[32px]">
        {/* Logo Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_URL || "/placeholder.svg"}
              alt="SMO"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1"
            />
            <div>
              <h1 className="text-lg font-bold text-white">S.M.O</h1>
              <p className="text-gray-400 text-xs">{format(new Date(), "EEEE, MMM d")}</p>
            </div>
          </div>
          <Link href="/alerts" className="relative">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unreadAlerts > 9 ? "9+" : unreadAlerts}
              </span>
            )}
          </Link>
        </div>

        {/* Balance Card */}
        <div className="px-5 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 shadow-xl shadow-teal-500/20"
          >
            <p className="text-teal-100 text-sm">This Month's Balance</p>
            <p className="text-4xl font-bold text-white mt-2">KES {stats.balance.toLocaleString()}</p>

            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-teal-100 text-xs">Income</p>
                  <p className="text-white font-semibold">+{stats.totalIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-teal-100 text-xs">Expenses</p>
                  <p className="text-white font-semibold">-{stats.totalExpense.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-16">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <Button
            onClick={() => setShowAddModal(true)}
            className="h-14 bg-white text-gray-900 hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 font-semibold flex-col py-2"
          >
            <Plus className="w-5 h-5 text-teal-600" />
            <span className="text-xs">Transfer</span>
          </Button>
          <Button
            onClick={() => setShowCashModal(true)}
            className="h-14 bg-white text-gray-900 hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 font-semibold flex-col py-2"
          >
            <Banknote className="w-5 h-5 text-green-600" />
            <span className="text-xs">Cash</span>
          </Button>
          <Link href="/scan" className="w-full">
            <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl font-semibold flex-col py-2">
              <Scan className="w-5 h-5" />
              <span className="text-xs">Scan</span>
            </Button>
          </Link>
        </motion.div>

        {/* Alerts Section */}
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-500" />
                Alerts
              </h2>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-teal-600 h-8">
                  See All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {activeAlerts.map((alert, i) => (
                <AlertCard key={alert.id} alert={alert} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Frequent Recipient Prompt */}
        <AnimatePresence>
          {frequentUntagged && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <FrequentRecipientPrompt
                recipient={frequentUntagged}
                onTag={() => {
                  setSelectedRecipient(frequentUntagged)
                  setShowTagModal(true)
                }}
                onDismiss={() => setDismissedPrompts([...dismissedPrompts, frequentUntagged.id || ""])}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Transactions</h2>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-teal-600 h-8">
                See All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
                <Button onClick={() => setShowAddModal(true)} className="mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" /> Add First Transaction
                </Button>
              </div>
            ) : (
              recentTransactions.map((tx, i) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  index={i}
                  onTagClick={(t) => {
                    const recipient = recipients.find((r) => r.identifier === t.recipient_identifier)
                    if (recipient) {
                      setSelectedRecipient(recipient)
                      setShowTagModal(true)
                    }
                  }}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreateTransaction}
      />

      <CashTransactionModal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        onSave={handleCreateTransaction}
      />

      <PurposeTagModal
        isOpen={showTagModal}
        onClose={() => {
          setShowTagModal(false)
          setSelectedRecipient(null)
        }}
        recipient={selectedRecipient}
        onSave={async () => {
          setShowTagModal(false)
        }}
      />
    </div>
  )
}
