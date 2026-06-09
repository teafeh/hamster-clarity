import { appointmentService } from './appointmentService'

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface TimeSlot {
  time: string          // Format: "HH:MM" (e.g., "09:30")
  dateTimeISO: string   // Complete ISO 8601 timestamp string
  isAvailable: boolean
}

export interface AvailabilityConfig {
  startHour: number     // e.g., 8 for 08:00 AM
  endHour: number       // e.g., 18 for 06:00 PM
}

// Default operating constraints: 08:00 AM - 06:00 PM
const DEFAULT_CONFIG: AvailabilityConfig = {
  startHour: 8,
  endHour: 18,
}

// ─── Service Implementation ───────────────────────────────────────────────────

export const availabilityService = {
  /**
   * Generates a list of all possible time slots for a given date, calculating 
   * availability flags by checking against existing appointment collisions.
   * Leverages date range filtering at the database layer.
   * * @param businessId Unique identifier of the business tenant
   * @param dateStr Target date formatted as "YYYY-MM-DD"
   * @param durationMinutes Length of the chosen service menu item
   * @param config Optional operating hour overrides
   */
  async getAvailableSlots(
    businessId: string,
    dateStr: string,
    durationMinutes: number,
    config: AvailabilityConfig = DEFAULT_CONFIG
  ): Promise<TimeSlot[]> {
    // 1. Establish the daily operating range timestamps
    const startWindow = `${dateStr}T00:00:00.000Z`
    const endWindow = `${dateStr}T23:59:59.999Z`

    // 2. Retrieve multi-tenant isolated records matching our daily range window
    const dailyAppointments = await appointmentService.getAppointmentsByBusiness(
      businessId,
      {
        from: startWindow,
        to: endWindow,
      }
    )

    // 3. Filter out cancelled or no-show items and convert rows to interval metrics
    const bookedIntervals = dailyAppointments
      .filter((appt) => {
        if (!appt.scheduled_at) return false
        return appt.status !== 'cancelled' && appt.status !== 'no_show'
      })
      .map((appt) => {
        const startMs = new Date(appt.scheduled_at).getTime()
        const apptDuration = appt.duration_minutes ?? durationMinutes
        return {
          start: startMs,
          end: startMs + apptDuration * 60 * 1000,
        }
      })

    const slots: TimeSlot[] = []
    const now = new Date()

    // 4. Initialize slot generator markers in local time space for the given day string
    const currentSlotPointer = new Date(`${dateStr}T${String(config.startHour).padStart(2, '0')}:00:00`)
    const dayClosingTime = new Date(`${dateStr}T${String(config.endHour).padStart(2, '0')}:00:00`)

    // 5. Progressively generate slots using fixed-duration interval steps
    while (currentSlotPointer.getTime() + durationMinutes * 60 * 1000 <= dayClosingTime.getTime()) {
      const slotStartMs = currentSlotPointer.getTime()
      const slotEndMs = slotStartMs + durationMinutes * 60 * 1000

      const hourString = String(currentSlotPointer.getHours()).padStart(2, '0')
      const minuteString = String(currentSlotPointer.getMinutes()).padStart(2, '0')
      const timeLabel = `${hourString}:${minuteString}`

      // Block slots positioned in the historical past
      const isPast = slotStartMs < now.getTime()

      // Enforce overlap prevention rule equations
      const hasConflict = bookedIntervals.some((booking) => {
        return slotStartMs < booking.end && slotEndMs > booking.start
      })

      slots.push({
        time: timeLabel,
        dateTimeISO: currentSlotPointer.toISOString(),
        isAvailable: !isPast && !hasConflict,
      })

      // Increment step pointer forward by the specific service duration
      currentSlotPointer.setMinutes(currentSlotPointer.getMinutes() + durationMinutes)
    }

    return slots
  },

  /**
   * Validates a single targeted timeline option to guarantee strict cross-tenant 
   * conflict detection prior to database insert or update commitments.
   * * @param businessId Unique identifier of the business tenant
   * @param targetDateTimeISO Proposed appointment start timestamp string
   * @param durationMinutes Expected duration width of the appointment block
   * @param excludeAppointmentId Optional ID to bypass (used when editing a record)
   */
  async checkSlotAvailability(
    businessId: string,
    targetDateTimeISO: string,
    durationMinutes: number,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const targetStart = new Date(targetDateTimeISO)
    const targetStartMs = targetStart.getTime()
    const targetEndMs = targetStartMs + durationMinutes * 60 * 1000
    const targetDateStr = targetStart.toISOString().split('T')[0]

    // Disallow scheduling assignments targeted at historical time windows
    if (targetStartMs < Date.now()) {
      return false
    }

    // Isolate database query retrieval to the relevant day window
    const startWindow = `${targetDateStr}T00:00:00.000Z`
    const endWindow = `${targetDateStr}T23:59:59.999Z`

    const dailyAppointments = await appointmentService.getAppointmentsByBusiness(
      businessId,
      {
        from: startWindow,
        to: endWindow,
      }
    )

    // Evaluate potential intersection matching blocks
    const hasConflict = dailyAppointments.some((appt) => {

      console.log('excludeAppointmentId', excludeAppointmentId)

dailyAppointments.forEach((appt) => {
  console.log('DB APPOINTMENT', appt.id)
})
      
      if (!appt.scheduled_at || appt.id === excludeAppointmentId) return false
      if (appt.status === 'cancelled' || appt.status === 'no_show') return false

      const apptStartMs = new Date(appt.scheduled_at).getTime()
      const apptDuration = appt.duration_minutes ?? 30
      const apptEndMs = apptStartMs + apptDuration * 60 * 1000


      console.log('----------------')
console.log('TARGET', {
  start: new Date(targetStartMs).toISOString(),
  end: new Date(targetEndMs).toISOString(),
})

console.log('DB APPOINTMENT', appt.id, {
  start: new Date(apptStartMs).toISOString(),
  end: new Date(apptEndMs).toISOString(),
})

const overlaps =
  targetStartMs < apptEndMs &&
  targetEndMs > apptStartMs

console.log('OVERLAPS?', overlaps)

return overlaps

      
    })

    return !hasConflict
  },
}