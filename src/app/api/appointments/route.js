import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    console.log('🔄 Fetching appointments...')
    
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    let whereClause = {}
    
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      whereClause.date = {
        gte: startDate,
        lt: endDate
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
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
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    console.log(`✅ Found ${appointments.length} appointments`)
    return NextResponse.json(appointments)
    
  } catch (error) {
    console.error('❌ Error fetching appointments:', error)
    
    // Retornar array vacío en caso de error
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('🔄 Creating appointment for patient:', data.patientId)
    
    // Verificar conflictos de horario
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: new Date(data.date),
        doctorId: data.doctorId,
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } }
            ]
          }
        ]
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Ya existe un turno en ese horario' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        date: new Date(data.date)
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

    console.log('✅ Appointment created:', appointment.id)
    return NextResponse.json(appointment)
    
  } catch (error) {
    console.error('❌ Error creating appointment:', error)
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 })
  }
}
