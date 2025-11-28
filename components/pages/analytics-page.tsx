"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/lib/types"

const COLORS = ["#0D9488", "#EA580C", "#8B5CF6", "#EC4899", "#F59E0B"]

export default function AnalyticsPage() {
  const { data: transactions = [] } = useSWR<Transaction[]>("/api/transactions", async (url: string) =>
    fetch(url).then((r) => r.json()),
  )

  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {}

    transactions.forEach((tx) => {
      if (tx.type === "debit" || tx.type === "expense") {
        grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount
      }
    })

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [transactions])

  const monthlyData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {}

    transactions.forEach((tx) => {
      const date = new Date(tx.transaction_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!months[monthKey]) {
        months[monthKey] = { income: 0, expense: 0 }
      }

      if (tx.type === "debit" || tx.type === "expense") {
        months[monthKey].expense += tx.amount
      } else if (tx.type === "credit" || tx.type === "income") {
        months[monthKey].income += tx.amount
      }
    })

    return Object.entries(months)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .slice(-6)
  }, [transactions])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Logout Button */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white rounded-b-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-white/80 text-sm mt-1">Visualize your spending patterns</p>
        </div>
        <button
          className="bg-white text-purple-600 font-semibold px-4 py-2 rounded shadow hover:bg-purple-100 transition"
          onClick={() => window.location.href = "/login"}
        >
          Logout
        </button>
      </div>

      {/* Charts */}
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Monthly Trend */}
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <h3 className="font-bold text-gray-900 mb-4">Monthly Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" stackId="a" fill="#0D9488" />
                  <Bar dataKey="expense" stackId="a" fill="#EA580C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <h3 className="font-bold text-gray-900 mb-4">Spending by Category</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">KES {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Income Breakdown */}
        {transactions.some(tx => tx.type === "income") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <h3 className="font-bold text-gray-900 mb-4">Income Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(
                      transactions
                        .filter(tx => tx.type === "income")
                        .reduce((acc, tx) => {
                          acc[tx.category] = (acc[tx.category] || 0) + tx.amount
                          return acc
                        }, {} as Record<string, number>)
                    ).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {Object.keys(
                      transactions
                        .filter(tx => tx.type === "income")
                        .reduce((acc, tx) => {
                          acc[tx.category] = (acc[tx.category] || 0) + tx.amount
                          return acc
                        }, {} as Record<string, number>)
                    ).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {Object.entries(
                transactions
                  .filter(tx => tx.type === "income")
                  .reduce((acc, tx) => {
                    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
                    return acc
                  }, {} as Record<string, number>)
              ).map(([name, value], i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-gray-600">{name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">KES {value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
