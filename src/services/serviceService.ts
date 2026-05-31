import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Service {
  id:               string
  business_id:      string
  user_id:          string
  name:             string
  price:            number
  duration_minutes: number | null
  is_active:        boolean
  created_at:       string
}

export interface ServicePayload {
  name:             string
  price:            number
  duration_minutes: number | null
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const serviceService = {

  /**
   * Fetch all active services for a given business.
   * Ordered oldest-first so the list order is stable across sessions.
   */
  async getServicesByBusiness(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('id, business_id, user_id, name, price, duration_minutes, is_active, created_at')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data ?? []
  },

  /**
   * Create a new service and return the persisted row.
   * Returning the row avoids a second round-trip to refresh the list.
   */
  async createService(
    businessId: string,
    userId:     string,
    payload:    ServicePayload
  ): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        business_id:      businessId,
        user_id:          userId,
        name:             payload.name.trim(),
        price:            payload.price,
        duration_minutes: payload.duration_minutes ?? null,
      })
      .select('id, business_id, user_id, name, price, duration_minutes, is_active, created_at')
      .single()

    if (error) throw error
    if (!data)  throw new Error('Service was not created. No data returned.')

    return data
  },

  /**
   * Update the user-editable fields of an existing service.
   * Returns the updated row so the hook can patch local state in place.
   */
  async updateService(
    serviceId: string,
    payload:   ServicePayload
  ): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({
        name:             payload.name.trim(),
        price:            payload.price,
        duration_minutes: payload.duration_minutes ?? null,
      })
      .eq('id', serviceId)
      .select('id, business_id, user_id, name, price, duration_minutes, is_active, created_at')
      .single()

    if (error) throw error
    if (!data)  throw new Error('Service was not updated. No data returned.')

    return data
  },

  /**
   * Soft-delete a service by setting is_active = false.
   * The row is retained in the database for future appointment history.
   * The service will no longer appear in getServicesByBusiness results.
   */
  async deleteService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', serviceId)

    if (error) throw error
  },
}