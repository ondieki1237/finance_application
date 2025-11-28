// Core entity types for the financial management app

export interface Recipient {
  id?: string
  identifier: string
  name?: string
  contact_name?: string
  type: "phone" | "paybill" | "till" | "bank_account"
  purposes?: Purpose[]
  default_purpose?: string
  purpose_confidence?: number
  total_transactions: number
  total_amount_sent: number
  total_amount_received: number
  last_transaction_date?: string
  average_amount?: number
  is_income_source?: boolean
  income_frequency?: "weekly" | "bi_weekly" | "monthly" | "irregular"
  is_subscription?: boolean
  subscription_details?: SubscriptionDetails
  is_flagged?: boolean
  risk_score?: number
  known_service?: KnownService
  created_at?: string
  updated_at?: string
}

export interface Purpose {
  purpose: string
  confidence: number
  total_count: number
  seasonality?: number[]
}

export interface SubscriptionDetails {
  frequency: string
  typical_amount: number
  next_expected_date: string
  service_type: string
  can_cancel: boolean
}

export interface KnownService {
  name: string
  category: string
  logo_url?: string
}

export interface Transaction {
  id?: string
  recipient_identifier: string
  recipient_name: string
  amount: number
  type: "debit" | "credit" | "income" | "expense"
  transaction_date: string
  purpose?: string
  category: TransactionCategory
  reference_code?: string
  raw_message?: string
  source: "mpesa_sms" | "bank_sms" | "csv_import" | "manual"
  balance_after?: number
  is_recurring?: boolean
  is_anomaly?: boolean
  anomaly_reason?: string
  anomaly_score?: number
  created_at?: string
  updated_at?: string
}

export type TransactionCategory =
  | "family_support"
  | "business_expense"
  | "school_fees"
  | "loan_repayment"
  | "investment"
  | "personal"
  | "income"
  | "savings"
  | "utility"
  | "subscription"
  | "betting"
  | "transport"
  | "food"
  | "healthcare"
  | "rent"
  | "airtime"
  | "data_bundle"
  | "other"

export interface Subscription {
  id?: string
  recipient_identifier: string
  service_name: string
  service_type: SubscriptionType
  typical_amount: number
  frequency: "daily" | "weekly" | "bi_weekly" | "monthly" | "quarterly" | "yearly"
  next_expected_date: string
  last_payment_date?: string
  total_spent: number
  payment_count: number
  status: "active" | "paused" | "cancelled" | "detected"
  alternative_suggestion?: AlternativeSuggestion
  logo_url?: string
  created_at?: string
  updated_at?: string
}

export type SubscriptionType =
  | "streaming"
  | "internet"
  | "tv"
  | "betting"
  | "insurance"
  | "savings"
  | "loan"
  | "utility"
  | "bundle"
  | "gym"
  | "other"

export interface AlternativeSuggestion {
  provider: string
  savings: number
  description: string
}

export interface Alert {
  id?: string
  alert_type: AlertType
  title: string
  message: string
  severity: "info" | "warning" | "critical"
  related_transaction_id?: string
  related_recipient_id?: string
  action_type?: "tag" | "review" | "dismiss" | "report" | "save"
  action_data?: Record<string, any>
  is_read: boolean
  is_dismissed: boolean
  created_at?: string
  updated_at?: string
}

export type AlertType =
  | "anomaly"
  | "prediction"
  | "subscription"
  | "income"
  | "savings_tip"
  | "low_balance"
  | "recurring_due"
