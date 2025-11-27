// API routes for subscription management

import type { Subscription } from "@/lib/types"

// TODO: Replace with real data source (e.g., database)
const subscriptions: Subscription[] = []

export async function GET() {
  return Response.json(subscriptions)
}

export async function POST(request: Request) {
  const data: Subscription = await request.json()

  const newSubscription: Subscription = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  subscriptions.push(newSubscription)
  return Response.json(newSubscription, { status: 201 })
}
