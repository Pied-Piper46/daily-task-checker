import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const { taskName, resetHistory } = await request.json();

    // 1. Input validation
    if (!deviceId) {
      return NextResponse.json(
        { message: 'Device ID is required.' },
        { status: 400 }
      );
    }
    if (typeof taskName !== 'string' || taskName.trim() === '') {
      return NextResponse.json(
        { message: 'Task name is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // 2. Check if the device exists
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceId },
    });

    if (!existingDevice) {
      return NextResponse.json(
        { message: `Device with ID ${deviceId} not found.` },
        { status: 404 }
      );
    }

    // 3. Update the task name
    const updatedDevice = await prisma.device.update({
      where: { deviceId: deviceId },
      data: {
        taskName: taskName,
      },
    });

    // 4. Optionally reset history
    if (resetHistory === true) {
      await prisma.taskStatusLog.deleteMany({
        where: { deviceId: deviceId },
      });
    }

    return NextResponse.json(
      {
        message: 'Device information updated successfully.',
        device: {
          deviceId: updatedDevice.deviceId,
          taskName: updatedDevice.taskName,
          createdAt: updatedDevice.createdAt.toISOString(),
          updatedAt: updatedDevice.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task name:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Record to update does not exist
        return NextResponse.json(
          { message: `Device with ID not found for update.` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: 'An internal server error occurred while updating the task name.' },
      { status: 500 }
    );
  }
}
