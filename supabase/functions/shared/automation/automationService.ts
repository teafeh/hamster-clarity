import { supabase } from '../lib/supabase.ts'
import type { Database } from '../types/database.types.ts'

export type AutomationSettings =
  Database['public']['Tables']['automation_settings']['Row']

export type AutomationSettingsUpdate =
  Database['public']['Tables']['automation_settings']['Update']

export const automationService = {
  async getSettingsByBusinessId(
    businessId: string
  ): Promise<AutomationSettings | null> {
    const { data, error } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()

    if (error) throw error

    return data
  },

  async createDefaultSettings(
    businessId: string
  ): Promise<AutomationSettings> {
    const { data, error } = await supabase
      .from('automation_settings')
      .insert({
        business_id: businessId,
      })
      .select()
      .single()

    if (error) throw error

    return data
  },
  

  async updateSettings(
  businessId: string,
  updates: AutomationSettingsUpdate
): Promise<void> {
    const { error } = await supabase
      .from('automation_settings')
      .update(updates)
      .eq('business_id', businessId)

    if (error) throw error
  },
}