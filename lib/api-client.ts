// API client for frontend requests

import type { Transaction, Recipient, Subscription, Alert } from "./types"

const API_BASE = "/api"

export const api = {
  transactions: {
    list: async (limit = 100) => {
      const res = await fetch(`${API_BASE}/transactions?limit=${limit}`)
      if (!res.ok) throw new Error("Failed to fetch transactions")
      return res.json()
    },
    create: async (data: Transaction) => {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create transaction")
      return res.json()
    },
  },
  recipients: {
    list: async (limit = 50) => {
      const res = await fetch(`${API_BASE}/recipients?limit=${limit}`)
      if (!res.ok) throw new Error("Failed to fetch recipients")
      return res.json()
    },
    create: async (data: Recipient) => {
      const res = await fetch(`${API_BASE}/recipients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create recipient")
      return res.json()
    },
  },
  subscriptions: {
    list: async () => {
      const res = await fetch(`${API_BASE}/subscriptions`)
      if (!res.ok) throw new Error("Failed to fetch subscriptions")
      return res.json()
    },
    create: async (data: Subscription) => {
      const res = await fetch(`${API_BASE}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create subscription")
      return res.json()
    },
  },
  alerts: {
    list: async () => {
      const res = await fetch(`${API_BASE}/alerts`)
      if (!res.ok) throw new Error("Failed to fetch alerts")
      return res.json()
    },
    create: async (data: Alert) => {
      const res = await fetch(`${API_BASE}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create alert")
      return res.json()
    },
  },
}
