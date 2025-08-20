'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar'
import AppointmentForm from '@/components/appointments/AppointmentForm'
import AppointmentList from '@/components/appointments/AppointmentList'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('calendar') // 'calendar' o 'list'

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchPatients()])
      .finally(() => setLoading(false))
  }, [])

  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, newAppointment])
    setShowForm(false)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowForm(true)
  }

  const handleUpdateAppointment = (updatedAppointment) => {
    setAppointments(appointments.map(apt => 
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    ))
    setSelectedAppointment(null)
    setShowForm(false)
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (confirm('¿Está seguro de que desea eliminar este turno?')) {
      try {
        await fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' })
        setAppointments(appointments.filter(apt => apt.id !== appointmentId))
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setSelectedAppointment(null)
  }

  const handleCalendarSlotSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Turnos</h1>
        <div className="flex space-x-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
          >
            Calendario
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            Lista
          </Button>
          <Button onClick={() => setShowForm(true)}>
            Nuevo Turno
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {selectedAppointment ? 'Editar Turno' : 'Nuevo Turno'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentForm
              appointment={selectedAppointment}
              patients={patients}
              selectedDate={selectedDate}
              onSave={selectedAppointment ? handleUpdateAppointment : handleAddAppointment}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      {view === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          onSelectSlot={handleCalendarSlotSelect}
          onSelectEvent={handleEditAppointment}
        />
      ) : (
        <AppointmentList
          appointments={appointments}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  )
}
