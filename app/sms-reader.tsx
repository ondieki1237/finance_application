import { useEffect } from "react"
import { filterFinancialMessages } from "@/lib/sms-parser"

export default function SMSReader({ onMessages }: { onMessages: (messages: any[]) => void }) {
  useEffect(() => {
    const fetchSMS = async () => {
      if ((window as any).SMS) {
        const sms = (window as any).SMS

        sms.requestPermission(
          () => {
            // Permission granted
            const filter = {
              box: "inbox",
              maxCount: 200, // Increased fetch limit
            }

            sms.listSMS(
              filter,
              (messages: any[]) => {
                console.log("SMS fetched raw:", messages.length)
                const parsedMessages = filterFinancialMessages(messages)
                console.log("SMS parsed:", parsedMessages.length)
                onMessages(parsedMessages)
              },
              (err: any) => {
                console.error("Error listing SMS:", err)
              }
            )
          },
          (err: any) => {
            console.error("SMS permission denied:", err)
          }
        )
      } else {
        console.log("SMS plugin not available")
      }
    }

    fetchSMS()
  }, [onMessages])

  return null
}
