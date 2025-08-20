const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Crear doctor por defecto si no existe
  const existingDoctor = await prisma.user.findUnique({
    where: { email: 'admin@consultorio.com' }
  })

  if (!existingDoctor) {
    await prisma.user.create({
      data: {
        email: 'admin@consultorio.com',
        name: 'Dr. Administrador',
        role: 'DOCTOR'
      }
    })
    console.log('✅ Doctor por defecto creado')
  } else {
    console.log('✅ Doctor por defecto ya existe')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
