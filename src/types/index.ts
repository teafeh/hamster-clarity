/**
 * types/index.ts
 *
 * App-level type aliases and helpers.
 * Import these in components — not the raw Database type.
 *
 * Pattern:
 *   type Business = Tables<'businesses'>      // SELECT row shape
 *   type NewService = TablesInsert<'services'> // INSERT payload shape
 *   type UpdateCustomer = TablesUpdate<'customers'> // UPDATE payload shape
 */

import type { Database } from '@/lib/database.types'

// ── Generic helpers ───────────────────────────────────────────────────────────

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']

// ── Table row types ───────────────────────────────────────────────────────────
// Use these in components instead of re-typing field shapes by hand.

export type Business      = Tables<'businesses'>
export type UserProfile   = Tables<'profiles'>
export type Service       = Tables<'services'>
// export type Customer      = Tables<'customers'>
// export type Appointment   = Tables<'appointments'>
// export type HealthScore   = Tables<'health_scores'>

// ── View row types ────────────────────────────────────────────────────────────

// export type AppointmentDetail = Views<'appointment_details_view'>
// export type AtRiskCustomer    = Views<'at_risk_customers_view'>
// export type DailyRevenue      = Views<'daily_revenue_view'>

// ── Enum types ────────────────────────────────────────────────────────────────

// export type {
//   BusinessType,
//   UserRole,
//   AppointmentStatus,
//   HealthPeriodType,
//   OperatingHours,
//   DayHours,
//   HealthFlag,
// } from '@/lib/database.types'

// ── RPC return types ──────────────────────────────────────────────────────────

export interface CreateBusinessResult {
  business_id: string
  user_id:     string
}

// ── UI utility types ──────────────────────────────────────────────────────────

// Supabase error shape for consistent error handling across the app
export interface AppError {
  message: string
  code?:   string
}

// Generic async state — use in hooks that fetch data
export interface AsyncState<T> {
  data:    T | null
  loading: boolean
  error:   AppError | null
}
