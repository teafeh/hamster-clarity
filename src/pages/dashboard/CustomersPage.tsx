import { useState } from 'react'
import { useCustomers }  from '@/hooks/useCustomers'
import CustomerForm      from '@/components/customers/CustomerForm'
import CustomerCard      from '@/components/customers/CustomerCard'
import type { Customer } from '@/services/customerService'

export default function CustomersPage() {
  const {
    customers,
    filteredCustomers,
    loading,
    submitting,
    error,
    searchQuery,
    setSearchQuery,
    clearError,
    createCustomer,
    updateCustomer,
    archiveCustomer,
  } = useCustomers()

  const [showForm,         setShowForm]         = useState(false)
  const [editingCustomer,  setEditingCustomer]  = useState<Customer | null>(null)
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    clearError()
    setConfirmArchiveId(null)
    setEditingCustomer(null)
    setShowForm(true)
  }

  const handleOpenEdit = (customer: Customer) => {
    clearError()
    setConfirmArchiveId(null)
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  const handleArchiveClick = (customerId: string) => {
    setConfirmArchiveId(customerId)
  }

  const handleArchiveConfirm = async (customerId: string) => {
    const success = await archiveCustomer(customerId)
    if (success) setConfirmArchiveId(null)
  }

  const handleArchiveCancel = () => setConfirmArchiveId(null)

  // ── Derived labels ────────────────────────────────────────────────────────

  const pageTitle = showForm
    ? (editingCustomer ? 'Edit Customer' : 'New Customer')
    : 'Customers'

  const pageLabel = showForm
    ? (editingCustomer ? 'Editing' : 'Creating')
    : 'Manage'

  const isSearching = searchQuery.trim() !== ''

  const countLabel = (() => {
    if (loading) return null
    if (isSearching) {
      return `${filteredCustomers.length} of ${customers.length} customer${customers.length !== 1 ? 's' : ''}`
    }
    return customers.length === 1 ? '1 customer' : `${customers.length} customers`
  })()

  // ── Render ────────────────────────────────────────────────────────────────

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
          {!showForm && countLabel && (
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              {countLabel}
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
            Add Customer
          </button>
        )}
      </div>

      {/* ── Search — list view only, hidden during load ───────────────────── */}
      {!showForm && !loading && customers.length > 0 && (
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
            placeholder="Search by name or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm border outline-none transition-all"
            style={{
              borderColor:     '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color:           '#111111',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#E07B39')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = '#D1D5DB')}
          />
          {isSearching && (
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

        <CustomerForm
          customer={editingCustomer}
          submitting={submitting}
          error={error}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          onCreate={createCustomer}
          onUpdate={updateCustomer}
        />

      ) : loading ? (

        // ── Loading skeleton ──────────────────────────────────────────────
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg border animate-pulse"
              style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}
            />
          ))}
        </div>

      ) : customers.length === 0 ? (

        // ── Empty state ───────────────────────────────────────────────────
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h3
            className="text-base font-semibold mb-1"
            style={{ fontFamily: "'Fraunces', serif", color: '#111111' }}
          >
            No customers yet
          </h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: '#6B7280' }}>
            Start building your customer list. Add a customer to get started.
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
            Add your first customer
          </button>
        </div>

      ) : filteredCustomers.length === 0 ? (

        // ── No search results ─────────────────────────────────────────────
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
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            No customers match{' '}
            <span className="font-medium" style={{ color: '#111111' }}>
              "{searchQuery}"
            </span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: '#E07B39' }}
          >
            Clear search
          </button>
        </div>

      ) : (

        // ── Customer list ─────────────────────────────────────────────────
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              submitting={submitting}
              confirmingArchive={confirmArchiveId === customer.id}
              onEdit={() => handleOpenEdit(customer)}
              onArchive={() => handleArchiveClick(customer.id)}
              onArchiveConfirm={() => handleArchiveConfirm(customer.id)}
              onArchiveCancel={handleArchiveCancel}
            />
          ))}
        </div>

      )}
    </div>
  )
}