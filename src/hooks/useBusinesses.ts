import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { businessService } from '@/services/businessService'
import type { Business } from '@/services/businessService'

export function useBusinesses() {
  const { user } = useAuth()

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBusinesses = async () => {
    if (!user?.id) {
      setBusinesses([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data =
        await businessService.getBusinessesByUserId(user.id)

      setBusinesses(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load businesses'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBusinesses()
  }, [user?.id])

  return {
    businesses,
    loading,
    error,
    refetch: loadBusinesses,
  }
}