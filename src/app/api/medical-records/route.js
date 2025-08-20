import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
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

    return NextResponse.json(medicalRecords)
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json({ error: 'Error fetching medical records' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
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

    return NextResponse.json(medicalRecord)
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json({ error: 'Error creating medical record' }, { status: 500 })
  }
}
