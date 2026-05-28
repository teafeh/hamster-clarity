import { supabase } from '@/lib/supabase'

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
  async createBusiness(userId: string, payload: BusinessPayload): Promise<string> {
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        user_id:       userId,
        name:          payload.name.trim(),
        business_type: payload.business_type.trim(),
      })
      .select('id')
      .single()

    if (error) throw error
    if (!data) throw new Error('Business was not created. No data returned.')

    return data.id
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