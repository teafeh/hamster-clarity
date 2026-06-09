import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { businessService } from '@/services/businessService'
import type { Business } from '@/services/businessService'

interface UseBusinessResult {
  business: Business | null
  loading:  boolean
  error:    string | null
  refetch:  () => Promise<void>
}

export function useBusiness(): UseBusinessResult {
  const { user } = useAuth()

  const [business, setBusiness] = useState<Business | null>(null)
  const [loading,  setLoading]  = useState<boolean>(true)
  const [error,    setError]    = useState<string | null>(null)

  // Use an execution counter sequence identifier to prevent out-of-order race responses
  const sequenceIdRef = useRef<number>(0)

  const loadBusinessData = async (currentUserId: string, seqId: number) => {
    try {
      setError(null)
      const data = await businessService.getBusinessByUserId(currentUserId)
      
      if (seqId === sequenceIdRef.current) {
        setBusiness(data)
      }
    } catch (err) {
      console.error('[useBusiness] Failed resolving target entity:', err)
      if (seqId === sequenceIdRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load business data context.')
        setBusiness(null)
      }
    } finally {
      if (seqId === sequenceIdRef.current) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!user?.id) {
      setBusiness(null)
      setLoading(false)
      return
    }

    sequenceIdRef.current += 1
    const currentSeqId = sequenceIdRef.current

    setLoading(true)
    loadBusinessData(user.id, currentSeqId)

    return () => {
      // Invalidate running operations on unmount or user substitution
      sequenceIdRef.current += 1
    }
  }, [user?.id])

  // Expose a structured manual refreshing capability for onboarding or modification updates
  const refetch = async () => {
    if (!user?.id) return
    sequenceIdRef.current += 1
    setLoading(true)
    await loadBusinessData(user.id, sequenceIdRef.current)
  }

  return { business, loading, error, refetch }
}