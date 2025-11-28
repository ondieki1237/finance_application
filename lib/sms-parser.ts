export interface ParsedTransaction {
    originalMessage: string
    date: string
    amount: number
    type: "sent" | "received" | "unknown"
    party: string
}

export function parseMessage(body: string): ParsedTransaction | null {
    // Basic M-Pesa Regex Patterns
    // Sent: "Confirmed. [ID] on [Date] at [Time] [Amount] sent to [Recipient]..."
    // Received: "Confirmed. [ID] on [Date] at [Time] Received [Amount] from [Sender]..."

    const sentRegex = /Confirmed\..+?on\s(.+?)\sat\s(.+?)\s([A-Z0-9,]+)\ssent\sto\s(.+?)\./i
    const receivedRegex = /Confirmed\..+?on\s(.+?)\sat\s(.+?)\sReceived\s([A-Z0-9,]+)\sfrom\s(.+?)\./i

    // Check for Sent
    const sentMatch = body.match(sentRegex)
    if (sentMatch) {
        return {
            originalMessage: body,
            date: `${sentMatch[1]} ${sentMatch[2]}`,
            amount: parseFloat(sentMatch[3].replace(/,/g, "")),
            type: "sent",
            party: sentMatch[4]
        }
    }

    // Check for Received
    const receivedMatch = body.match(receivedRegex)
    if (receivedMatch) {
        return {
            originalMessage: body,
            date: `${receivedMatch[1]} ${receivedMatch[2]}`,
            amount: parseFloat(receivedMatch[3].replace(/,/g, "")),
            type: "received",
            party: receivedMatch[4]
        }
    }

    return null
}

export function filterFinancialMessages(messages: any[]): ParsedTransaction[] {
    return messages
        .filter(msg => {
            const body = msg.body || ""
            const address = msg.address || ""
            // Filter by sender (e.g., MPESA, Banks)
            return /MPESA|Equity|KCB|Co-op/i.test(address) || /Confirmed/i.test(body)
        })
        .map(msg => parseMessage(msg.body))
        .filter((parsed): parsed is ParsedTransaction => parsed !== null)
}
