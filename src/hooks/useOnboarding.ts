import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  onboardingService,
  type OperatingHours,
  type ServicePayload,
} from '@/services/onboardingService'

import { useAuth } from '@/hooks/useAuth'

// ─────────────────────────────────────────────────────────────
// Step 1
// ─────────────────────────────────────────────────────────────

export interface Step1Data {
  businessName: string
  businessType: string
}

// ─────────────────────────────────────────────────────────────
// Hook Return Type
// ─────────────────────────────────────────────────────────────

export interface UseOnboardingReturn {
  currentStep: number
  isLoading: boolean
  error: string | null

  submitStep1: (data: Step1Data) => Promise<void>
  submitStep2: (hours: OperatingHours) => Promise<void>
  submitStep3: (service: ServicePayload) => Promise<void>

  goBack: () => void
  clearError: () => void
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useOnboarding(): UseOnboardingReturn {
  const navigate = useNavigate()

    const { user, refreshProfile } = useAuth()
    
  const [currentStep, setCurrentStep] = useState(1)
  const [businessId, setBusinessId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => {
    setError(null)
  }

  const goBack = () => {
    setError(null)

    setCurrentStep((prev) => {
      if (prev <= 1) return 1
      return prev - 1
    })
  }

  // ───────────────────────────────────────────────────────────
  // Step 1
  // ───────────────────────────────────────────────────────────

  const submitStep1 = async (data: Step1Data) => {
    if (!user) {
      setError('You must be signed in.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const newBusinessId =
        await onboardingService.createBusiness(user.id, {
          name: data.businessName,
          business_type: data.businessType,
        })

      setBusinessId(newBusinessId)
      setCurrentStep(2)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create business.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Step 2
  // ───────────────────────────────────────────────────────────

  const submitStep2 = async (hours: OperatingHours) => {
    if (!businessId) {
      setError('Business not found. Please restart onboarding.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await onboardingService.updateOperatingHours(
        businessId,
        hours
      )

      setCurrentStep(3)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to save operating hours.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Step 3
  // ───────────────────────────────────────────────────────────

  const submitStep3 = async (
    service: ServicePayload
  ) => {
    if (!user) {
      setError('You must be signed in.')
      return
    }

    if (!businessId) {
      setError('Business not found. Please restart onboarding.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await onboardingService.createInitialService(
        businessId,
        user.id,
        service
      )

      await onboardingService.completeOnboarding(
        user.id
      )
        
        await refreshProfile()


        
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to complete onboarding.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    currentStep,
    isLoading,
    error,

    submitStep1,
    submitStep2,
    submitStep3,

    goBack,
    clearError,
  }
}