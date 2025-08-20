'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido, {session?.user?.name || 'Usuario'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {session?.user?.email}
          </span>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
