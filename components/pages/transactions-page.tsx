"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import TransactionItem from "@/components/transactions/transaction-item"
import AddTransactionModal from "@/components/modals/add-transaction-modal"
import type { Transaction, Recipient } from "@/lib/types"
import { api } from "@/lib/api-client"

export default function TransactionsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "30",
    search: "",
  })

  const { data: transactions = [] } = useSWR<Transaction[]>("/api/transactions", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const { data: recipients = [] } = useSWR<Recipient[]>("/api/recipients", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (filters.type !== "all") {
      result = result.filter((tx) => tx.type === filters.type)
    }

    const days = Number.parseInt(filters.dateRange)
    const startDate = startOfDay(subDays(new Date(), days))
    result = result.filter((tx) =>
      isWithinInterval(new Date(tx.transaction_date), {
        start: startDate,
        end: endOfDay(new Date()),
      }),
    )

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.recipient_name?.toLowerCase().includes(search) ||
          tx.recipient_identifier.includes(search) ||
          tx.purpose?.toLowerCase().includes(search),
      )
    }

    return result
  }, [transactions, filters])

  const stats = useMemo(() => {
    const debits = filteredTransactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

    const credits = filteredTransactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)

    return { debits, credits }
  }, [filteredTransactions])

  const handleCreateTransaction = async (data: Transaction) => {
    try {
      await api.transactions.create(data)
    } catch (err) {
      console.error("Failed to create transaction:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, or purpose..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500">Sent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">KES {stats.debits.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500">Received</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">KES {stats.credits.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="debit">Sent</TabsTrigger>
            <TabsTrigger value="credit">Received</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={filters.dateRange} onValueChange={(v) => setFilters({ ...filters, dateRange: v })}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="7">7 days</TabsTrigger>
            <TabsTrigger value="30">30 days</TabsTrigger>
            <TabsTrigger value="90">90 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Transactions List */}
      <div className="px-5 space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx, i) => <TransactionItem key={tx.id} transaction={tx} index={i} />)
        )}
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
    </div>
  )
}
