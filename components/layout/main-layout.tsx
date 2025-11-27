"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowRightLeft, Users, BarChart3, Scan } from "lucide-react"

const LOGO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692847a65ee9f54f23c65416/af2217181_smo-logo.png"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  isSpecial?: boolean
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "Smart Scan", href: "/scan", icon: Scan, isSpecial: true },
  { name: "Recipients", href: "/recipients", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-lg mx-auto bg-gray-50 min-h-screen pb-24">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="bg-white border-t border-gray-100 px-2 pt-2 pb-2 flex items-end justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              if (item.isSpecial) {
                return (
                  <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-6">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                        active
                          ? "bg-gradient-to-br from-orange-500 to-orange-600"
                          : "bg-gradient-to-br from-teal-500 to-teal-600"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className={`text-xs mt-1 font-medium ${active ? "text-orange-600" : "text-gray-400"}`}>
                      {item.name}
                    </span>
                  </Link>
                )
              }

              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center py-1 px-3">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-xl transition-all ${active ? "bg-teal-50" : ""}`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-teal-600" : "text-gray-400"}`} />
                  </motion.div>
                  <span className={`text-xs font-medium ${active ? "text-teal-600" : "text-gray-400"}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
