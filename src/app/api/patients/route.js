import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Error fetching patients' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const patient = await prisma.patient.create({ 
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    })
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Error creating patient' }, { status: 500 })
  }
}
