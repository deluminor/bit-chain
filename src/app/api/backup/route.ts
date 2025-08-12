import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { BackupService } from '@/lib/backup';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const filename = searchParams.get('filename');

    switch (action) {
      case 'list':
        const files = await BackupService.listBackupFiles();
        return NextResponse.json({ files });

      case 'info':
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }
        const info = await BackupService.getBackupInfo(filename);
        return NextResponse.json({ info });

      case 'export':
        const backupData = await BackupService.exportAllData({
          userId: userId || undefined,
          includeScreenshots: true,
        });

        return NextResponse.json(backupData, {
          headers: {
            'Content-Disposition': `attachment; filename="backup_${new Date().toISOString().split('T')[0]}.json"`,
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
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, overwrite = false, data } = body;

    switch (action) {
      case 'create':
        const backupPath = await BackupService.createFullBackup(userId);
        return NextResponse.json({
          success: true,
          message: 'Backup created successfully',
          path: backupPath,
        });

      case 'import':
        if (!data) {
          return NextResponse.json({ error: 'Backup data required' }, { status: 400 });
        }

        await BackupService.importData(data, { overwrite });
        return NextResponse.json({
          success: true,
          message: 'Data imported successfully',
        });

      case 'restore':
        const { filename } = body;
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        const backupData = await BackupService.loadBackupFromFile(filename);
        await BackupService.importData(backupData, { overwrite });

        return NextResponse.json({
          success: true,
          message: 'Backup restored successfully',
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
