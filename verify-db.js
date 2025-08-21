const { PrismaClient } = require('@prisma/client')

async function verifyDatabase() {
  const prisma = new PrismaClient() // sin datasources

  try {
    console.log('🔄 Verificando conexión a la base de datos...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa')

    const userCount = await prisma.user.count()
    const patientCount = await prisma.patient.count()
    const appointmentCount = await prisma.appointment.count()
    const recordCount = await prisma.medicalRecord.count()

    console.log('📊 Estadísticas:')
    console.log(`- Usuarios: ${userCount}`)
    console.log(`- Pacientes: ${patientCount}`)
    console.log(`- Turnos: ${appointmentCount}`)
    console.log(`- Historias clínicas: ${recordCount}`)

    try {
      const testPatient = await prisma.patient.create({
        data: {
          dni: '87654321',
          name: 'Paciente',
          lastName: 'Prisma',
          email: 'prisma@test.com'
        }
      })
      console.log('✅ Creación con Prisma exitosa:', testPatient.id)

      await prisma.patient.delete({ where: { id: testPatient.id } })
      console.log('🗑️ Paciente de Prisma eliminado')
    } catch (error) {
      console.error('❌ Error con Prisma:', error.message)
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
