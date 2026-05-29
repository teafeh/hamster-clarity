import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { businessService } from '@/services/businessService'
import type { Business } from '@/services/businessService'

interface UseBusinessResult {
  business: Business | null
  loading:  boolean
  error:    string | null
}

export function useBusiness(): UseBusinessResult {
  const { user } = useAuth()

  const [business, setBusiness] = useState<Business | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let mounted = true

    const load = async () => {
      try {
        const data = await businessService.getBusinessByUserId(user.id)
        if (mounted) setBusiness(data)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load business.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [user])

  return { business, loading, error }
}