// API routes for recipient management

import type { Recipient } from "@/lib/types"

// TODO: Replace with real data source (e.g., database)
const recipients: Recipient[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get("sort") || "-total_transactions"
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  const result = [...recipients]

  if (sort === "-total_transactions") {
    result.sort((a, b) => b.total_transactions - a.total_transactions)
  }

  return Response.json(result.slice(0, limit))
}

export async function POST(request: Request) {
  const data: Recipient = await request.json()

  const newRecipient: Recipient = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  recipients.push(newRecipient)
  return Response.json(newRecipient, { status: 201 })
}
