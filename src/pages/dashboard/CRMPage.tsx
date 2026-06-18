import { useState } from 'react'
import { useCustomers } from '@/hooks/useCustomers'
import type { Customer } from '@/services/customerService'
import { useAppointments } from '@/hooks/useAppointments'
import CustomerForm from '@/components/customers/CustomerForm'


export default function CRMPage() {
    const {
        customers,
        loading,
        createCustomer,
        updateCustomer,
        archiveCustomer,
        submitting,
        error,
    } = useCustomers()

    const [showCustomerForm, setShowCustomerForm] =
        useState(false)

    const [editingCustomer, setEditingCustomer] =
        useState<Customer | null>(null)
    const { appointments } = useAppointments()

    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null)

    const [searchTerm, setSearchTerm] = useState('')

    const [statusFilter, setStatusFilter] =
        useState('all')

    const crmCustomers = customers.filter((customer) => {
        const fullName =
            `${customer.first_name} ${customer.last_name ?? ''}`
                .toLowerCase()

        const search = searchTerm.toLowerCase()

        const matchesSearch =
            fullName.includes(search) ||
            (customer.email ?? '')
                .toLowerCase()
                .includes(search) ||
            (customer.phone ?? '')
                .toLowerCase()
                .includes(search)

        if (!matchesSearch) return false

        if (statusFilter === 'email')
            return !!customer.email

        if (statusFilter === 'phone')
            return !!customer.phone

        if (statusFilter === 'incomplete')
            return !customer.email || !customer.phone

        return true
    })

    const customerAppointments =
        selectedCustomer
            ? appointments.filter(
                (appointment) =>
                    appointment.customer_id ===
                    selectedCustomer.id
            )
            : []
    

    const customerRevenue =
        customerAppointments.reduce((total, appointment) => {
            if (appointment.status !== 'completed') return total

            return total + (appointment.service?.price ?? 0)
        }, 0)
    
    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer)
        setShowCustomerForm(true)
    }

    const handleArchiveCustomer = async (
        customerId: string
    ) => {
        const confirmed = window.confirm(
            'Archive this customer?'
        )

        if (!confirmed) return

        await archiveCustomer(customerId)

        if (selectedCustomer?.id === customerId) {
            setSelectedCustomer(null)
        }
    }
    


    return (

        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <p
                    className="text-xs font-semibold tracking-widest uppercase mb-3"
                    style={{ color: '#E07B39' }}
                >
                    Manage
                </p>

                <h1
                    className="text-3xl font-semibold"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        color: '#111111',
                    }}
                >
                    Customer Relationships
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Track customer information and relationships.
                </p>
            </div>

            <button
                onClick={() => {
                    setEditingCustomer(null)
                    setShowCustomerForm(true)
                }}
                className="
    px-4
    py-2
    rounded-xl
    bg-[#E07B39]
    text-white
    font-medium
    mb-6
  "
            >
                + Add Customer
            </button>


            {showCustomerForm && (
                <div
                    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      p-4
    "
                >
                    <div
                        className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-2xl
      "
                    >
                    
                        <CustomerForm
                            customer={editingCustomer}
                            submitting={submitting}
                            error={error}
                            onCreate={createCustomer}
                            onUpdate={updateCustomer}
                            onSuccess={() => {
                                setShowCustomerForm(false)
                                setEditingCustomer(null)
                            }}
                            onCancel={() => {
                                setShowCustomerForm(false)
                                setEditingCustomer(null)
                            }}
                        />

                    </div>
                </div>
            )}

            {/* Search */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        Total Customers
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                        {customers.length}
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        With Email
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                        {
                            customers.filter(c => c.email).length
                        }
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        With Phone
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                        {
                            customers.filter(c => c.phone).length
                        }
                    </h3>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase">
                        Added This Month
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                        {
                            customers.filter(c => {
                                const created =
                                    new Date(c.created_at)

                                const now = new Date()

                                return (
                                    created.getMonth() === now.getMonth() &&
                                    created.getFullYear() === now.getFullYear()
                                )
                            }).length
                        }
                    </h3>
                </div>
            </div>

            


            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black"
                />
            </div>


            <select
                value={statusFilter}
                onChange={(e) =>
                    setStatusFilter(e.target.value)
                }
                className="mb-5 px-3 py-2 border rounded-xl"
            >
                <option value="all">
                    All Customers
                </option>

                <option value="email">
                    Has Email
                </option>

                <option value="phone">
                    Has Phone
                </option>

                <option value="incomplete">
                    Missing Details
                </option>
            </select>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Phone
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    Created
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : crmCustomers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                        crmCustomers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                onClick={() => setSelectedCustomer(customer)}
                                                className="
    border-b
    border-gray-100
    hover:bg-gray-50
    cursor-pointer
  "
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">
                                                        {customer.first_name} {customer.last_name ?? ''}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {customer.email || '—'}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {customer.phone || '—'}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(customer.created_at).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEditCustomer(customer)
                                                            }}
                                                            className="px-3 py-1.5 rounded text-xs font-medium border"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleArchiveCustomer(customer.id)
                                                            }}
                                                            className="px-3 py-1.5 rounded text-xs font-medium border"
                                                            style={{
                                                                borderColor: '#FDE68A',
                                                                color: '#B45309',
                                                            }}
                                                        >
                                                            Archive
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                        ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                selectedCustomer && (
                    <div className="
fixed
top-0
right-0
h-full
w-[420px]
bg-white
border-l
shadow-xl
z-50
overflow-hidden
">
                        <div className="p-6 h-full overflow-y-auto pb-20">

                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold">
                                    Customer Profile
                                </h2>

                                <button
                                    onClick={() =>
                                        setSelectedCustomer(null)
                                    }
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Name
                                    </p>

                                    <p className="font-medium">
                                        {selectedCustomer.first_name}
                                        {' '}
                                        {selectedCustomer.last_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Email
                                    </p>

                                    <p>
                                        {selectedCustomer.email || '—'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Phone
                                    </p>

                                    <p>
                                        {selectedCustomer.phone || '—'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Notes
                                    </p>

                                    <p>
                                        {selectedCustomer.notes || '—'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Customer Since
                                    </p>

                                    <p>
                                        {new Date(
                                            selectedCustomer.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="border rounded-lg p-3">
                                        <p className="text-xs text-gray-500">
                                            Appointments
                                        </p>

                                        <p className="text-xl font-bold">
                                            {customerAppointments.length}
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <p className="text-xs text-gray-500">
                                            Revenue
                                        </p>

                                        <p className="text-xl font-bold">
                                            ₦{customerRevenue.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-3">
                                        <p className="text-xs text-gray-500">
                                            Last Visit
                                        </p>

                                        <p className="text-sm font-medium">
                                            {customerAppointments.length > 0
                                                ? new Date(
                                                    customerAppointments[0]
                                                        .scheduled_at
                                                ).toLocaleDateString()
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold mb-3">
                                        Appointment History
                                    </h3>

                                    {customerAppointments.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            No appointments yet.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                                {[...customerAppointments]
                                                    .sort(
                                                        (a, b) =>
                                                            new Date(b.scheduled_at).getTime() -
                                                            new Date(a.scheduled_at).getTime()
                                                    )
                                                    .map((appointment) => (
                                                        <div
                                                            key={appointment.id}
                                                            className="border rounded-lg p-3"
                                                        >
                                                            <p className="font-medium">
                                                                {appointment.service?.name ??
                                                                    'Unknown Service'}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                {new Date(
                                                                    appointment.scheduled_at
                                                                ).toLocaleDateString()}
                                                            </p>

                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {appointment.status}
                                                            </p>
                                                        </div>
                                                    ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
            
        </div>
    )
    
}