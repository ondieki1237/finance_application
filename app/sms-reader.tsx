import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"
// You need to install a plugin like @capacitor-community/sms for real SMS access
// import { SMS } from '@capacitor-community/sms'

export default function SMSReader({ onMessages }: { onMessages: (messages: any[]) => void }) {
  useEffect(() => {
    async function fetchSMS() {
      if (Capacitor.isNativePlatform()) {
        // Request permission (pseudo-code, replace with actual plugin usage)
        // const permission = await SMS.requestPermission()
        // if (permission.granted) {
        //   const messages = await SMS.list({ max: 100 })
        //   onMessages(messages)
        // }
      } else {
        // Not on mobile, cannot read SMS
        onMessages([])
      }
    }
    fetchSMS()
  }, [onMessages])

  return null
}
