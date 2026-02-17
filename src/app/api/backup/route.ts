import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/libs/auth';
import { BackupService } from '@/lib/backup';

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
      case 'list': {
        const backups = await BackupService.listBackups(currentUserId);
        const filesWithInfo = await Promise.all(
          backups.map(b => BackupService.getBackupInfo(b.filename, currentUserId)),
        );
        return NextResponse.json({ files: filesWithInfo.filter(Boolean) });
      }

      case 'info': {
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }
        const info = await BackupService.getBackupInfo(filename, currentUserId);
        if (!info) {
          return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
        }
        return NextResponse.json({ info });
      }

      case 'export': {
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
      }

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
      case 'create': {
        const backupFilename = await BackupService.createFullBackup(currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Personal backup created successfully',
          filename: backupFilename,
        });
      }

      case 'import': {
        if (!data) {
          return NextResponse.json({ error: 'Backup data required' }, { status: 400 });
        }
        await BackupService.importData(data, { overwrite, userId: currentUserId });
        return NextResponse.json({
          success: true,
          message: 'Personal data imported successfully',
        });
      }

      case 'delete': {
        const deleteFilename = body.filename;
        if (!deleteFilename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }
        await BackupService.deleteBackup(deleteFilename, currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Backup deleted successfully',
        });
      }

      case 'restore': {
        const { filename } = body;
        if (!filename) {
          return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }
        const backupData = await BackupService.loadBackupFromDb(filename, currentUserId);
        await BackupService.importData(backupData, { overwrite, userId: currentUserId });
        return NextResponse.json({
          success: true,
          message: 'Personal backup restored successfully',
        });
      }

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
