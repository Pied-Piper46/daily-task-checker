import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string) : undefined;
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'; // Default to 'desc'

    // 1. Input validation
    if (!deviceId) {
      return NextResponse.json(
        { message: 'Device ID is required.' },
        { status: 400 }
      );
    }

    // 2. Check if the device exists and get its taskName
    const device = await prisma.device.findUnique({
      where: { deviceId: deviceId },
      select: { taskName: true }, // Only fetch taskName
    });

    if (!device) {
      return NextResponse.json(
        { message: `Device with ID ${deviceId} not found.` },
        { status: 404 }
      );
    }

    // Build Prisma query conditions
    const whereClause: Prisma.TaskStatusLogWhereInput = {
      deviceId: deviceId,
    };

    if (startDate || endDate) {
      whereClause.timestamp = {}; // Initialize as an empty object if date filters are present
    }

    if (startDate) {
      (whereClause.timestamp as Prisma.DateTimeFilter).gte = new Date(startDate);
    }
    if (endDate) {
      (whereClause.timestamp as Prisma.DateTimeFilter).lte = new Date(endDate + 'T23:59:59.999Z'); // Include the whole end day
    }

    // 3. Fetch history logs
    const historyLogs = await prisma.taskStatusLog.findMany({
      where: whereClause,
      orderBy: { timestamp: order },
      take: limit,
      skip: offset,
    });

    // 4. Prepare response
    const history = historyLogs.map(log => ({
      logId: log.logId,
      timestamp: log.timestamp.toISOString(),
      status: log.status,
    }));

    // Optional: Add pagination info if limit/offset are used
    let pageInfo = {};
    if (limit !== undefined || offset !== undefined) {
      const totalCount = await prisma.taskStatusLog.count({ where: whereClause });
      const currentPage = offset !== undefined && limit !== undefined ? Math.floor(offset / limit) + 1 : 1;
      const totalPages = limit !== undefined ? Math.ceil(totalCount / limit) : 1;
      pageInfo = {
        totalCount,
        currentPage,
        totalPages,
        hasNextPage: limit !== undefined && (offset || 0) + limit < totalCount,
        hasPreviousPage: offset !== undefined && offset > 0,
      };
    }

    return NextResponse.json(
      {
        deviceId: deviceId,
        taskName: device.taskName,
        history: history,
        pageInfo: Object.keys(pageInfo).length > 0 ? pageInfo : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching device history:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Record not found (though handled by findUnique above)
        return NextResponse.json(
          { message: `Device with ID not found for history.` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: 'An internal server error occurred while fetching device history.' },
      { status: 500 }
    );
  }
}
