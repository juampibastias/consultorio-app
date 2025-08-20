'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalMedicalRecords: 0
  })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentMedicalRecords, setRecentMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch patients
      const patientsResponse = await fetch('/api/patients')
      const patients = await patientsResponse.json()

      // Fetch appointments
      const appointmentsResponse = await fetch('/api/appointments')
      const appointments = await appointmentsResponse.json()

      // Fetch medical records
      const recordsResponse = await fetch('/api/medical-records')
      const medicalRecords = await recordsResponse.json()

      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.filter(apt => 
        apt.date.split('T')[0] === today
      )

      // Calculate pending appointments
      const pendingAppointments = appointments.filter(apt => 
        apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED'
      )

      // Get recent appointments (next 5)
      const upcomingAppointments = appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)

      // Get recent medical records (last 5)
      const recentRecords = medicalRecords
        .sort((a, b) => new Date(b.consultationDate) - new Date(a.consultationDate))
        .slice(0, 5)

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingAppointments: pendingAppointments.length,
        totalMedicalRecords: medicalRecords.length
      })

      setRecentAppointments(upcomingAppointments)
      setRecentMedicalRecords(recentRecords)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString.slice(0, 5)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pacientes Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalPatients}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pacientes registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Turnos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.todayAppointments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Programados para hoy
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Turnos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingAppointments}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Por confirmar/atender
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Historias Clínicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalMedicalRecords}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Registros médicos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {appointment.patient.name} {appointment.patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        DNI: {appointment.patient.dni}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(appointment.date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay turnos próximos programados
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMedicalRecords.length > 0 ? (
              <div className="space-y-3">
                {recentMedicalRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {record.patient.name} {record.patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.diagnosis || 'Sin diagnóstico'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(record.consultationDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Dr. {record.doctor.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay historias clínicas recientes
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
