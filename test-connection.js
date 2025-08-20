const mysql = require('mysql2/promise')

async function testConnection() {
  const config = {
    host: '10.10.5.222',
    port: 3306,
    user: 'pbastias',
    password: 'PBast1@s.2024',
    database: 'consultorio_production'
  }

  try {
    console.log('🔄 Intentando conectar a MySQL...')
    console.log(`Host: ${config.host}:${config.port}`)
    console.log(`Usuario: ${config.user}`)
    console.log(`Database: ${config.database}`)
    
    const connection = await mysql.createConnection(config)
    console.log('✅ Conectado exitosamente a MySQL')
    
    // Probar consulta simple (corregida)
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time')
    console.log('✅ Consulta exitosa:', rows[0])
    
    // Verificar tablas existentes
    const [tables] = await connection.execute('SHOW TABLES')
    console.log('📋 Tablas en la base de datos:', tables.length)
    
    await connection.end()
    console.log('✅ Conexión cerrada correctamente')
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    console.error('Código de error:', error.code)
  }
}

testConnection()
