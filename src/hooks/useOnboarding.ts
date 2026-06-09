import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  onboardingService,
  type OperatingHours,
  type ServicePayload,
} from '@/services/onboardingService'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface Step1Data {
  businessName: string
  businessType: string
}

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
// Hook Implementation
// ─────────────────────────────────────────────────────────────

export function useOnboarding(): UseOnboardingReturn {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
    
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
  // Step 1: Core Business Registration
  // ───────────────────────────────────────────────────────────

  const submitStep1 = async (data: Step1Data) => {
    if (!user?.id) {
      setError('Authentication context missing. Please log in again.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const newBusinessId = await onboardingService.createBusiness(user.id, {
        name: data.businessName,
        business_type: data.businessType,
      })

      setBusinessId(newBusinessId)
      setCurrentStep(2)
    } catch (err) {
      console.error('[useOnboarding] Step 1 Failure:', err)
      setError(err instanceof Error ? err.message : 'Failed to create business.')
    } finally {
      setIsLoading(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Step 2: Operational Schedule Parameters
  // ───────────────────────────────────────────────────────────

  const submitStep2 = async (hours: OperatingHours) => {
    if (!businessId) {
      setError('Business context missing. Please restart onboarding wizard.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await onboardingService.updateOperatingHours(businessId, hours)
      setCurrentStep(3)
    } catch (err) {
      console.error('[useOnboarding] Step 2 Failure:', err)
      setError(err instanceof Error ? err.message : 'Failed to save operating hours.')
    } finally {
      setIsLoading(false)
    }
  }

  // ───────────────────────────────────────────────────────────
  // Step 3: Service Genesis & Profile Finalization
  // ───────────────────────────────────────────────────────────

  const submitStep3 = async (service: ServicePayload) => {
    if (!user?.id) {
      setError('Authentication context missing. Please log in again.')
      return
    }

    if (!businessId) {
      setError('Business context missing. Please restart onboarding wizard.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 1. Create first dashboard service listing
      await onboardingService.createInitialService(businessId, user.id, service)

      // 2. Set onboarding_completed = true in Database
      await onboardingService.completeOnboarding(user.id)
        
      // 3. Atomically pull down updated record into AuthState machine 
      // preventing interstitial page-flickering states
      await refreshProfile()
        
      // 4. Securely transition them to application dashboard space
      navigate('/dashboard')
    } catch (err) {
      console.error('[useOnboarding] Step 3 Critical Failure:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete configuration.')
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