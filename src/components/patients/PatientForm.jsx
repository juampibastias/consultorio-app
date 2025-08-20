'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PatientForm({ patient = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    dni: patient?.dni || '',
    name: patient?.name || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birthDate ? patient.birthDate.split('T')[0] : '',
    address: patient?.address || ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.dni.trim()) newErrors.dni = 'DNI es requerido'
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    try {
      const url = patient ? `/api/patients/${patient.id}` : '/api/patients'
      const method = patient ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Error saving patient')
      }
      
      const result = await response.json()
      onSave(result)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el paciente')
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
          <label className="block text-sm font-medium mb-2">DNI *</label>
          <Input
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="12345678"
            className={errors.dni ? 'border-red-500' : ''}
          />
          {errors.dni && (
            <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Apellido *</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Pérez"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+54 9 11 1234-5678"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="juan@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
          <Input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Dirección</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="2"
          placeholder="Av. Corrientes 1234, CABA"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : patient ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
