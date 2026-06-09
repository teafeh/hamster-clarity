import { useState, useEffect } from 'react'
import { useAuth }              from '@/hooks/useAuth'
import { useBusiness }          from '@/hooks/useBusiness'
import { appointmentService }   from '@/services/appointmentService'
import type {
  AppointmentWithRelations,
  AppointmentPayload,
  AppointmentStatus,
} from '@/services/appointmentService'

// ─── Return type ──────────────────────────────────────────────────────────────

export interface UseAppointmentsResult {
  appointments:            AppointmentWithRelations[]
  loading:                 boolean
  submitting:              boolean
  error:                   string | null
  clearError:              () => void
  createAppointment: (
  payload: AppointmentPayload
) => Promise<AppointmentWithRelations | null>
  updateAppointment:       (appointmentId: string, payload: AppointmentPayload) => Promise<boolean>
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<boolean>
  cancelAppointment:       (appointmentId: string) => Promise<boolean>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sort appointments by scheduled_at ascending — next appointment first.
 * Used after create and update since either can change the row's
 * position in time. Status-only changes skip this sort.
 */
function sortAppointments(
  list: AppointmentWithRelations[]
): AppointmentWithRelations[] {
  return [...list].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppointments(): UseAppointmentsResult {
  const { user } = useAuth()
  const { business, loading: businessLoading } = useBusiness()

  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading,      setLoading]      = useState(true)
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  // ─── Initial load ────────────────────────────────────────────────────────

  useEffect(() => {
    // Wait for business to resolve before fetching
    if (businessLoading) return

    // Business resolved but no row exists — not expected post-onboarding
    if (!business) {
      setLoading(false)
      return
    }

    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await appointmentService.getAppointmentsByBusiness(
          business.id
        )
        if (mounted) setAppointments(data)
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load appointments.'
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [business?.id, businessLoading])

  // ─── Create ──────────────────────────────────────────────────────────────

  const createAppointment = async (
  payload: AppointmentPayload
): Promise<AppointmentWithRelations | null> => {
  if (!business || !user) {
    setError(
      'Cannot create an appointment without an active business session.'
    )
    return null
  }

  setSubmitting(true)
  setError(null)

  try {
    const created = await appointmentService.createAppointment(
      business.id,
      user.id,
      payload
    )

    setAppointments((prev) =>
      sortAppointments([...prev, created])
    )

    return created
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Failed to create appointment.'
    )

    return null
  } finally {
    setSubmitting(false)
  }
}

  // ─── Update ──────────────────────────────────────────────────────────────

  const updateAppointment = async (
    appointmentId: string,
    payload:       AppointmentPayload
  ): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const updated = await appointmentService.updateAppointment(
        appointmentId,
        payload
      )
      // Replace the matching entry and re-sort — scheduled_at may have changed
      setAppointments((prev) =>
        sortAppointments(
          prev.map((a) => (a.id === appointmentId ? updated : a))
        )
      )
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update appointment.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Update status ───────────────────────────────────────────────────────

  const updateAppointmentStatus = async (
    appointmentId: string,
    status:        AppointmentStatus
  ): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const updated = await appointmentService.updateAppointmentStatus(
        appointmentId,
        status
      )
      // Replace in place — scheduled_at is unchanged, no re-sort needed
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? updated : a))
      )
      return true
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update appointment status.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Cancel ──────────────────────────────────────────────────────────────

  const cancelAppointment = async (
    appointmentId: string
  ): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const cancelled = await appointmentService.cancelAppointment(appointmentId)
      // Replace in place — appointment stays in list with status 'cancelled'
      // The UI decides whether to display cancelled appointments
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? cancelled : a))
      )
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to cancel appointment.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const clearError = () => setError(null)

  // ─── Return ──────────────────────────────────────────────────────────────

  return {
    appointments,
    // Combined: true while business is resolving OR appointments are fetching
    loading: businessLoading || loading,
    submitting,
    error,
    clearError,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
  }
}