// API routes for transaction management

import type { Transaction, Recipient } from "@/lib/types"

// TODO: Replace with real data source (e.g., database)
const transactions: Transaction[] = []
const recipients: Recipient[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "100")
  const sort = searchParams.get("sort") || "-transaction_date"

  const result = [...transactions]

  if (sort === "-transaction_date") {
    result.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
  }

  return Response.json(result.slice(0, limit))
}

export async function POST(request: Request) {
  const data: Transaction = await request.json()

  const newTransaction: Transaction = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  transactions.push(newTransaction)

  // Update recipient data
  if (data.recipient_identifier !== "CASH") {
    const existingRecipient = recipients.find((r) => r.identifier === data.recipient_identifier)

    if (existingRecipient) {
      existingRecipient.total_transactions = (existingRecipient.total_transactions || 0) + 1
      existingRecipient.last_transaction_date = data.transaction_date

      if (data.type === "debit") {
        existingRecipient.total_amount_sent = (existingRecipient.total_amount_sent || 0) + data.amount
      } else {
        existingRecipient.total_amount_received = (existingRecipient.total_amount_received || 0) + data.amount
      }
      existingRecipient.updated_at = new Date().toISOString()
    } else {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        identifier: data.recipient_identifier,
        name: data.recipient_name,
        contact_name: data.recipient_name,
        type: "phone",
        total_transactions: 1,
        total_amount_sent: data.type === "debit" ? data.amount : 0,
        total_amount_received: data.type === "credit" ? data.amount : 0,
        last_transaction_date: data.transaction_date,
        purposes: data.purpose ? [{ purpose: data.purpose, confidence: 1, total_count: 1 }] : [],
        default_purpose: data.purpose || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      recipients.push(newRecipient)
    }
  }

  return Response.json(newTransaction, { status: 201 })
}
