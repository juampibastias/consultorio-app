'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import PatientForm from '@/components/patients/PatientForm'
import PatientList from '@/components/patients/PatientList'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleAddPatient = (newPatient) => {
    setPatients([newPatient, ...patients])
    setShowForm(false)
  }

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setShowForm(true)
  }

  const handleUpdatePatient = (updatedPatient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p))
    setSelectedPatient(null)
    setShowForm(false)
  }

  const handleDeletePatient = async (patientId) => {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
      try {
        await fetch(`/api/patients/${patientId}`, { method: 'DELETE' })
        setPatients(patients.filter(p => p.id !== patientId))
      } catch (error) {
        console.error('Error deleting patient:', error)
      }
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setSelectedPatient(null)
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
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <Button onClick={() => setShowForm(true)}>
          Nuevo Paciente
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {selectedPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientForm
              patient={selectedPatient}
              onSave={selectedPatient ? handleUpdatePatient : handleAddPatient}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      <PatientList
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />
    </div>
  )
}
