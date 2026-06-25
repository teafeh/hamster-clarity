import { useState, useEffect, useMemo } from 'react'
import { useAuth }          from '@/hooks/useAuth'
import { useBusiness } from '@/hooks/useBusiness'
import { customerEvents } from '@/events/customerEvents'
import { customerService } from '@/services/customerService'
import type { Customer, CustomerPayload } from '@/services/customerService'

// ─── Return type ──────────────────────────────────────────────────────────────

export interface UseCustomersResult {
  customers:         Customer[]    // full unfiltered list — use for total count
  filteredCustomers: Customer[]    // search-filtered list — use for rendering
  loading:           boolean
  submitting:        boolean
  error:             string | null
  searchQuery:       string
  setSearchQuery:    (query: string) => void
  clearError:        () => void
  createCustomer:    (payload: CustomerPayload) => Promise<boolean>
  updateCustomer:    (customerId: string, payload: CustomerPayload) => Promise<boolean>
  archiveCustomer:   (customerId: string) => Promise<boolean>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Re-sort a customer array alphabetically after a mutation.
 * Matches the order returned by customerService.getCustomersByBusiness.
 * Customers with no last name sort to the end.
 */
function sortCustomers(list: Customer[]): Customer[] {
  return [...list].sort((a, b) => {
    const lastA = (a.last_name ?? '').toLowerCase()
    const lastB = (b.last_name ?? '').toLowerCase()
    const firstA = a.first_name.toLowerCase()
    const firstB = b.first_name.toLowerCase()

    // Nulls-last: empty last names sort after populated ones
    if (lastA === '' && lastB !== '') return 1
    if (lastA !== '' && lastB === '') return -1
    if (lastA !== lastB) return lastA.localeCompare(lastB)
    return firstA.localeCompare(firstB)
  })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCustomers(): UseCustomersResult {
  const { user } = useAuth()
  const { business, loading: businessLoading } = useBusiness()

  const [customers,   setCustomers]   = useState<Customer[]>([])
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // ─── Initial load ────────────────────────────────────────────────────────

  useEffect(() => {
    if (businessLoading) return

    if (!business) {
      setLoading(false)
      return
    }

    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await customerService.getCustomersByBusiness(business.id)
        if (mounted) setCustomers(data)
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load customers.'
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [business?.id, businessLoading])

  // ─── Search (derived — no extra state) ───────────────────────────────────

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q === '') return customers

    return customers.filter((c) => {
      const fullName = `${c.first_name} ${c.last_name ?? ''}`.toLowerCase()
      const phone    = (c.phone ?? '').toLowerCase()
      return fullName.includes(q) || phone.includes(q)
    })
  }, [customers, searchQuery])

  // ─── Create ──────────────────────────────────────────────────────────────

  const createCustomer = async (payload: CustomerPayload): Promise<boolean> => {
    if (!business || !user) {
      setError('Cannot create a customer without an active business session.')
      return false
    }

    setSubmitting(true)
    setError(null)

    try {
      const created = await customerService.createCustomer(
  business.id,
  user.id,
  payload
)

      await customerEvents.onCreated(created.id)
      
      // Append and re-sort to maintain alphabetical order
      setCustomers((prev) => sortCustomers([...prev, created]))
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create customer.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Update ──────────────────────────────────────────────────────────────

  const updateCustomer = async (
    customerId: string,
    payload:    CustomerPayload
  ): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const updated = await customerService.updateCustomer(customerId, payload)
      // Replace the matching entry and re-sort — name may have changed
      setCustomers((prev) =>
        sortCustomers(prev.map((c) => (c.id === customerId ? updated : c)))
      )
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update customer.'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Archive ─────────────────────────────────────────────────────────────

  const archiveCustomer = async (customerId: string): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      await customerService.archiveCustomer(customerId)
      // Remove from local state — archived customers are not shown in active list
      setCustomers((prev) => prev.filter((c) => c.id !== customerId))
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to archive customer.'
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
    customers,
    filteredCustomers,
    loading: businessLoading || loading,
    submitting,
    error,
    searchQuery,
    setSearchQuery,
    clearError,
    createCustomer,
    updateCustomer,
    archiveCustomer,
  }
}