import { useState, useEffect } from 'react'
import { useAuth }         from '@/hooks/useAuth'
import { useBusiness }     from '@/hooks/useBusiness'
import { serviceService }  from '@/services/serviceService'
import type { Service, ServicePayload } from '@/services/serviceService'

// ─── Return type ──────────────────────────────────────────────────────────────

export interface UseServicesResult {
  services:      Service[]
  loading:       boolean
  submitting:    boolean
  error:         string | null
  clearError:    () => void
  createService: (payload: ServicePayload) => Promise<boolean>
  updateService: (serviceId: string, payload: ServicePayload) => Promise<boolean>
  deleteService: (serviceId: string) => Promise<boolean>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useServices(): UseServicesResult {
  const { user } = useAuth()
  const { business, loading: businessLoading } = useBusiness()

  const [services,   setServices]   = useState<Service[]>([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // ─── Initial load ────────────────────────────────────────────────────────

  useEffect(() => {
    // Business is still resolving — wait before attempting a fetch
      if (businessLoading) return

    // Business resolved but no row exists — nothing to fetch
    if (!business) {
      setLoading(false)
      return
    }

    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await serviceService.getServicesByBusiness(business.id)
        if (mounted) setServices(data)
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load services.'
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

    const createService = async (payload: ServicePayload): Promise<boolean> => {
      
        console.log({
  user,
  business,
  businessLoading,
})
    if (!business || !user) {
      setError('Cannot create a service without an active business session.')
      return false
    }

    setSubmitting(true)
    setError(null)

    try {
      const created = await serviceService.createService(business.id, user.id, payload)
      // Append the returned row — no refetch required
      setServices((prev) => [...prev, created])
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create service.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Update ──────────────────────────────────────────────────────────────

  const updateService = async (
    serviceId: string,
    payload:   ServicePayload
  ): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const updated = await serviceService.updateService(serviceId, payload)
      // Replace the matching entry with the returned updated row
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? updated : s))
      )
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update service.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Delete ──────────────────────────────────────────────────────────────

  const deleteService = async (serviceId: string): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      await serviceService.deleteService(serviceId)
      // Remove by id — local state is the source of truth for the UI
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete service.'
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
    services,
    // Combined: true while business is resolving OR services are fetching
    loading:    businessLoading || loading,
    submitting,
    error,
    clearError,
    createService,
    updateService,
    deleteService,
  }
}