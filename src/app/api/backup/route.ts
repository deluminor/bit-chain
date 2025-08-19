import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/libs/auth';
import { BackupService } from '@/lib/backup';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const filename = searchParams.get('filename');

    switch (action) {
      case 'list':
        const files = await BackupService.listBackupFiles();
        // Filter files to show only current user's backups
        const filteredFiles = files.filter(filename => filename.includes(`user_${currentUserId}_`));
        return NextResponse.json({ files: filteredFiles });

      case 'info':
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }
        const info = await BackupService.getBackupInfo(filename);
        return NextResponse.json({ info });

      case 'export':
        const backupData = await BackupService.exportAllData({
          userId: currentUserId,
          includeScreenshots: true,
        });

        return NextResponse.json(backupData, {
          headers: {
            'Content-Disposition': `attachment; filename="my_backup_${new Date().toISOString().split('T')[0]}.json"`,
            'Content-Type': 'application/json',
          },
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;

    const body = await request.json();
    const { action, overwrite = false, data } = body;

    switch (action) {
      case 'create':
        const backupPath = await BackupService.createFullBackup(currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Personal backup created successfully',
          path: backupPath,
        });

      case 'import':
        if (!data) {
          return NextResponse.json({ error: 'Backup data required' }, { status: 400 });
        }

        await BackupService.importData(data, { overwrite, userId: currentUserId });
        return NextResponse.json({
          success: true,
          message: 'Personal data imported successfully',
        });

      case 'restore':
        const { filename } = body;
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // Verify user can access this backup file
        if (!filename.includes(`user_${currentUserId}_`)) {
          return NextResponse.json({ error: 'Access denied to this backup' }, { status: 403 });
        }

        const backupData = await BackupService.loadBackupFromFile(filename);
        await BackupService.importData(backupData, { overwrite, userId: currentUserId });

        return NextResponse.json({
          success: true,
          message: 'Personal backup restored successfully',
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
