import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

interface RegisterDeviceRequestBody {
    deviceId: string;
    taskName: string;
}

// POST /api/devices
// Register a new device
// Request body: { deviceId: string, taskName: string }
// Response: { message: string, device?: Device }
export async function POST(request: Request) {
    try {
        const body: RegisterDeviceRequestBody = await request.json();
        const { deviceId, taskName } = body;

        // Validate the request body
        if (!deviceId || !taskName) {
            return NextResponse.json(
                { error: 'Device ID and task name are required.' },
                { status: 400 }
            );
        }
        if (typeof deviceId !== 'string' || deviceId.trim() === '' ||
            typeof taskName !== 'string' || taskName.trim() === '') {
            return NextResponse.json(
                { error: 'Invalid device ID or task name.' },
                { status: 400 }
            );
        }

        // Check if the device already exists
        const exisitingDevice = await prisma.device.findUnique({
            where: { deviceId },
        });

        if (exisitingDevice) {
            return NextResponse.json(
                { error: 'This device ID already exists.' },
                { status: 409 }
            );
        }

        // Create a new device
        const newDevice = await prisma.device.create({
            data: {
                deviceId,
                taskName,
                // createdAt, updatedAt are automatically managed by Prisma
            },
        });

        return NextResponse.json(
            { message: 'Device registered successfully.', device: newDevice },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error registering device:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON format.' },
                { status: 400 }
            );
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors, some cases that cannot be catched by above
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Unique constraint constraint failed. Device ID already exists (DB Level).' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'Database error occurred.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'An internal server error occurred while registering the device.' },
            { status: 500 }
        );
    }
}


// GET /api/devices
// Get all devices
export async function GET() {
    try {
        const devices = await prisma.device.findMany({
            orderBy: {createdAt: 'desc'},
        });

        // Get the latest device status from TaskStatusLog table
        const deviceWithStatus = await Promise.all(
            devices.map(async (device) => {
                const latestLog = await prisma.taskStatusLog.findFirst({
                    where: { deviceId: device.deviceId },
                    orderBy: { timestamp: 'desc' },
                });
                return {
                    deviceId: device.deviceId,
                    taskName: device.taskName,
                    currentStatus: latestLog?.status || 'NOT_DONE',
                    lastUpdatedAt: latestLog?.timestamp.toISOString() || device.updatedAt.toISOString(),
                };
            })
        );

        return NextResponse.json(
            { devices: deviceWithStatus },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching devices:', error);
        return NextResponse.json(
            { error: 'An internal server error occurred while fetching devices.' },
            { status: 500 }
        );
    }
}
