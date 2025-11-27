"use client"

import type React from "react"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  trend?: string
  trendUp?: boolean
  variant?: "default" | "teal" | "orange" | "dark"
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  variant = "default",
}: StatsCardProps) {
  const variants = {
    default: "bg-white border border-gray-100",
    teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
  }

  const isColored = variant !== "default"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 ${variants[variant]} shadow-sm hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className={`text-sm font-medium ${isColored ? "text-white/80" : "text-gray-500"}`}>{title}</p>
          <p className={`text-3xl font-bold tracking-tight ${isColored ? "text-white" : "text-gray-900"}`}>{value}</p>
          {subtitle && <p className={`text-sm ${isColored ? "text-white/70" : "text-gray-400"}`}>{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trendUp
                  ? isColored
                    ? "text-green-200"
                    : "text-green-600"
                  : isColored
                    ? "text-red-200"
                    : "text-red-500"
              }`}
            >
              <span>{trendUp ? "↑" : "↓"}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${isColored ? "bg-white/20" : "bg-teal-50"}`}>
            <Icon className={`w-6 h-6 ${isColored ? "text-white" : "text-teal-600"}`} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
