import { supabase }          from '@/lib/supabase'
import type { Database }     from '@/lib/database.types'

// ─── Database foundation ──────────────────────────────────────────────────────

type Tables       = Database['public']['Tables']
type AppointmentRow = Tables['appointments']['Row']

// ─── Public types ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface AppointmentCustomer {
  id:         string
  first_name: string
  last_name:  string | null
}

export interface AppointmentService {
  id:    string
  name:  string
  price: number
}

/**
 * A full appointment row from the database with related customer and
 * service data resolved. status is narrowed from string to the known
 * union — the database.types.ts base type uses string because Supabase
 * does not introspect CHECK constraints.
 */
export interface AppointmentWithRelations extends Omit<AppointmentRow, 'status'> {
  status:   AppointmentStatus
  customer: AppointmentCustomer | null
  service:  AppointmentService  | null
}

/**
 * User-supplied fields for create and update operations.
 * status is excluded — it has its own dedicated update path.
 * scheduled_at is an ISO 8601 timestamptz string.
 */
export interface AppointmentPayload {
  customer_id:      string
  service_id: string
  scheduled_at:     string
  duration_minutes: number | null
  notes:            string | null
}

export interface GetAppointmentsOptions {
  /** Filter by one or more statuses. Omit to return all statuses. */
  status?: AppointmentStatus[]
  /** Return only appointments with scheduled_at >= from (ISO date string). */
  from?:   string
  /** Return only appointments with scheduled_at <= to (ISO date string). */
  to?:     string
}

// ─── Select fragment ──────────────────────────────────────────────────────────

/**
 * Reused in every query that returns appointment rows.
 * PostgREST join syntax: alias:table ( columns )
 * customer_id → customers, service_id → services
 */
const APPOINTMENT_SELECT = `
  id,
  business_id,
  user_id,
  customer_id,
  service_id,
  scheduled_at,
  duration_minutes,
  status,
  notes,
  created_at,
  updated_at,
  customer:customers ( id, first_name, last_name ),
  service:services   ( id, name, price )
`.trim()

// ─── Service ──────────────────────────────────────────────────────────────────

export const appointmentService = {

  /**
   * Fetch appointments for a business, with related customer and service data.
   * Ordered by scheduled_at ascending — next appointment appears first.
   * Accepts optional filters for status and date range.
   */
  async getAppointmentsByBusiness(
    businessId: string,
    options:    GetAppointmentsOptions = {}
  ): Promise<AppointmentWithRelations[]> {
    let query = supabase
      .from('appointments')
      .select(APPOINTMENT_SELECT)
      .eq('business_id', businessId)
      .order('scheduled_at', { ascending: true })

    if (options.status && options.status.length > 0) {
      query = query.in('status', options.status)
    }

    if (options.from) {
      query = query.gte('scheduled_at', options.from)
    }

    if (options.to) {
      query = query.lte('scheduled_at', options.to)
    }

    const { data, error } = await query

    if (error) throw error

    return (data ?? []) as unknown as AppointmentWithRelations[]
  },

  /**
   * Create a new appointment. Status defaults to 'scheduled' at the
   * database level — it is not part of the payload.
   * Returns the persisted row with joined relations.
   */
  async createAppointment(
    businessId: string,
    userId:     string,
    payload:    AppointmentPayload
  ): Promise<AppointmentWithRelations> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        business_id:      businessId,
        user_id:          userId,
        customer_id:      payload.customer_id,
         service_id: payload.service_id,
          scheduled_at: payload.scheduled_at,
        duration_minutes: payload.duration_minutes ?? null,
        notes:            payload.notes?.trim()     || null,
      })
      .select(APPOINTMENT_SELECT)
      .single()

    if (error) throw error
    if (!data)  throw new Error('Appointment was not created. No data returned.')

    return data as unknown as AppointmentWithRelations
  },

  /**
   * Update the user-editable fields of an existing appointment.
   * Does not touch status — use updateAppointmentStatus for that.
   * Returns the updated row with joined relations.
   */
  async updateAppointment(
    appointmentId: string,
    payload:       AppointmentPayload
  ): Promise<AppointmentWithRelations> {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        customer_id:      payload.customer_id,
       service_id: payload.service_id,
        scheduled_at:     payload.scheduled_at,
        duration_minutes: payload.duration_minutes ?? null,
        notes:            payload.notes?.trim()     || null,
      })
      .eq('id', appointmentId)
      .select(APPOINTMENT_SELECT)
      .single()

    if (error) throw error
    if (!data)  throw new Error('Appointment was not updated. No data returned.')

    return data as unknown as AppointmentWithRelations
  },

  /**
   * Update the status of an appointment.
   * Transition validity is enforced at the application layer, not here.
   *
   * Valid transitions:
   *   scheduled  → completed | cancelled | no_show
   *   cancelled  → scheduled  (reschedule)
   *   no_show    → scheduled  (reschedule)
   *   completed  → (terminal)
   *
   * Returns the updated row with joined relations so the hook can patch
   * local state in place without a second fetch.
   */
  async updateAppointmentStatus(
    appointmentId: string,
    status:        AppointmentStatus
  ): Promise<AppointmentWithRelations> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select(APPOINTMENT_SELECT)
      .single()

    if (error) throw error
    if (!data)  throw new Error('Appointment status was not updated. No data returned.')

    return data as unknown as AppointmentWithRelations
  },

  /**
   * Cancel an appointment.
   * Convenience wrapper around updateAppointmentStatus('cancelled').
   * Call sites read clearly: cancelAppointment(id) vs
   * updateAppointmentStatus(id, 'cancelled').
   */
  async cancelAppointment(
    appointmentId: string
  ): Promise<AppointmentWithRelations> {
    return appointmentService.updateAppointmentStatus(appointmentId, 'cancelled')
  },
}