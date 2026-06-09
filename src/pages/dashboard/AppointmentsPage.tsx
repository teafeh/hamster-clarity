import { useState, useMemo }    from 'react'
import { useAppointments }      from '@/hooks/useAppointments'
import { useCustomers }         from '@/hooks/useCustomers'
import { useServices }          from '@/hooks/useServices'
import AppointmentForm          from '@/components/customers/appointments/AppointmentForm'
import AppointmentCard          from '@/components/customers/appointments/AppointmentCard'
import ScheduleCalendar from '@/components/customers/appointments/ScheduleCalendar'
import AppointmentDetailsModal from '@/components/customers/appointments/AppointmentDetailsModal'
import type {
  AppointmentWithRelations,
  AppointmentStatus,
} from '@/services/appointmentService'

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = AppointmentStatus | 'all'

interface StatusTab {
  value: StatusFilter
  label: string
}

const STATUS_TABS: StatusTab[] = [
  { value: 'all',       label: 'All'       },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show',   label: 'No Show'   },
]



// ─── Component ────────────────────────────────────────────────────────────────

export default function AppointmentsPage() {
  const {
    appointments,
    loading,
    submitting,
    error,
    clearError,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
  } = useAppointments()

  const [selectedAppointment, setSelectedAppointment] =
  useState<AppointmentWithRelations | null>(null)

  // Customers and services are needed by AppointmentForm
  const { customers } = useCustomers()
  const { services }  = useServices()

  // ── UI state ──────────────────────────────────────────────────────────────
  const [showForm,            setShowForm]            = useState(false)
  const [editingAppointment,  setEditingAppointment]  = useState<AppointmentWithRelations | null>(null)
  const [confirmingCancelId,  setConfirmingCancelId]  = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('scheduled')
  const [searchQuery,         setSearchQuery]         = useState('')
  const [viewMode,            setViewMode]            = useState<'list' | 'calendar'>('calendar')
  // CALENDAR INTEGRATION: Track slot selection string for prefilling creation form
  const [initialScheduledAt,  setInitialScheduledAt]  = useState<string | null>(null)

  // ── Derived: filtered list ─────────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    let list = appointments

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((a) => {
        const customer = a.customer
          ? `${a.customer.first_name} ${a.customer.last_name ?? ''}`.toLowerCase()
          : ''
        const service = (a.service?.name ?? '').toLowerCase()
        return customer.includes(q) || service.includes(q)
      })
    }

    return list
  }, [appointments, statusFilter, searchQuery])

  // ── Derived: status tab counts (always from full unfiltered list) ──────────
  const statusCounts = useMemo(
    () => ({
      all:       appointments.length,
      scheduled: appointments.filter((a) => a.status === 'scheduled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      no_show:   appointments.filter((a) => a.status === 'no_show').length,
    }),
    [appointments]
  )

  // ── Derived: header count label ────────────────────────────────────────────
  const countLabel = (() => {
    if (loading) return null
    const total    = appointments.length
    const filtered = filteredAppointments.length
    const hasFilter = statusFilter !== 'all' || searchQuery.trim() !== ''
    if (hasFilter) {
      return `${filtered} of ${total} appointment${total !== 1 ? 's' : ''}`
    }
    return total === 1 ? '1 appointment' : `${total} appointments`
  })()

  const isFiltered = statusFilter !== 'all' || searchQuery.trim() !== ''

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    clearError()
    setConfirmingCancelId(null)
    setEditingAppointment(null)
    // CALENDAR INTEGRATION: Clear pre-fills if building a plain unmapped entry
    setInitialScheduledAt(null)
    setShowForm(true)
  }

  const handleOpenEdit = (appointment: AppointmentWithRelations) => {
    clearError()
    setConfirmingCancelId(null)
    setEditingAppointment(appointment)
    // CALENDAR INTEGRATION: Clear pre-fills to isolate contextual fields to edit targets
    setInitialScheduledAt(null)
    setShowForm(true)
  }

  const handleEmptySlotClick = (dateStr: string, hour: number) => {
    clearError()
    setConfirmingCancelId(null)
    
    // CALENDAR INTEGRATION: Format local target to ISO string expected by datetime inputs: YYYY-MM-DDTHH:00
    const targetedIsoString = `${dateStr}T${String(hour).padStart(2, '0')}:00`
    
    // CALENDAR INTEGRATION: Fix type violations and incorrect form header tracking by resetting editing states
    setEditingAppointment(null)
    setInitialScheduledAt(targetedIsoString)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingAppointment(null)
    // CALENDAR INTEGRATION: Reset context variables during cancel bounds
    setInitialScheduledAt(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingAppointment(null)
    // CALENDAR INTEGRATION: Reset context variables during success cycles
    setInitialScheduledAt(null)
  }

  const handleStatusUpdate = async (
    appointmentId: string,
    status:        AppointmentStatus
  ) => {
    await updateAppointmentStatus(appointmentId, status)
  }

  const handleCancelRequest = (appointmentId: string) => {
    setConfirmingCancelId(appointmentId)
  }

  const handleCancelConfirm = async (appointmentId: string) => {
    const success = await cancelAppointment(appointmentId)
    if (success) setConfirmingCancelId(null)
  }

  const handleCancelDiscard = () => setConfirmingCancelId(null)

  const handleTabChange = (tab: StatusFilter) => {
    setStatusFilter(tab)
    setConfirmingCancelId(null)
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setSearchQuery('')
  }

  // ── Page labels ────────────────────────────────────────────────────────────
  const pageTitle = showForm
    ? (editingAppointment?.id ? 'Edit Appointment' : 'New Appointment')
    : 'Appointments'

  const pageLabel = showForm
    ? (editingAppointment?.id ? 'Editing' : 'Creating')
    : 'Manage'

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="px-6 py-8 max-w-3xl mx-auto w-full"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: '#E07B39' }}
          >
            {pageLabel}
          </p>
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            {pageTitle}
          </h2>
          {!showForm && (
            <div className="flex items-center gap-4 mt-2">
              <div className="inline-flex rounded-md bg-gray-100 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-sm transition-colors ${viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Calendar View
                </button>
              </div>
              {countLabel && (
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {countLabel}
                </p>
              )}
            </div>
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
            Add Appointment
          </button>
        )}
      </div>

      {/* ── Status tabs — list view only ──────────────────────────────────── */}
      {!showForm && !loading && appointments.length > 0 && viewMode === 'list' && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const count   = statusCounts[tab.value]
            const active  = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0"
                style={{
                  backgroundColor: active ? '#111111' : '#F3F4F6',
                  color:           active ? '#FAFAF8'  : '#6B7280',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: active ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
                      color:           active ? '#FAFAF8' : '#374151',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Search — list view only ───────────────────────────────────────── */}
      {!showForm && !loading && appointments.length > 0 && viewMode === 'list' && (
        <div className="relative mb-5">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#9CA3AF' }}
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer or service…"
            className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm border outline-none transition-all"
            style={{
              borderColor:     '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color:           '#111111',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#D1D5DB')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#9CA3AF' }}
              aria-label="Clear search"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* ── Hook error banner (list view only) ───────────────────────────── */}
      {error && !showForm && (
        <div
          className="mb-5 flex items-start justify-between gap-4 px-4 py-3 rounded-md border text-sm"
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

        <AppointmentForm
          appointment={editingAppointment}
          customers={customers}
          services={services}
          submitting={submitting}
          error={error}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          onCreate={createAppointment}
          onUpdate={updateAppointment}
          // CALENDAR INTEGRATION: Securely deliver parsed calendar slots down to child hooks
          initialScheduledAt={initialScheduledAt ?? undefined}
        />

      ) : loading ? (

        // ── Loading skeleton ──────────────────────────────────────────────
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-lg border animate-pulse"
              style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}
            />
          ))}
        </div>

      ) : viewMode === 'calendar' ? (

        // ── Calendar View ─────────────────────────────────────────────────
        <ScheduleCalendar
          appointments={appointments}
          onEmptySlotClick={handleEmptySlotClick}
          onAppointmentClick={setSelectedAppointment}
        />

      ) : appointments.length === 0 ? (

        // ── Empty state — no appointments at all ──────────────────────────
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={1.5}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            No appointments yet
          </h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: '#6B7280' }}>
            Book your first appointment to get started.
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
            Add your first appointment
          </button>
        </div>

      ) : filteredAppointments.length === 0 ? (

        // ── No-results state ──────────────────────────────────────────────
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={1.75}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            No results found
          </h3>
          <p className="text-sm mb-4 max-w-xs" style={{ color: '#6B7280' }}>
            {searchQuery.trim()
              ? <>No appointments match <span className="font-medium" style={{ color: '#111111' }}>"{searchQuery}"</span></>
              : <>No appointments with status <span className="font-medium" style={{ color: '#111111' }}>"{STATUS_TABS.find(t => t.value === statusFilter)?.label}"</span></>
            }
          </p>
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="text-sm font-medium underline underline-offset-2"
              style={{ color: '#E07B39' }}
            >
              Clear filters
            </button>
          )}
        </div>

      ) : (

        // ── Appointment list ──────────────────────────────────────────────
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              submitting={submitting}
              onViewDetails={() => setSelectedAppointment(appointment)}
                confirmingCancel={confirmingCancelId === appointment.id}
                onEdit={() => handleOpenEdit(appointment)}
                onMarkComplete={() =>
                    handleStatusUpdate(appointment.id, 'completed')
                }
                onMarkNoShow={() =>
                    handleStatusUpdate(appointment.id, 'no_show')
                }
                onReschedule={() =>
                    handleStatusUpdate(appointment.id, 'scheduled')
                }
                onCancelStart={() =>
                    handleCancelRequest(appointment.id)
                }
                onCancelConfirm={() =>
                    handleCancelConfirm(appointment.id)
                }
                onCancelCancel={handleCancelDiscard}
            />
          ))}
        </div>

      )}

                {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>

   
  )
}