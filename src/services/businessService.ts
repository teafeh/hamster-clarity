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
  slug: string | null
}

export const businessService = {
  async getBusinessByUserId(userId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, user_id, name, business_type, operating_hours, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) // Sort newest first
      .limit(1)

    if (error) {
      console.error('[businessService] PostgREST query failure:', error)
      throw error
    }

    return data && data.length > 0 ? (data[0] as Business) : null
  },
}