import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;

    if (!deviceId) {
      return NextResponse.json(
        { message: 'Device ID is required.' },
        { status: 400 }
      );
    }

    const device = await prisma.device.findUnique({
      where: { deviceId: deviceId },
      include: {
        statusLog: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!device) {
      return NextResponse.json(
        { message: 'Device not found.' },
        { status: 404 }
      );
    }

    const currentStatus = device.statusLog[0]?.status || null;
    const lastUpdatedAt = device.statusLog[0]?.timestamp || device.updatedAt;

    return NextResponse.json(
      {
        deviceId: device.deviceId,
        taskName: device.taskName,
        currentStatus: currentStatus,
        lastUpdatedAt: lastUpdatedAt.toISOString(),
        createdAt: device.createdAt.toISOString(),
        updatedAt: device.updatedAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching device details:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred while fetching device details.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;

    if (!deviceId) {
      return NextResponse.json(
        { message: 'Device ID is required.' },
        { status: 400 }
      );
    }

    // Check if the device exists before attempting to delete
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId: deviceId },
    });

    if (!existingDevice) {
      return NextResponse.json(
        { message: `Device with ID ${deviceId} not found.` },
        { status: 404 }
      );
    }

    // Delete the device. Due to onDelete: Cascade, related TaskStatusLog entries will also be deleted.
    await prisma.device.delete({
      where: { deviceId: deviceId },
    });

    return NextResponse.json(
      { message: 'Device and associated data deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting device:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: Record to delete does not exist. This case is already handled by findUnique above,
      // but keeping it for robustness or if logic changes.
      if (error.code === 'P2025') {
        return NextResponse.json(
          { message: `Device with ID not found for deletion.` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: 'An internal server error occurred while deleting the device.' },
      { status: 500 }
    );
  }
}
