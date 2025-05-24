import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { deviceId, status, timestamp } = await request.json();

    // 1. Input validation
    if (!deviceId || !status || !timestamp) {
      return NextResponse.json(
        { message: 'Device ID, status, and timestamp are required.' },
        { status: 400 }
      );
    }

    // Validate status value
    if (status !== 'DONE' && status !== 'NOT_DONE') {
      return NextResponse.json(
        { message: 'Status must be either "DONE" or "NOT_DONE".' },
        { status: 400 }
      );
    }

    // Validate timestamp format (basic check, more robust validation might be needed)
    if (isNaN(new Date(timestamp).getTime())) {
      return NextResponse.json(
        { message: 'Invalid timestamp format.' },
        { status: 400 }
      );
    }

    // 2. Check if deviceId exists (Integrity check as per API spec)
    const device = await prisma.device.findUnique({
      where: { deviceId: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { message: `Device with ID ${deviceId} not found.` },
        { status: 404 }
      );
    }

    // 3. Save the status log
    const newLog = await prisma.taskStatusLog.create({
      data: {
        deviceId: deviceId,
        status: status,
        timestamp: new Date(timestamp),
      },
    });

    return NextResponse.json(
      {
        message: 'Status recorded successfully.',
        log: {
          logId: newLog.logId,
          deviceId: newLog.deviceId,
          timestamp: newLog.timestamp.toISOString(),
          status: newLog.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error recording status:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
