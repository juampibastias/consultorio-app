import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    console.log('🔄 Fetching medical records...')
    
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const doctorId = searchParams.get('doctorId')
    
    let whereClause = {}
    
    if (patientId) {
      whereClause.patientId = patientId
    }
    
    if (doctorId) {
      whereClause.doctorId = doctorId
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            lastName: true,
            dni: true,
            birthDate: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { consultationDate: 'desc' }
    })

    console.log(`✅ Found ${medicalRecords.length} medical records`)
    return NextResponse.json(medicalRecords)
    
  } catch (error) {
    console.error('❌ Error fetching medical records:', error)
    
    // Retornar array vacío en caso de error
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('🔄 Creating medical record for patient:', data.patientId)
    
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        ...data,
        consultationDate: data.consultationDate ? new Date(data.consultationDate) : new Date(),
        prescriptions: data.prescriptions || null,
        attachments: data.attachments || null
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            lastName: true,
            dni: true,
            birthDate: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Medical record created:', medicalRecord.id)
    return NextResponse.json(medicalRecord)
    
  } catch (error) {
    console.error('❌ Error creating medical record:', error)
    return NextResponse.json({ error: 'Error creating medical record' }, { status: 500 })
  }
}
