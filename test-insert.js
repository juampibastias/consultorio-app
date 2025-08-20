const mysql = require('mysql2/promise')

async function testInsert() {
  const connection = await mysql.createConnection({
    host: '10.10.5.222',
    port: 3306,
    user: 'pbastias',
    password: 'PBast1@s.2024',
    database: 'consultorio_production'
  })

  try {
    console.log('🔄 Probando inserción directa...')
    
    // Generar ID único
    const id = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    
    // Insertar paciente de prueba
    await connection.execute(
      'INSERT INTO Patient (id, dni, name, lastName, email, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [id, '99999999', 'Paciente', 'Prueba', 'test@test.com']
    )
    
    console.log('✅ Inserción exitosa')
    
    // Verificar que se insertó
    const [rows] = await connection.execute('SELECT * FROM Patient WHERE id = ?', [id])
    console.log('📋 Paciente insertado:', rows[0])
    
    // Eliminar paciente de prueba
    await connection.execute('DELETE FROM Patient WHERE id = ?', [id])
    console.log('🗑️ Paciente de prueba eliminado')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await connection.end()
  }
}

testInsert()
