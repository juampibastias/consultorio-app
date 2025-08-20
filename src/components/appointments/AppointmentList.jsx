'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const statusLabels = {
  'SCHEDULED': 'Programado',
  'CONFIRMED': 'Confirmado',
  'IN_PROGRESS': 'En progreso',
  'COMPLETED': 'Completado',
  'CANCELLED': 'Cancelado'
}

const statusColors = {
  'SCHEDULED': 'bg-blue-100 text-blue-800',
  'CONFIRMED': 'bg-green-100 text-green-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'COMPLETED': 'bg-gray-100 text-gray-800',
  'CANCELLED': 'bg-red-100 text-red-800'
}

export default function AppointmentList({ appointments, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filteredAppointments = appointments.filter(appointment => {
    const search = searchTerm.toLowerCase()
    const matchesSearch = (
      appointment.patient.name.toLowerCase().includes(search) ||
      appointment.patient.lastName.toLowerCase().includes(search) ||
      appointment.patient.dni.includes(search)
    )
    
    const matchesDate = !filterDate || 
      appointment.date.split('T')[0] === filterDate
      
    const matchesStatus = !filterStatus || 
      appointment.status === filterStatus

    return matchesSearch && matchesDate && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString.slice(0, 5)
  }

  // Agrupar turnos por fecha
  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    const date = appointment.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(appointment)
    return groups
  }, {})

  // Ordenar fechas
  const sortedDates = Object.keys(groupedAppointments).sort()

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No hay turnos registrados</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Buscar por paciente o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filtrar por fecha"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de turnos agrupados por fecha */}
      <div className="space-y-6">
        {sortedDates.map(date => (
          <Card key={date}>
            <CardContent className="p-0">
              <div className="bg-gray-50 px-6 py-3 border-b">
                <h3 className="font-medium text-gray-900 capitalize">
                  {formatDate(date)}
                </h3>
                <p className="text-sm text-gray-600">
                  {groupedAppointments[date].length} turno{groupedAppointments[date].length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {groupedAppointments[date]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(appointment => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="text-lg font-medium text-gray-900">
                              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient.name} {appointment.patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              DNI: {appointment.patient.dni}
                              {appointment.patient.phone && ` • Tel: ${appointment.patient.phone}`}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-600 mt-1">
                                📝 {appointment.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                              {statusLabels[appointment.status]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(appointment)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(appointment.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredAppointments.length === 0 && (searchTerm || filterDate || filterStatus) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron turnos que coincidan con los filtros aplicados
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredAppointments.length} de {appointments.length} turnos
      </div>
    </div>
  )
}
