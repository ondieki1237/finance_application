"use client"
import { motion } from "framer-motion"
import { Scan, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold">Smart Scan</h1>
        <p className="text-white/80 text-sm mt-1">Scan SMS or upload screenshots to track transactions</p>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-dashed border-orange-200 p-8 text-center"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Scan SMS or Upload</h2>
          <p className="text-gray-500 mb-6">Coming soon: Camera scanning for M-Pesa and bank SMS messages</p>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Screenshot
          </Button>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-blue-900 text-sm">Coming Soon</p>
                <p className="text-blue-700 text-xs mt-1">
                  This feature will automatically extract transaction data from SMS messages and screenshots
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
