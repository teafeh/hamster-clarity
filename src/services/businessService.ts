import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { businessInitializationService } from './businessInitialization/businessInitializationService'
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
  tour_completed?: boolean | null
}

export const businessService = {
  async getBusinessByUserId(
    userId: string
  ): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select(
        'id, user_id, name, business_type, operating_hours, created_at, updated_at, slug, tour_completed'
      )
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error(
        '[businessService] PostgREST query failure:',
        error
      )
      throw error
    }

    return data as Business | null
  },

  async getBusinessesByUserId(
    userId: string
  ): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select(
        `
        id,
        user_id,
        name,
        business_type,
        operating_hours,
        created_at,
        updated_at,
        slug,
        tour_completed
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(
        '[businessService] PostgREST query failure:',
        error
      )
      throw error
    }

    return (data ?? []) as Business[]
  },


  async createBusiness(
  user: User,
  payload: {
    name: string
    businessType: string
  }
): Promise<Business> {
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      user_id: user.id,
      name: payload.name,
      business_type: payload.businessType,
    })
    .select()
    .single()

  if (error) throw error

  const business = data as Business

  await businessInitializationService.initializeBusiness({
    business,
    user,
  })

  return business
},
  
}