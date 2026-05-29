import { useEffect } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'
import type { UseOnboardingReturn } from '@/hooks/useOnboarding'

import Step1BusinessInfo from '@/components/onboarding/Step1BusinessInfo'
import Step2OperatingHours from '@/components/onboarding/Step2OperatingHours'
import Step3InitialService from '@/components/onboarding/Step3InitialService'
// ─── Config ───────────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Business info' },
  { number: 2, label: 'Operating hours' },
  { number: 3, label: 'First service' },
] as const

type StepNumber = 1 | 2 | 3

type StepComponentProps = {
  onboarding: UseOnboardingReturn
}

const STEP_COMPONENTS: Record<
  StepNumber,
  React.ComponentType<StepComponentProps>
> = {
  1: Step1BusinessInfo,
  2: Step2OperatingHours,
  3: Step3InitialService,
}
// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
    const onboarding = useOnboarding()
    const { currentStep } = onboarding

  const ActiveStep = STEP_COMPONENTS[currentStep as StepNumber]

  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#FAFAF8' }}
    >

      {/* ── Left panel — desktop only ──────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col justify-between p-12 shrink-0"
        style={{ backgroundColor: '#111111' }}
      >
        {/* Brand */}
        <div>
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: '#E07B39' }}
          >
            Operational Clarity
          </span>
        </div>

        {/* Headline */}
        <div>
          <h1
            className="text-4xl xl:text-5xl font-semibold leading-tight mb-6"
            style={{ fontFamily: "'Fraunces', serif", color: '#FAFAF8' }}
          >
            Let's get your
            <br />
            business{' '}
            <em style={{ color: '#E07B39' }}>set up.</em>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
            Three quick steps. Under five minutes.
            <br />
            You can change everything later.
          </p>

          {/* Step list */}
          <div className="mt-10 space-y-4">
            {STEPS.map(({ number, label }) => {
              const isDone    = currentStep > number
              const isActive  = currentStep === number
              const isPending = currentStep < number

              return (
                <div key={number} className="flex items-center gap-3">
                  {/* Step indicator */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isDone
                        ? '#E07B39'
                        : isActive
                        ? '#FAFAF8'
                        : 'transparent',
                      border: isPending ? '1px solid #374151' : 'none',
                    }}
                  >
                    {isDone ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#111111"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isActive ? '#111111' : '#6B7280' }}
                      >
                        {number}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color:      isActive ? '#FAFAF8' : isDone ? '#9CA3AF' : '#4B5563',
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer note */}
        <div>
          <div className="w-8 h-px mb-4" style={{ backgroundColor: '#E07B39' }} />
          <p className="text-xs tracking-wide" style={{ color: '#6B7280' }}>
            Your data is encrypted and private.
          </p>
        </div>
      </div>

      {/* ── Right panel — form area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#E5E7EB' }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#E07B39' }}
          >
            Operational Clarity
          </span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>
            Step {currentStep} of 3
          </span>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden h-0.5 w-full" style={{ backgroundColor: '#E5E7EB' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width:           `${(currentStep / 3) * 100}%`,
              backgroundColor: '#E07B39',
            }}
          />
        </div>

        {/* Active step — only the current step is mounted */}
        <div className="flex-1 flex items-start justify-center px-6 py-10 lg:py-16">
          <div className="w-full max-w-md">
            <ActiveStep onboarding={onboarding} />
          </div>
        </div>

      </div>
    </div>
  )
}