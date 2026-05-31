import { useState, useEffect } from 'react'
import { useServices }      from '@/hooks/useServices'
import type { Service }     from '@/services/serviceService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name:     string
  price:    string
  duration: string
}

const EMPTY_FORM: FormState = { name: '', price: '', duration: '' }

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const {
    services,
    loading,
    submitting,
    error,
    clearError,
    createService,
    updateService,
    deleteService,
  } = useServices()

  // ── UI state ──────────────────────────────────────────────────────────────
  const [showForm,        setShowForm]        = useState(false)
  const [editingService,  setEditingService]  = useState<Service | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // ── Temporary inline form state (replaced by ServiceForm) ─────────────────
  const [form,      setForm]      = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  // Sync form fields when editing target changes
  useEffect(() => {
    if (editingService) {
      setForm({
        name:     editingService.name,
        price:    String(editingService.price),
        duration: editingService.duration_minutes != null
          ? String(editingService.duration_minutes)
          : '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setFormError(null)
  }, [editingService, showForm])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    clearError()
    setEditingService(null)
    setShowForm(true)
  }

  const handleOpenEdit = (service: Service) => {
    clearError()
    setConfirmDeleteId(null)
    setEditingService(service)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingService(null)
    setFormError(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingService(null)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // ── Validation ──────────────────────────────────────────────────────────
    if (!form.name.trim() || form.name.trim().length < 2) {
      setFormError('Service name must be at least 2 characters.')
      return
    }

    const parsedPrice = parseFloat(form.price)
    if (form.price.trim() === '' || isNaN(parsedPrice) || !isFinite(parsedPrice)) {
      setFormError('Enter a valid price.')
      return
    }
    if (parsedPrice < 0) {
      setFormError('Price cannot be negative.')
      return
    }

    let parsedDuration: number | null = null
    if (form.duration.trim() !== '') {
      parsedDuration = parseInt(form.duration, 10)
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        setFormError('Duration must be a positive whole number.')
        return
      }
    }

    const payload = {
      name:             form.name.trim(),
      price:            parsedPrice,
      duration_minutes: parsedDuration,
    }

    const success = editingService
      ? await updateService(editingService.id, payload)
      : await createService(payload)

    if (success) handleFormSuccess()
  }

  const handleDeleteClick = (serviceId: string) => {
    setConfirmDeleteId(serviceId)
  }

  const handleDeleteConfirm = async (serviceId: string) => {
    const success = await deleteService(serviceId)
    if (success) setConfirmDeleteId(null)
  }

  const handleDeleteCancel = () => setConfirmDeleteId(null)

  // ── Derived ───────────────────────────────────────────────────────────────

  const pageTitle       = showForm
    ? (editingService ? 'Edit Service' : 'New Service')
    : 'Services'

  const serviceCountLabel = services.length === 1
    ? '1 service'
    : `${services.length} services`

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className="px-6 py-8 max-w-3xl mx-auto w-full"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: '#E07B39' }}
          >
            {showForm ? (editingService ? 'Editing' : 'Creating') : 'Manage'}
          </p>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            {pageTitle}
          </h2>
          {!showForm && !loading && services.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              {serviceCountLabel}
            </p>
          )}
        </div>

        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold shrink-0 transition-opacity"
            style={{ backgroundColor: '#111111', color: '#FAFAF8' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        )}
      </div>

      {/* ── Hook error banner (list view only) ───────────────────────────── */}
      {error && !showForm && (
        <div
          className="mb-6 flex items-start justify-between gap-4 px-4 py-3 rounded-md border text-sm"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#B91C1C' }}
        >
          <span>{error}</span>
          <button
            onClick={clearError}
            className="shrink-0 font-medium underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}

      {showForm ? (
        // ── Temporary inline form — replaced by <ServiceForm /> ────────────
        <div
          className="rounded-lg border p-6"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
        >
          {/* Hook error inside form */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-md border text-sm"
              style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#B91C1C' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} noValidate className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="svc-name"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#374151' }}
              >
                Service name
              </label>
              <input
                id="svc-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Haircut, Deep Tissue Massage"
                className="w-full px-3.5 py-2.5 rounded-md text-sm border outline-none"
                style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#111111' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = '#D1D5DB')}
              />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="svc-price"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#374151' }}
                >
                  Price
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none"
                    style={{ color: '#9CA3AF' }}
                  >
                    ₦
                  </span>
                  <input
                    id="svc-price"
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-md text-sm border outline-none"
                    style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#111111' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#D1D5DB')}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="svc-duration"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#374151' }}
                >
                  Duration{' '}
                  <span className="font-normal" style={{ color: '#9CA3AF' }}>
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="svc-duration"
                    type="text"
                    inputMode="numeric"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 60"
                    className="w-full pl-3.5 pr-12 py-2.5 rounded-md text-sm border outline-none"
                    style={{ borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', color: '#111111' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = '#D1D5DB')}
                  />
                  <span
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs select-none"
                    style={{ color: '#9CA3AF' }}
                  >
                    mins
                  </span>
                </div>
              </div>
            </div>

            {/* Form-level validation error */}
            {formError && (
              <p className="text-xs" style={{ color: '#B91C1C' }}>
                {formError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity flex items-center gap-2"
                style={{
                  backgroundColor: '#111111',
                  color:           '#FAFAF8',
                  opacity:         submitting ? 0.5 : 1,
                  cursor:          submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting && <Spinner />}
                {submitting
                  ? 'Saving…'
                  : editingService ? 'Save changes' : 'Create service'}
              </button>

              <button
                type="button"
                onClick={handleFormCancel}
                disabled={submitting}
                className="px-5 py-2.5 rounded-md text-sm font-medium border transition-colors"
                style={{
                  borderColor:     '#D1D5DB',
                  color:           '#374151',
                  backgroundColor: '#FFFFFF',
                  opacity:         submitting ? 0.5 : 1,
                  cursor:          submitting ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      ) : loading ? (
        // ── Loading skeleton ───────────────────────────────────────────────
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg border animate-pulse"
              style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}
            />
          ))}
        </div>

      ) : services.length === 0 ? (
        // ── Empty state ────────────────────────────────────────────────────
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <svg
              width="22" height="22"
              fill="none" viewBox="0 0 24 24"
              stroke="#9CA3AF" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path strokeLinecap="round" d="M9 12h6M9 16h4" />
            </svg>
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            No services yet
          </h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: '#6B7280' }}>
            Add the services your business offers so customers know what to book.
          </p>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-opacity"
            style={{ backgroundColor: '#111111', color: '#FAFAF8' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add your first service
          </button>
        </div>

      ) : (
        // ── Services list — temporary inline cards (replaced by <ServiceCard />) ──
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-lg border p-5 transition-colors"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <div className="flex items-start justify-between gap-4">

                {/* Service info */}
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: '#111111' }}
                  >
                    {service.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: '#E07B39' }}>
                      ₦{service.price.toLocaleString()}
                    </span>
                    {service.duration_minutes != null && (
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>
                        {service.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {confirmDeleteId === service.id ? (
                    // ── Delete confirmation ──────────────────────────────
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        Delete?
                      </span>
                      <button
                        onClick={() => handleDeleteConfirm(service.id)}
                        disabled={submitting}
                        className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity"
                        style={{
                          backgroundColor: '#B91C1C',
                          color:           '#FFFFFF',
                          opacity:         submitting ? 0.5 : 1,
                          cursor:          submitting ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {submitting ? 'Deleting…' : 'Yes, delete'}
                      </button>
                      <button
                        onClick={handleDeleteCancel}
                        disabled={submitting}
                        className="px-3 py-1.5 rounded text-xs font-medium border"
                        style={{ borderColor: '#D1D5DB', color: '#374151' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // ── Edit + Delete ────────────────────────────────────
                    <>
                      <button
                        onClick={() => handleOpenEdit(service)}
                        disabled={submitting}
                        className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
                        style={{
                          borderColor:     '#D1D5DB',
                          color:           '#374151',
                          backgroundColor: '#FFFFFF',
                          opacity:         submitting ? 0.5 : 1,
                          cursor:          submitting ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        disabled={submitting}
                        className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
                        style={{
                          borderColor:     '#FECACA',
                          color:           '#B91C1C',
                          backgroundColor: '#FFFFFF',
                          opacity:         submitting ? 0.5 : 1,
                          cursor:          submitting ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#FEF2F2' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}