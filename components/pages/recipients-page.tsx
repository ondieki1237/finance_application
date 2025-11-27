"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Search, PhoneIcon, Building2, Banknote, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Recipient } from "@/lib/types"

export default function RecipientsPage() {
  const [search, setSearch] = useState("")

  const { data: recipients = [] } = useSWR<Recipient[]>("/api/recipients", async (url) =>
    fetch(url).then((r) => r.json()),
  )

  const filteredRecipients = useMemo(() => {
    if (!search) return recipients

    const searchLower = search.toLowerCase()
    return recipients.filter((r) => r.name?.toLowerCase().includes(searchLower) || r.identifier.includes(searchLower))
  }, [recipients, search])

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case "phone":
        return PhoneIcon
      case "paybill":
        return Building2
      case "bank_account":
        return Banknote
      default:
        return Users
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "phone":
        return "Phone Number"
      case "paybill":
        return "Paybill"
      case "till":
        return "Till"
      case "bank_account":
        return "Bank Account"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-4">Recipients</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Recipients List */}
      <div className="px-5 py-6 space-y-3">
        {filteredRecipients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipients found</p>
          </div>
        ) : (
          filteredRecipients.map((recipient, i) => {
            const Icon = getRecipientIcon(recipient.type)
            const totalTransactions = recipient.total_transactions || 0
            const avgAmount =
              totalTransactions > 0
                ? Math.round((recipient.total_amount_sent + recipient.total_amount_received) / totalTransactions)
                : 0

            return (
              <motion.div
                key={recipient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 rounded-xl">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{recipient.name || "Unknown"}</h3>
                    <p className="text-sm text-gray-500 truncate mt-1">{recipient.identifier}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(recipient.type)}
                      </Badge>
                      {recipient.is_income_source && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Income Source
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{totalTransactions}</p>
                    <p className="text-xs text-gray-500 mt-1">transactions</p>
                    <p className="text-xs text-gray-500 mt-1">Avg: KES {avgAmount.toLocaleString()}</p>
                  </div>
                </div>

                {recipient.default_purpose && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Purpose</p>
                    <Badge className="mt-1 bg-teal-100 text-teal-700">{recipient.default_purpose}</Badge>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
