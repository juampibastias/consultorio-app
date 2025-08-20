'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊'
  },
  {
    name: 'Pacientes',
    href: '/dashboard/patients',
    icon: '👥'
  },
  {
    name: 'Turnos',
    href: '/dashboard/appointments',
    icon: '📅'
  },
  {
    name: 'Historia Clínica',
    href: '/dashboard/medical-records',
    icon: '📋'
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: '⚙️'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">
          Consultorio App
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Sistema de Gestión Médica
        </p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
              pathname === item.href && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
            )}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 text-xs text-gray-500">
        <p>© 2025 Consultorio App</p>
        <p>Versión 1.0.0</p>
      </div>
    </div>
  )
}
