'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function PatientDetailPage({ params }) {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPatient()
  }, [params.id])

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      } else {
        router.push('/dashboard/patients')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      router.push('/dashboard/patients')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return `${age} años`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Paciente no encontrado</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {patient.name} {patient.lastName}
          </h1>
          <p className="text-gray-600">DNI: {patient.dni}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button>
            Nuevo Turno
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
              <p className="text-gray-900">{patient.name} {patient.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">DNI</label>
              <p className="text-gray-900">{patient.dni}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Edad</label>
              <p className="text-gray-900">{calculateAge(patient.birthDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
              <p className="text-gray-900">{formatDate(patient.birthDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{patient.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-gray-900">{patient.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dirección</label>
              <p className="text-gray-900">{patient.address || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Turnos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Turnos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.appointments && patient.appointments.length > 0 ? (
              <div className="space-y-3">
                {patient.appointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium">{formatDate(appointment.date)}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay turnos registrados</p>
            )}
          </CardContent>
        </Card>

        {/* Historia Clínica */}
        <Card>
          <CardHeader>
            <CardTitle>Historia Clínica</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
              <div className="space-y-3">
                {patient.medicalRecords.map((record) => (
                  <div key={record.id} className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium">{formatDate(record.consultationDate)}</p>
                    <p className="text-sm text-gray-600">{record.diagnosis || 'Sin diagnóstico'}</p>
                    <p className="text-sm text-gray-500">{record.notes || 'Sin notas'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay registros médicos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
