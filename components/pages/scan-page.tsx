import { useState } from "react"
import { motion } from "framer-motion"
import { Scan, Upload, AlertCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import SMSReader from "@/app/sms-reader"

export default function ScanPage() {
  const [messages, setMessages] = useState<any[]>([])

  const handleMessages = (msgs: any[]) => {
    console.log("Received messages in ScanPage:", msgs.length)
    setMessages(msgs)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white rounded-b-3xl">
        <h1 className="text-2xl font-bold">Smart Scan</h1>
        <p className="text-white/80 text-sm mt-1">Scan SMS or upload screenshots to track transactions</p>
      </div>

      <SMSReader onMessages={handleMessages} />

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
          <p className="text-gray-500 mb-6">
            {messages.length > 0
              ? `Found ${messages.length} financial transactions`
              : "Scanning for M-Pesa and bank SMS messages..."}
          </p>

          {messages.length > 0 && (
            <div className="mb-6 text-left space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                  <p className="text-xs text-green-600 font-medium">Total Received</p>
                  <p className="text-lg font-bold text-green-700">
                    KES {messages
                      .filter(m => m.type === "received")
                      .reduce((acc, m) => acc + m.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <p className="text-xs text-red-600 font-medium">Total Sent</p>
                  <p className="text-lg font-bold text-red-700">
                    KES {messages
                      .filter(m => m.type === "sent")
                      .reduce((acc, m) => acc + m.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Recent Transactions
                </h3>
                <div className="space-y-2">
                  {messages.slice(0, 10).map((msg, i) => (
                    <div key={i} className="text-xs p-2 bg-white rounded border border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-700">{msg.party}</div>
                        <div className="text-gray-500">{msg.date}</div>
                      </div>
                      <div className={`font-bold ${msg.type === "received" ? "text-green-600" : "text-red-600"}`}>
                        {msg.type === "received" ? "+" : "-"} {msg.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button className="bg-orange-500 hover:bg-orange-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Screenshot
          </Button>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-blue-900 text-sm">Automatic Scanning</p>
                <p className="text-blue-700 text-xs mt-1">
                  We are aggressively scanning your SMS inbox for transaction messages.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
