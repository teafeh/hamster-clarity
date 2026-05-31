import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Customer {
  id:          string
  business_id: string
  user_id:     string
  first_name:  string
  last_name:   string | null
  phone:       string | null
  email:       string | null
  notes:       string | null
  is_archived: boolean
  created_at:  string
  updated_at:  string
}

export interface CustomerPayload {
  first_name: string
  last_name:  string | null
  phone:      string | null
  email:      string | null
  notes:      string | null
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const customerService = {

  /**
   * Fetch all non-archived customers for a given business.
   * Ordered alphabetically: last name first, then first name.
   * Customers with no last name sort to the end of the list.
   */
  async getCustomersByBusiness(businessId: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_archived', false)
      .order('last_name',  { ascending: true, nullsFirst: false })
      .order('first_name', { ascending: true })

    if (error) throw error

        return data ?? []
    },

  /**
   * Create a new customer and return the persisted row.
   * Returning the row avoids a second round-trip to refresh the list.
   */
  async createCustomer(
    businessId: string,
    userId:     string,
    payload:    CustomerPayload
  ): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        business_id: businessId,
        user_id:     userId,
        first_name:  payload.first_name.trim(),
        last_name:   payload.last_name?.trim()  || null,
        phone:       payload.phone?.trim()       || null,
        email:       payload.email?.trim()       || null,
        notes:       payload.notes?.trim()       || null,
      })
      .select('*')
      .single()

    if (error) throw error
    if (!data)  throw new Error('Customer was not created. No data returned.')

        return data 
    },

  /**
   * Update the user-editable fields of an existing customer.
   * Returns the updated row so the hook can patch local state in place.
   */
  async updateCustomer(
    customerId: string,
    payload:    CustomerPayload
  ): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        first_name: payload.first_name.trim(),
        last_name:  payload.last_name?.trim()  || null,
        phone:      payload.phone?.trim()       || null,
        email:      payload.email?.trim()       || null,
        notes:      payload.notes?.trim()       || null,
      })
      .eq('id', customerId)
      .select('*')
      .single()

    if (error) throw error
    if (!data)  throw new Error('Customer was not updated. No data returned.')

        return data 
    },

  /**
   * Archive a customer by setting is_archived = true.
   * The row is retained for future appointment history.
   * Archived customers no longer appear in getCustomersByBusiness results.
   */
  async archiveCustomer(customerId: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .update({ is_archived: true })
      .eq('id', customerId)

    if (error) throw error
  },

  /**
   * Restore a previously archived customer.
   * The customer re-appears in getCustomersByBusiness results.
   * Not yet wired to a UI — available for future use.
   */
  async restoreCustomer(customerId: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .update({ is_archived: false })
      .eq('id', customerId)

    if (error) throw error
  },
}