// API routes for alert management

import type { Alert } from "@/lib/types"

// TODO: Replace with real data source (e.g., database)
const alerts: Alert[] = []

export async function GET() {
  return Response.json(alerts)
}

export async function POST(request: Request) {
  const data: Alert = await request.json()

  const newAlert: Alert = {
    ...data,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  alerts.push(newAlert)
  return Response.json(newAlert, { status: 201 })
}
