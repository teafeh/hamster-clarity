import { supabase } from '@/lib/supabase'
import type { OperatingHours } from '@/services/onboardingService'

export interface Business {
  id: string
  user_id: string
  name: string
  business_type: string
  operating_hours: OperatingHours | null
  created_at: string
  updated_at: string
}

export const businessService = {
  async getBusinessByUserId(userId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // PGRST116 = no rows found — not an error for our purposes
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as Business
  },
}