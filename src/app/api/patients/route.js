import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔄 Fetching patients...')
    
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            appointments: true,
            medicalRecords: true
          }
        }
      }
    })
    
    console.log(`✅ Found ${patients.length} patients`)
    return NextResponse.json(patients)
    
  } catch (error) {
    console.error('❌ Error fetching patients:', error)
    
    // Retornar array vacío en caso de error
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('🔄 Creating patient:', data.name, data.lastName)
    
    const patient = await prisma.patient.create({ 
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    })
    
    console.log('✅ Patient created:', patient.id)
    return NextResponse.json(patient)
    
  } catch (error) {
    console.error('❌ Error creating patient:', error)
    return NextResponse.json({ error: 'Error creating patient' }, { status: 500 })
  }
}
