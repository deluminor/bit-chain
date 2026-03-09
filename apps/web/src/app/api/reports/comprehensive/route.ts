import { authOptions } from '@/features/auth/libs/auth';
import {
  ComprehensiveReportServiceError,
  generateComprehensiveReportDocument,
  type ComprehensiveReportFormat,
} from '@/features/reports/services/comprehensive-report.service';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

function parseOutputFormat(value: string | null): ComprehensiveReportFormat {
  return value === 'markdown' ? 'markdown' : 'json';
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') ?? undefined;
    const dateTo = searchParams.get('dateTo') ?? undefined;
    const formatType = parseOutputFormat(searchParams.get('format'));

    const report = await generateComprehensiveReportDocument(
      session.user.email,
      dateFrom,
      dateTo,
      formatType,
    );

    return new Response(report.content, {
      headers: {
        'Content-Type': report.contentType,
        'Content-Disposition': `attachment; filename="${report.fileName}"`,
      },
    });
  } catch (error) {
    if (error instanceof ComprehensiveReportServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error generating comprehensive report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
