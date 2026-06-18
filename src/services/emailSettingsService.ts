import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type EmailSettings =
  Database['public']['Tables']['email_settings']['Row']

export type EmailSettingsUpdate =
  Database['public']['Tables']['email_settings']['Update']

export const emailSettingsService = {
  async getSettingsByBusinessId(
    businessId: string
  ): Promise<EmailSettings | null> {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()

    if (error) throw error

    return data
  },

  async createDefaultSettings(
    businessId: string,
  senderName: string,
  replyToEmail: string
  ): Promise<EmailSettings> {
    const { data, error } = await supabase
      .from('email_settings')
      .insert({
  business_id: businessId,
  sender_name: senderName,
  reply_to_email: replyToEmail,
})
      .select()
      .single()

    if (error) throw error

    return data
  },

  async updateSettings(
    businessId: string,
    updates: EmailSettingsUpdate
  ): Promise<void> {
    const { error } = await supabase
      .from('email_settings')
      .update(updates)
      .eq('business_id', businessId)

    if (error) throw error
  },
}