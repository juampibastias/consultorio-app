'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MedicalRecordForm({ record = null, patients, selectedPatient, onSave, onCancel }) {
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({
    patientId: record?.patientId || selectedPatient?.id || '',
    doctorId: record?.doctorId || '',
    consultationDate: record?.consultationDate ? 
      new Date(record.consultationDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    diagnosis: record?.diagnosis || '',
    treatment: record?.treatment || '',
    notes: record?.notes || '',
    prescriptions: record?.prescriptions ? JSON.stringify(record.prescriptions, null, 2) : '[]'
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
        setDoctors([{ id: 'default', name: 'Dr. Administrador', email: 'admin@consultorio.com' }])
        if (!formData.doctorId) {
          setFormData(prev => ({ ...prev, doctorId: 'default' }))
        }
      }
    }

    fetchDoctors()
  }, [])

  const validate = () => {
    const newErrors = {}
    
    if (!formData.patientId) newErrors.patientId = 'Paciente es requerido'
    if (!formData.doctorId) newErrors.doctorId = 'Doctor es requerido'
    if (!formData.consultationDate) newErrors.consultationDate = 'Fecha de consulta es requerida'
    
    // Validar JSON de prescripciones
    if (formData.prescriptions) {
      try {
        JSON.parse(formData.prescriptions)
      } catch (e) {
        newErrors.prescriptions = 'El formato de prescripciones debe ser JSON válido'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    try {
      const url = record ? `/api/medical-records/${record.id}` : '/api/medical-records'
      const method = record ? 'PUT' : 'POST'
      
      // Procesar prescripciones
      let prescriptions = null
      if (formData.prescriptions.trim()) {
        try {
          prescriptions = JSON.parse(formData.prescriptions)
        } catch (e) {
          prescriptions = []
        }
      }
      
      // Si estamos usando el doctor por defecto, usar el email para buscar el ID real
      let finalData = { 
        ...formData, 
        prescriptions 
      }
      
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
        throw new Error(errorData.error || 'Error saving medical record')
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

  const exampleText = '[{medicamento: "Ibuprofeno", dosis: "400mg", frecuencia: "cada 8 horas"}]'

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
            disabled={selectedPatient}
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
          <label className="block text-sm font-medium mb-2">Fecha de Consulta *</label>
          <Input
            name="consultationDate"
            type="date"
            value={formData.consultationDate}
            onChange={handleChange}
            className={errors.consultationDate ? 'border-red-500' : ''}
          />
          {errors.consultationDate && (
            <p className="text-red-500 text-sm mt-1">{errors.consultationDate}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Diagnóstico</label>
        <Input
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          placeholder="Diagnóstico principal..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Tratamiento</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Descripción del tratamiento..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Notas de Consulta</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          placeholder="Observaciones generales, síntomas, examen físico..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Prescripciones (JSON)
          <span className="text-gray-500 text-xs ml-2">
            Ejemplo: {exampleText}
          </span>
        </label>
        <textarea
          name="prescriptions"
          value={formData.prescriptions}
          onChange={handleChange}
          className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${errors.prescriptions ? 'border-red-500' : ''}`}
          rows="3"
          placeholder='[]'
        />
        {errors.prescriptions && (
          <p className="text-red-500 text-sm mt-1">{errors.prescriptions}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : record ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
