import { useState, useMemo } from 'react'
import type { AppointmentWithRelations, AppointmentStatus } from '@/services/appointmentService'

// CALENDAR INTEGRATION
interface ScheduleCalendarProps {
  appointments: AppointmentWithRelations[]
  onEmptySlotClick?: (dateStr: string, hour: number) => void
  onAppointmentClick?: (appointment: AppointmentWithRelations) => void
}

export default function ScheduleCalendar({
  appointments,
  onEmptySlotClick,
  onAppointmentClick
}: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const hoursTimeline = useMemo(() => {
    const hours = []
    for (let i = 8; i <= 18; i++) {
      hours.push(i)
    }
    return hours
  }, [])

  const currentWeekDays = useMemo(() => {
    const baseDate = new Date(currentDate)
    const activeDay = baseDate.getDay()
    const offset = activeDay === 0 ? -6 : 1 - activeDay
    
    const weekStart = new Date(baseDate.setDate(baseDate.getDate() + offset))
    const daysArray = []
    
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(weekStart)
      nextDay.setDate(weekStart.getDate() + i)
      daysArray.push(nextDay)
    }
    return daysArray
  }, [currentDate])

  const formatters = {
    toISODateString: (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    toTimeString: (hour: number) => {
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 === 0 ? 12 : hour % 12
      return `${displayHour}:00 ${ampm}`
    },
    toFullCustomerName: (customer: AppointmentWithRelations['customer']) => {
      if (!customer) return 'Guest Client'
      const { first_name, last_name } = customer
      return last_name ? `${first_name} ${last_name}` : first_name
    }
  }

  const scheduleLookupMatrix = useMemo(() => {
    const lookupMap: Record<string, AppointmentWithRelations[]> = {}
    
    appointments.forEach((appt) => {
      if (!appt.scheduled_at) return
      
      const apptDateObj = new Date(appt.scheduled_at)
      const dateKey = formatters.toISODateString(apptDateObj)
      const hourKey = apptDateObj.getHours()
      
      const complexHashKey = `${dateKey}-${hourKey}`
      if (!lookupMap[complexHashKey]) {
        lookupMap[complexHashKey] = []
      }
      lookupMap[complexHashKey].push(appt)
    })
    
    return lookupMap
  }, [appointments])

  const handleNavigatePrevious = () => {
    const target = new Date(currentDate)
    target.setDate(target.getDate() - 7)
    setCurrentDate(target)
  }

  const handleNavigateNext = () => {
    const target = new Date(currentDate)
    target.setDate(target.getDate() + 7)
    setCurrentDate(target)
  }

  const handleNavigateToday = () => {
    setCurrentDate(new Date())
  }

  const resolveStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70'
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70 line-through opacity-60'
      case 'no_show':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70 border-dashed'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/70'
    }
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden tracking-tight">
      
      {/* Navigation Header Component */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900">
          {currentWeekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' — '}
          {currentWeekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>

        <div className="flex items-center space-x-1 border border-slate-200 rounded-lg bg-white p-0.5 shadow-sm">
          <button
            onClick={handleNavigatePrevious}
            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNavigateToday}
            className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNavigateNext}
            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            aria-label="Next week"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid Sheet Viewport */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[720px] flex flex-col">
          
          {/* Day Columns Header Row */}
          <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/20 text-center select-none">
            <div className="p-2.5 border-r border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 text-left pl-4 self-center uppercase">
              Time
            </div>
            {currentWeekDays.map((day, idx) => {
              const isToday = formatters.toISODateString(day) === formatters.toISODateString(new Date())
              return (
                <div
                  key={idx}
                  className={`p-2 text-xs border-r last:border-r-0 border-slate-100 flex flex-col items-center justify-center ${
                    isToday ? 'bg-blue-50/30 text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  <span className="uppercase tracking-widest text-[9px] text-slate-400 font-bold">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    isToday ? 'bg-slate-900 text-white shadow-sm' : 'text-white'
                  }`}>
                    {day.getDate()}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Time Block Matrix Rows */}
          <div className="divide-y divide-slate-100 bg-white">
            {hoursTimeline.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[64px]">
                
                {/* Fixed Hour Marker Track Column */}
                <div className="p-2 border-r border-slate-100 text-[10px] font-bold text-slate-400 bg-slate-50/10 select-none pt-2.5 pl-4">
                  {formatters.toTimeString(hour)}
                </div>
                
                {/* Interactive Day Column Cells Mapping */}
                {currentWeekDays.map((day, dayIdx) => {
                  const targetCellDateStr = formatters.toISODateString(day)
                  const hourlyCellMatches = scheduleLookupMatrix[`${targetCellDateStr}-${hour}`] || []
                  const isDayColumnToday = targetCellDateStr === formatters.toISODateString(new Date())

                  return (
                    <div
                      key={dayIdx}
                      onClick={(e) => {
                        if (e.target === e.currentTarget && onEmptySlotClick) {
                          onEmptySlotClick(targetCellDateStr, hour)
                        }
                      }}
                      className={`p-1 border-r last:border-r-0 border-slate-100 relative transition-colors flex flex-col gap-1 overflow-y-auto cursor-pointer hover:bg-slate-50/40 ${
                        isDayColumnToday ? 'bg-blue-50/5' : ''
                      }`}
                    >
                      {hourlyCellMatches.map((appt) => (
                        <button
                          key={appt.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onAppointmentClick) onAppointmentClick(appt)
                          }}
                          className={`w-full p-1.5 rounded border text-left transition-all shadow-sm flex flex-col justify-between ${resolveStatusStyle(
                            appt.status
                          )}`}
                        >
                          <div className="font-bold text-[10px] leading-tight text-slate-900 truncate">
                            {formatters.toFullCustomerName(appt.customer)}
                          </div>
                          <div className="text-[9px] font-semibold opacity-80 truncate mt-0.5">
                            {appt.service?.name || 'Appointment'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                })}

              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}