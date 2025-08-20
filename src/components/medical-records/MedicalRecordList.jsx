'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function MedicalRecordList({ medicalRecords, onEdit, onDelete, onNewRecord }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const filteredRecords = medicalRecords.filter(record => {
    const search = searchTerm.toLowerCase()
    const matchesSearch = (
      record.patient.name.toLowerCase().includes(search) ||
      record.patient.lastName.toLowerCase().includes(search) ||
      record.patient.dni.includes(search) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(search))
    )
    
    const matchesDate = !filterDate || 
      record.consultationDate.split('T')[0] === filterDate

    return matchesSearch && matchesDate
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Agrupar por paciente
  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const patientKey = `${record.patient.name} ${record.patient.lastName}`
    if (!groups[patientKey]) {
      groups[patientKey] = {
        patient: record.patient,
        records: []
      }
    }
    groups[patientKey].records.push(record)
    return groups
  }, {})

  if (medicalRecords.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No hay historias clínicas registradas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            placeholder="Buscar por paciente, DNI o diagnóstico..."
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
      </div>

      {/* Lista de historias clínicas agrupadas por paciente */}
      <div className="space-y-6">
        {Object.entries(groupedRecords).map(([patientName, { patient, records }]) => (
          <Card key={patient.id}>
            <CardContent className="p-0">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {patient.name} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    DNI: {patient.dni} • {records.length} registro{records.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNewRecord(patient)}
                >
                  Nueva HC
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {records
                  .sort((a, b) => new Date(b.consultationDate) - new Date(a.consultationDate))
                  .map(record => (
                  <div key={record.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-shrink-0">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDateTime(record.consultationDate)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Dr. {record.doctor.name}
                            </div>
                          </div>
                        </div>
                        
                        {record.diagnosis && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Diagnóstico: </span>
                            <span className="text-sm text-gray-900">{record.diagnosis}</span>
                          </div>
                        )}
                        
                        {record.treatment && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Tratamiento: </span>
                            <span className="text-sm text-gray-900">{record.treatment}</span>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Notas: </span>
                            <span className="text-sm text-gray-900">{record.notes}</span>
                          </div>
                        )}
                        
                        {record.prescriptions && Array.isArray(record.prescriptions) && record.prescriptions.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Prescripciones: </span>
                            <div className="mt-1">
                              {record.prescriptions.map((prescription, index) => (
                                <div key={index} className="text-sm text-gray-900 bg-blue-50 p-2 rounded mb-1">
                                  💊 {prescription.medicamento || prescription.medicine || 'Medicamento'} - 
                                  {prescription.dosis || prescription.dose || 'Dosis'} - 
                                  {prescription.frecuencia || prescription.frequency || 'Frecuencia'}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(record)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(record.id)}
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
      
      {filteredRecords.length === 0 && (searchTerm || filterDate) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron historias clínicas que coincidan con los filtros aplicados
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredRecords.length} de {medicalRecords.length} historias clínicas
      </div>
    </div>
  )
}
