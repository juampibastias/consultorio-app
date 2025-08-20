'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import MedicalRecordForm from '@/components/medical-records/MedicalRecordForm'
import MedicalRecordList from '@/components/medical-records/MedicalRecordList'

export default function MedicalRecordsPage() {
  const [medicalRecords, setMedicalRecords] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('/api/medical-records')
      const data = await response.json()
      setMedicalRecords(data)
    } catch (error) {
      console.error('Error fetching medical records:', error)
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
    Promise.all([fetchMedicalRecords(), fetchPatients()])
      .finally(() => setLoading(false))
  }, [])

  const handleAddRecord = (newRecord) => {
    setMedicalRecords([newRecord, ...medicalRecords])
    setShowForm(false)
    setSelectedPatient(null)
  }

  const handleEditRecord = (record) => {
    setSelectedRecord(record)
    setShowForm(true)
  }

  const handleUpdateRecord = (updatedRecord) => {
    setMedicalRecords(medicalRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ))
    setSelectedRecord(null)
    setShowForm(false)
  }

  const handleDeleteRecord = async (recordId) => {
    if (confirm('¿Está seguro de que desea eliminar esta historia clínica?')) {
      try {
        await fetch(`/api/medical-records/${recordId}`, { method: 'DELETE' })
        setMedicalRecords(medicalRecords.filter(record => record.id !== recordId))
      } catch (error) {
        console.error('Error deleting medical record:', error)
      }
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setSelectedRecord(null)
    setSelectedPatient(null)
  }

  const handleNewRecordForPatient = (patient) => {
    setSelectedPatient(patient)
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
        <h1 className="text-3xl font-bold text-gray-900">Historia Clínica</h1>
        <Button onClick={() => setShowForm(true)}>
          Nueva Historia Clínica
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {selectedRecord ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MedicalRecordForm
              record={selectedRecord}
              patients={patients}
              selectedPatient={selectedPatient}
              onSave={selectedRecord ? handleUpdateRecord : handleAddRecord}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      <MedicalRecordList
        medicalRecords={medicalRecords}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
        onNewRecord={handleNewRecordForPatient}
      />
    </div>
  )
}
