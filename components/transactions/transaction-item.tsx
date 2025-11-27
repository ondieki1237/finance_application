"use client"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Tag } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/types"

const categoryColors: Record<string, string> = {
  family_support: "bg-purple-100 text-purple-700",
  business_expense: "bg-blue-100 text-blue-700",
  school_fees: "bg-amber-100 text-amber-700",
  loan_repayment: "bg-red-100 text-red-700",
  investment: "bg-green-100 text-green-700",
  personal: "bg-pink-100 text-pink-700",
  income: "bg-emerald-100 text-emerald-700",
  savings: "bg-teal-100 text-teal-700",
  utility: "bg-gray-100 text-gray-700",
  other: "bg-slate-100 text-slate-700",
}

interface TransactionItemProps {
  transaction: Transaction
  onTagClick?: (tx: Transaction) => void
  index?: number
}

export default function TransactionItem({ transaction, onTagClick, index = 0 }: TransactionItemProps) {
  const isCredit = transaction.type === "credit"

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onTagClick?.(transaction)}
    >
      <div className={`p-3 rounded-xl ${isCredit ? "bg-emerald-50" : "bg-orange-50"}`}>
        {isCredit ? (
          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-orange-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 truncate">
            {transaction.recipient_name || transaction.recipient_identifier}
          </p>
          {transaction.category && (
            <Badge className={`${categoryColors[transaction.category]} border-0 text-xs`}>
              {transaction.category.replace(/_/g, " ")}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-500">{transaction.recipient_identifier}</p>
          {transaction.purpose && (
            <span className="flex items-center gap-1 text-xs text-teal-600">
              <Tag className="w-3 h-3" />
              {transaction.purpose}
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${isCredit ? "text-emerald-600" : "text-gray-900"}`}>
          {isCredit ? "+" : "-"} KES {transaction.amount?.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {transaction.transaction_date && format(new Date(transaction.transaction_date), "MMM d, h:mm a")}
        </p>
      </div>
    </motion.div>
  )
}
