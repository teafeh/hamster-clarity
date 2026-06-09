import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Service } from '@/services/serviceService'
import HamsterLoader from '@/components/animation/HamsterLoader'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

interface FieldErrors {
  firstName?: string
  email?: string
  date?: string
  time?: string
}

interface BookingPageProps {
  business: any
  services: Service[]

  onCreateBooking: (
    payload: {
      service: Service
      bookingDate: string
      bookingTime: string
      guestForm: GuestFormState
    }
  ) => Promise<string | null>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingPage({
  business,
  services,
  onCreateBooking,
}: BookingPageProps) {

  const servicesLoading = false
  const submitting = false
  const submitError = null

  const clearError = () => { }

  // ── Step and Form States ───────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [bookingDate, setBookingDate] = useState<string>('')
  const [bookingTime, setBookingTime] = useState<string>('')
  
  const [guestForm, setGuestForm] = useState<GuestFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const isLoading = servicesLoading

  // ── Time Slots Generator ───────────────────────────────────────────────────
  const availableHours = useMemo(() => {
    const slots = []
    for (let h = 8; h <= 17; h++) {
      const displayHour = h > 12 ? h - 12 : h
      const ampm = h >= 12 ? 'PM' : 'AM'
      slots.push({
        value: `${String(h).padStart(2, '0')}:00`,
        label: `${displayHour}:00 ${ampm}`,
      })
    }
    return slots
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setCurrentStep(2)
  }

  const handleStepTwoNext = () => {
    const newErrors: FieldErrors = {}
    if (!bookingDate) newErrors.date = 'Please pick a date for your visit.'
    if (!bookingTime) newErrors.time = 'Please pick a preferred slot time.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setCurrentStep(3)
  }

  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGuestForm((prev) => ({ ...prev, [name]: value }))
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

    const navigate = useNavigate()


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const newErrors: FieldErrors = {}

    if (!guestForm.firstName.trim()) {
      newErrors.firstName = 'First name is required.'
    }

    if (!guestForm.email.trim()) {
      newErrors.email = 'Email address is required.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!selectedService || !bookingDate || !bookingTime) {
      return
    }

    const appointmentId =
      await onCreateBooking({
        service: selectedService,
        bookingDate,
        bookingTime,
        guestForm,
      })

    if (appointmentId) {
      navigate(`/booking-success/${appointmentId}`)
    }
  }


  // ── Loading Skeleton Render ────────────────────────────────────────────────
if (isLoading) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="flex flex-col items-center">
        <div className="scale-[2.2]">
          <HamsterLoader />
        </div>

        <h2 className="mt-2 text-lg font-medium text-[#111111]">
          Preparing your booking details
        </h2>

        <p className="text-sm text-gray-500 animate-pulse">
          Please wait a moment...
        </p>
      </div>
    </div>
  )
}

  // ── Confirmation Card Render ───────────────────────────────────────────────
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900" style={{ fontFamily: "'Fraunces', serif" }}>
            Booking Confirmed!
          </h3>
          <p className="text-sm text-neutral-500 mt-2">
            Your appointment has been successfully scheduled at {business?.name ?? 'our business'}.
          </p>

          <div className="mt-6 border-t border-b border-neutral-100 py-4 text-left space-y-2">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Appointment Summary</p>
            <p className="text-sm font-bold text-neutral-900">{selectedService?.name}</p>
            <p className="text-xs text-neutral-600">
              {new Date(`${bookingDate}T${bookingTime}`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {availableHours.find(h => h.value === bookingTime)?.label}
            </p>
            {selectedService?.duration_minutes && (
              <p className="text-xs text-neutral-400">{selectedService.duration_minutes} minutes duration</p>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedService(null)
              setBookingDate('')
              setBookingTime('')
              setGuestForm({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
              setIsConfirmed(false)
              setCurrentStep(1)
            }}
            className="w-full mt-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  console.log('Business:', business)
  console.log('Services:', services)

  

  // ── Main Page Layout Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="p-6 border-b border-neutral-100 text-center bg-white">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3">
  {business?.name}
</p>
            <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "'Fraunces', serif" }}>
              {business?.name ?? 'Welcome'}
            </h1>
            {business?.business_type && (
              <p className="text-xs text-neutral-400 mt-0.5">{business.business_type}</p>
            )}

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              <span className="w-6 h-px bg-neutral-100" />
              <span className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              <span className="w-6 h-px bg-neutral-100" />
              <span className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
            </div>
          </div>

          {/* Error Feedbacks */}
          {submitError && (
            <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              {submitError}
            </div>
          )}

          {/* ── STEP 1: Service Selection ──────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-2">Select a Service</h3>
              {services.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-6">No services are currently available for online booking.</p>
              ) : (
                <div className="space-y-2.5">
                  {services
  .filter((service) => service.is_available)
  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className="w-full p-4 border border-neutral-200 hover:border-neutral-400 rounded-xl text-left flex items-center justify-between gap-4 transition-colors group bg-white"
                    >
                      <div className="truncate">
                        <p className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors truncate">
                          {service.name}
                        </p>
                        {service.duration_minutes && (
                          <p className="text-xs text-neutral-400 mt-0.5">{service.duration_minutes} mins duration</p>
                        )}
                      </div>
                      <div className="shrink-0 text-sm font-bold text-neutral-900">
                        ₦{service.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Date & Time Configuration ──────────────────────────── */}
          {currentStep === 2 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-neutral-500 mb-2">
                <button onClick={() => setCurrentStep(1)} className="text-xs font-semibold hover:text-neutral-900 flex items-center gap-1">
                  ← Back to Services
                </button>
              </div>

              {selectedService && (
                <div className="bg-neutral-50 rounded-xl p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-neutral-400 font-medium">Selected offer:</span>
                    <p className="font-bold text-neutral-900 mt-0.5">{selectedService.name}</p>
                  </div>
                  <span className="font-bold text-neutral-900">₦{selectedService.price.toLocaleString()}</span>
                </div>
              )}

              {/* Date Input Box */}
              <div>
                <label htmlFor="bookingDate" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Choose Date
                </label>
                <input
                  id="bookingDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value)
                    setErrors(p => ({ ...p, date: undefined }))
                  }}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none focus:border-neutral-900"
                />
                {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
              </div>

              {/* Time Slot Picker Grid */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableHours.map((slot) => {
                    const isSelected = bookingTime === slot.value
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => {
                          setBookingTime(slot.value)
                          setErrors(p => ({ ...p, time: undefined }))
                        }}
                        className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {slot.label}
                      </button>
                    )
                  })}
                </div>
                {errors.time && <p className="mt-1 text-xs text-rose-600">{errors.time}</p>}
              </div>

              <button
                type="button"
                onClick={handleStepTwoNext}
                className="w-full mt-4 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* ── STEP 3: Customer Information Intake ───────────────────────── */}
          {currentStep === 3 && (
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-neutral-500 mb-2">
                <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-semibold hover:text-neutral-900 flex items-center gap-1">
                  ← Back to Selection
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={guestForm.firstName}
                    onChange={handleGuestInputChange}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none focus:border-neutral-900"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={guestForm.lastName}
                    onChange={handleGuestInputChange}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={guestForm.email}
                  onChange={handleGuestInputChange}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none focus:border-neutral-900"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={guestForm.phone}
                  onChange={handleGuestInputChange}
                  placeholder="e.g. +234..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Special Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={guestForm.notes}
                  onChange={handleGuestInputChange}
                  placeholder="Any preferences or instructions..."
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-neutral-200 outline-none resize-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {submitting ? 'Booking Appointment...' : 'Complete Appointment Booking'}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Basic Footer Element */}
      <div className="py-4 border-t border-neutral-200 text-center text-[10px] text-neutral-400 bg-white select-none">
        Powered by  {business?.name ?? 'Hamster'}
      </div>
    </div>
  )
}