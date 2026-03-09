import { format } from 'date-fns';
import { buildComprehensiveReport } from './comprehensive-report.aggregate';
import { fetchComprehensiveReportData, findOrCreateReportUser } from './comprehensive-report.data';
import { formatComprehensiveReportAsMarkdown } from './comprehensive-report.markdown';
import type {
  ComprehensiveReportDocument,
  ComprehensiveReportFormat,
} from './comprehensive-report.types';
import { ComprehensiveReportServiceError } from './comprehensive-report.types';

export type { ComprehensiveReportDocument, ComprehensiveReportFormat };
export { ComprehensiveReportServiceError };

/**
 * Generate comprehensive report document (JSON or Markdown) for user email.
 */
export async function generateComprehensiveReportDocument(
  email: string,
  dateFrom?: string,
  dateTo?: string,
  formatType: ComprehensiveReportFormat = 'json',
): Promise<ComprehensiveReportDocument> {
  if (!email) {
    throw new ComprehensiveReportServiceError('Unauthorized', 401);
  }

  const user = await findOrCreateReportUser(email);
  const data = await fetchComprehensiveReportData(user.id, dateFrom, dateTo);
  const report = await buildComprehensiveReport(data, dateFrom, dateTo);
  const reportDate = format(new Date(), 'yyyy-MM-dd');

  if (formatType === 'markdown') {
    return {
      content: formatComprehensiveReportAsMarkdown(report),
      contentType: 'text/markdown; charset=utf-8',
      fileName: `financial-report-${reportDate}.md`,
    };
  }

  return {
    content: JSON.stringify(report, null, 2),
    contentType: 'application/json; charset=utf-8',
    fileName: `financial-report-${reportDate}.json`,
  };
}
