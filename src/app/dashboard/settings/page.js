'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function SettingsPage() {
  const [consultorioInfo, setConsultorioInfo] = useState({
    name: 'Consultorio Médico',
    address: 'Av. Corrientes 1234, CABA',
    phone: '+54 11 1234-5678',
    email: 'info@consultorio.com',
    website: 'www.consultorio.com'
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setConsultorioInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular guardado
    setTimeout(() => {
      setLoading(false)
      alert('Configuración guardada exitosamente')
    }, 1000)
  }

  const handleExportData = () => {
    alert('Funcionalidad de exportación en desarrollo')
  }

  const handleBackupData = () => {
    alert('Funcionalidad de backup en desarrollo')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Configuración
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Consultorio */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Consultorio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Consultorio</label>
                <Input
                  name="name"
                  value={consultorioInfo.name}
                  onChange={handleChange}
                  placeholder="Nombre del consultorio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dirección</label>
                <Input
                  name="address"
                  value={consultorioInfo.address}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <Input
                  name="phone"
                  value={consultorioInfo.phone}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={consultorioInfo.email}
                  onChange={handleChange}
                  placeholder="Email de contacto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sitio Web</label>
                <Input
                  name="website"
                  value={consultorioInfo.website}
                  onChange={handleChange}
                  placeholder="www.sitio.com"
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Herramientas del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Herramientas del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Gestión de Datos</h3>
              <div className="space-y-2">
                <Button variant="outline" onClick={handleExportData} className="w-full">
                  Exportar Datos
                </Button>
                <Button variant="outline" onClick={handleBackupData} className="w-full">
                  Crear Backup
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Información del Sistema</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Versión: 1.0.0</p>
                <p>Base de datos: MySQL</p>
                <p>Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Recordatorio</h4>
              <p className="text-sm text-yellow-700">
                Recuerda hacer backups regulares de tu información para mantener 
                tus datos seguros.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
