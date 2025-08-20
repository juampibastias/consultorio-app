'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const statusOptions = [
  { value: 'SCHEDULED', label: 'Programado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'CANCELLED', label: 'Cancelado' }
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
]

export default function AppointmentForm({ appointment = null, patients, selectedDate, onSave, onCancel }) {
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    date: appointment?.date ? appointment.date.split('T')[0] : 
          selectedDate ? selectedDate.toISOString().split('T')[0] : 
          new Date().toISOString().split('T')[0],
    startTime: appointment?.startTime || '09:00',
    endTime: appointment?.endTime || '09:30',
    status: appointment?.status || 'SCHEDULED',
    notes: appointment?.notes || ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          const data = await response.json()
          setDoctors(data)
          
          // Si no hay doctor seleccionado y hay doctores disponibles, seleccionar el primero
          if (!formData.doctorId && data.length > 0) {
            setFormData(prev => ({ ...prev, doctorId: data[0].id }))
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
        // Si no hay API de users, usar un doctor por defecto
        setDoctors([{ id: 'default', name: 'Dr. Administrador', email: 'admin@consultorio.com' }])
        if (!formData.doctorId) {
          setFormData(prev => ({ ...prev, doctorId: 'default' }))
        }
      }
    }

    fetchDoctors()
  }, [])

  // Calcular automáticamente la hora de fin (30 minutos después)
  useEffect(() => {
    if (formData.startTime) {
      const [hours, minutes] = formData.startTime.split(':').map(Number)
      const startDate = new Date()
      startDate.setHours(hours, minutes, 0, 0)
      
      const endDate = new Date(startDate.getTime() + 30 * 60000) // +30 minutos
      const endTime = endDate.toTimeString().slice(0, 5)
      
      setFormData(prev => ({ ...prev, endTime }))
    }
  }, [formData.startTime])

  const validate = () => {
    const newErrors = {}
    
    if (!formData.patientId) newErrors.patientId = 'Paciente es requerido'
    if (!formData.doctorId) newErrors.doctorId = 'Doctor es requerido'
    if (!formData.date) newErrors.date = 'Fecha es requerida'
    if (!formData.startTime) newErrors.startTime = 'Hora de inicio es requerida'
    if (!formData.endTime) newErrors.endTime = 'Hora de fin es requerida'
    
    // Validar que la hora de fin sea posterior a la de inicio
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio'
    }
    
    // Validar que la fecha no sea anterior a hoy
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      newErrors.date = 'No se pueden programar turnos en fechas pasadas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    try {
      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments'
      const method = appointment ? 'PUT' : 'POST'
      
      // Si estamos usando el doctor por defecto, usar el email para buscar el ID real
      let finalData = { ...formData }
      if (formData.doctorId === 'default') {
        const response = await fetch('/api/users?email=admin@consultorio.com')
        if (response.ok) {
          const users = await response.json()
          if (users.length > 0) {
            finalData.doctorId = users[0].id
          }
        }
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error saving appointment')
      }
      
      const result = await response.json()
      onSave(result)
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Paciente *</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar paciente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} {patient.lastName} - DNI: {patient.dni}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Doctor *</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fecha *</label>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Hora de inicio *</label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeSlots.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Hora de fin *</label>
          <Input
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
            className={errors.endTime ? 'border-red-500' : ''}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Notas</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Observaciones adicionales sobre el turno..."
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : appointment ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
