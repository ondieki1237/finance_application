"use client"
import { motion } from "framer-motion"
import { Bell, AlertCircle, TrendingUp, Target } from "lucide-react"
import type { Alert } from "@/lib/types"

interface AlertCardProps {
  alert: Alert
  index?: number
}

export default function AlertCard({ alert, index = 0 }: AlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "anomaly":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "income":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "subscription":
        return <Target className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-orange-600" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">{getAlertIcon(alert.alert_type)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        </div>
      </div>
    </motion.div>
  )
}
