const { PrismaClient } = require('@prisma/client')

async function checkUsers() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
  
  try {
    const users = await prisma.user.findMany()
    console.log('👥 Usuarios en la base de datos:')
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`)
    })
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
