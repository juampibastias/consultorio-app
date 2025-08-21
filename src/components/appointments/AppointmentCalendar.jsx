'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Configurar moment en español
moment.locale('es')
const localizer = momentLocalizer(moment)

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay turnos en este rango',
  showMore: (total) => `+ Ver más (${total})`
}

export default function AppointmentCalendar({ appointments, onSelectSlot, onSelectEvent }) {
  const events = appointments.map(apt => ({
    id: apt.id,
    title: `${apt.patient.name} ${apt.patient.lastName}`,
    start: new Date(`${apt.date.split('T')[0]}T${apt.startTime}`),
    end: new Date(`${apt.date.split('T')[0]}T${apt.endTime}`),
    resource: apt
  }))

  const eventStyleGetter = (event) => {
    const appointment = event.resource
    let backgroundColor = '#3174ad'
    
    switch (appointment.status) {
      case 'CONFIRMED':
        backgroundColor = '#28a745'
        break
      case 'CANCELLED':
        backgroundColor = '#dc3545'
        break
      case 'COMPLETED':
        backgroundColor = '#6c757d'
        break
      case 'IN_PROGRESS':
        backgroundColor = '#ffc107'
        break
      default:
        backgroundColor = '#3174ad'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow text-black">
      <div className="h-96 lg:h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={onSelectSlot}
          onSelectEvent={(event) => onSelectEvent(event.resource)}
          selectable
          popup
          views={['month', 'week', 'day']}
          defaultView="week"
          step={30}
          timeslots={2}
          min={new Date(2025, 0, 1, 8, 0, 0)} // 8:00 AM
          max={new Date(2025, 0, 1, 20, 0, 0)} // 8:00 PM
          messages={messages}
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              localizer.format(start, 'HH:mm', culture) + ' - ' +
              localizer.format(end, 'HH:mm', culture)
          }}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
          <span>Programado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
          <span>Confirmado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-600 rounded mr-2"></div>
          <span>En progreso</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
          <span>Completado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
          <span>Cancelado</span>
        </div>
      </div>
    </div>
  )
}
