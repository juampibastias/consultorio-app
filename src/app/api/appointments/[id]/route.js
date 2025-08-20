import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const appointment = await prisma.appointment.findUnique({
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
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Error fetching appointment' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            lastName: true,
            dni: true,
            phone: true
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
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Error deleting appointment' }, { status: 500 })
  }
}
