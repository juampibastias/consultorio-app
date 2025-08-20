import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!medicalRecord) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 })
    }
    
    return NextResponse.json(medicalRecord)
  } catch (error) {
    console.error('Error fetching medical record:', error)
    return NextResponse.json({ error: 'Error fetching medical record' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const medicalRecord = await prisma.medicalRecord.update({
      where: { id: params.id },
      data: {
        ...data,
        consultationDate: data.consultationDate ? new Date(data.consultationDate) : undefined,
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
    console.error('Error updating medical record:', error)
    return NextResponse.json({ error: 'Error updating medical record' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.medicalRecord.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Medical record deleted successfully' })
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return NextResponse.json({ error: 'Error deleting medical record' }, { status: 500 })
  }
}
