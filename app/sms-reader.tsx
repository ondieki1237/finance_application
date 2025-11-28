import { useEffect, forwardRef, useImperativeHandle } from "react"
import { filterFinancialMessages } from "@/lib/sms-parser"

export interface SMSReaderHandle {
  scan: () => void
}

const SMSReader = forwardRef<SMSReaderHandle, { onMessages: (messages: any[]) => void }>(({ onMessages }, ref) => {
  const fetchSMS = async () => {
    try {
      alert("🔍 Checking for SMS plugin...")

      // Check if the Cordova SMS plugin is available
      if (typeof (window as any).SMS === 'undefined') {
        alert("❌ SMS plugin not loaded!")
        onMessages([])
        return
      }

      const sms = (window as any).SMS
      const permissions = (window as any).cordova?.plugins?.permissions

      // Debug: Show what methods are available
      const methods = Object.keys(sms).join(", ")
      alert(`✅ SMS plugin found!\n\nAvailable methods: ${methods}`)

      // Check if we have the Android permissions plugin
      if (!permissions) {
        alert("⚠️ Android permissions plugin not found. Trying to read SMS anyway...")
        readSMS(sms, onMessages)
        return
      }

      // Define the permission we need
      const READ_SMS = permissions.READ_SMS

      // Check if we have READ_SMS permission
      permissions.checkPermission(
        READ_SMS,
        (status: any) => {
          if (status.hasPermission) {
            alert("✅ Already have READ_SMS permission! Reading SMS...")
            readSMS(sms, onMessages)
          } else {
            alert("🔐 Need READ_SMS permission. Requesting...")
            // Request the permission
            permissions.requestPermission(
              READ_SMS,
              (status: any) => {
                if (status.hasPermission) {
                  alert("✅ Permission granted!")
                  readSMS(sms, onMessages)
                } else {
                  alert("🚫 Permission denied by user")
                  onMessages([])
                }
              },
              (err: any) => {
                alert("❌ Error requesting permission: " + JSON.stringify(err))
                onMessages([])
              }
            )
          }
        },
        (err: any) => {
          alert("❌ Error checking permission: " + JSON.stringify(err))
          onMessages([])
        }
      )
    } catch (err: any) {
      alert("❌ Unexpected error: " + (err.message || JSON.stringify(err)))
      onMessages([])
    }
  }

  const readSMS = (sms: any, onMessages: (messages: any[]) => void) => {
    try {
      if (typeof sms.listSMS === 'function') {
        sms.listSMS(
          {},
          (messages: any[]) => {
            alert(`📱 Found ${messages.length} total SMS`)
            const parsed = filterFinancialMessages(messages)
            alert(`💰 Found ${parsed.length} financial transactions`)
            onMessages(parsed)
          },
          (err: any) => {
            alert("❌ Error reading SMS: " + JSON.stringify(err))
            onMessages([])
          }
        )
      } else {
        alert("❌ listSMS method not found on SMS object!")
        onMessages([])
      }
    } catch (err: any) {
      alert("❌ Error in readSMS: " + (err.message || JSON.stringify(err)))
      onMessages([])
    }
  }

  useImperativeHandle(ref, () => ({
    scan: fetchSMS
  }))

  useEffect(() => {
    // Don't auto-scan
  }, [])

  return null
})

SMSReader.displayName = "SMSReader"

export default SMSReader
