import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 5
        },
        medicalRecords: {
          orderBy: { consultationDate: 'desc' },
          take: 5
        }
      }
    })
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }
    
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json({ error: 'Error fetching patient' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    })
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json({ error: 'Error updating patient' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.patient.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Patient deleted successfully' })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Error deleting patient' }, { status: 500 })
  }
}
