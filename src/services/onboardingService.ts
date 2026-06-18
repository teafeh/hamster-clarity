import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { businessService } from './businessService'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BusinessPayload {
  name: string
  business_type: string
}

export interface DayHours {
  open: boolean
  start: string // "HH:MM" — empty string when open is false
  end: string   // "HH:MM" — empty string when open is false
}

export interface OperatingHours {
  monday:    DayHours
  tuesday:   DayHours
  wednesday: DayHours
  thursday:  DayHours
  friday:    DayHours
  saturday:  DayHours
  sunday:    DayHours
}

export interface ServicePayload {
  name: string
  price: number
  duration_minutes: number | null
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const onboardingService = {

  /**
   * Step 1 — Create the business record.
   * Returns the new business ID, which must be passed to subsequent steps.
   */
 async createBusiness(
  user: User,
  payload: {
    name: string
    businessType: string
  }
): Promise<string> {

  const existing =
    await businessService.getBusinessByUserId(
      user.id
    )

  if (existing) {
    return existing.id
  }

  const business =
    await businessService.createBusiness(
      user,
      payload
    )

  return business.id
},

  /**
   * Step 2 — Persist operating hours against an existing business row.
   */
  async updateOperatingHours(
    businessId: string,
    hours: OperatingHours
  ): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .update({ operating_hours: hours as any })
      .eq('id', businessId)

    if (error) throw error
  },

  /**
   * Step 3a — Create the first service linked to the business.
   * duration_minutes is optional; pass null to omit it.
   */
  async createInitialService(
    businessId: string,
    userId: string,
    payload: ServicePayload
  ): Promise<void> {
    const { error } = await supabase
      .from('services')
      .insert({
        business_id:      businessId,
        user_id:          userId,
        name:             payload.name.trim(),
        price:            payload.price,
        duration_minutes: payload.duration_minutes ?? null,
      })

    if (error) throw error
  },

  /**
   * Step 3b — Mark onboarding as complete.
   * Call this only after createInitialService succeeds.
   * ProtectedRoute reads this flag to gate the dashboard.
   */
  async completeOnboarding(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId)

    if (error) throw error
  },
}