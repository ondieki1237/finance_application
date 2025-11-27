"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Bell } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AlertCard from "@/components/alerts/alert-card"
import type { Alert } from "@/lib/types"

export default function AlertsPage() {
  const [filter, setFilter] = useState("all")

  const { data: alerts = [] } = useSWR<Alert[]>("/api/alerts", async (url) => fetch(url).then((r) => r.json()))

  const filteredAlerts = useMemo(() => {
    if (filter === "unread") return alerts.filter((a) => !a.is_read)
    if (filter === "active") return alerts.filter((a) => !a.is_dismissed)
    return alerts
  }, [alerts, filter])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-4">Alerts</h1>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Alerts List */}
      <div className="px-5 py-6 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No alerts</p>
          </div>
        ) : (
          filteredAlerts.map((alert, i) => <AlertCard key={alert.id} alert={alert} index={i} />)
        )}
      </div>
    </div>
  )
}
