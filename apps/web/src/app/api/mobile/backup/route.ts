import { BackupService } from '@/lib/backup';
import { getMobileUser } from '@/lib/mobile-auth';
import {
  err,
  ok,
  type BackupListResponse,
  type CreateBackupResponse,
} from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/backup?action=list|export
 *
 * - list: Returns a list of all backup files for the user
 * - export: Returns full data export as JSON attachment
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  const { searchParams } = request.nextUrl;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'list': {
        const backups = await BackupService.listBackups(user.id);
        const filesWithInfo = await Promise.all(
          backups.map(b => BackupService.getBackupInfo(b.filename, user.id)),
        );

        const validFiles = filesWithInfo.filter(Boolean) as NonNullable<
          Awaited<ReturnType<typeof BackupService.getBackupInfo>>
        >[];

        const payload: BackupListResponse = {
          backups: validFiles.map(f => ({
            filename: f.filename,
            createdAt:
              f.createdAt instanceof Date ? f.createdAt.toISOString() : String(f.createdAt),
            sizeMb: typeof f.size === 'number' ? f.size : 0,
          })),
        };

        return NextResponse.json(ok(payload), { status: 200 });
      }

      case 'export': {
        const backupData = await BackupService.exportAllData({
          userId: user.id,
          includeScreenshots: false,
        });

        return NextResponse.json(backupData, {
          headers: {
            'Content-Disposition': `attachment; filename="backup_${new Date().toISOString().split('T')[0]}.json"`,
            'Content-Type': 'application/json',
          },
        });
      }

      default:
        return NextResponse.json(err('VALIDATION_ERROR', 'Invalid action. Use list or export'), {
          status: 400,
        });
    }
  } catch (error) {
    console.error('[mobile/backup] GET error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Backup operation failed'), { status: 500 });
  }
}

/**
 * POST /api/mobile/backup
 *
 * Body: { action: 'create' }
 *
 * Creates a new full backup for the user and saves it to the database.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body = await request.json();

    if (body.action !== 'create') {
      return NextResponse.json(
        err('VALIDATION_ERROR', 'Invalid action. Only "create" is supported'),
        { status: 400 },
      );
    }

    const filename = await BackupService.createFullBackup(user.id);

    const payload: CreateBackupResponse = {
      success: true,
      filename,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(ok(payload), { status: 201 });
  } catch (error) {
    console.error('[mobile/backup] POST error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to create backup'), { status: 500 });
  }
}
