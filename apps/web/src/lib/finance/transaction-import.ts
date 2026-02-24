export type CsvSource = 'REVOLUT' | 'MONOBANK' | 'UNKNOWN';

export interface ParsedCsvRow {
  date: Date;
  description: string;
  amount: number;
  currency: string;
  fallbackAmount?: number;
  fallbackCurrency?: string;
  source: CsvSource;
}

export interface ParsedCsvResult {
  source: CsvSource;
  rows: ParsedCsvRow[];
  skipped: number;
  errors: string[];
}

const CSV_BOM = '\ufeff';

const normalizeHeader = (value: string) => value.replace(CSV_BOM, '').trim();

const isEmDash = (value: string) => value.length === 1 && value.charCodeAt(0) === 8212;

const parseNumber = (value: string | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || isEmDash(trimmed)) return null;
  const normalized = trimmed.replace(/\s+/g, '').replace(/,/g, '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseRevolutDate = (value: string) => {
  const normalized = value.trim().replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseMonobankDate = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const [datePart, timePart] = trimmed.split(' ');
  if (!datePart || !timePart) return null;
  const [day, month, year] = datePart.split('.');
  if (!day || !month || !year) return null;
  const isoLike = `${year}-${month}-${day}T${timePart}`;
  const parsed = new Date(isoLike);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseCsv = (content: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  const flushField = () => {
    currentRow.push(currentField);
    currentField = '';
  };

  const flushRow = () => {
    if (currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
    }
  };

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      flushField();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      flushField();
      flushRow();
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    flushField();
    flushRow();
  }

  return rows;
};

const detectSource = (headers: string[]): CsvSource => {
  const normalized = headers.map(header => normalizeHeader(header));
  if (normalized.includes('Type') && normalized.includes('Completed Date')) {
    return 'REVOLUT';
  }
  if (normalized.includes('Дата i час операції') || normalized.includes('Деталі операції')) {
    return 'MONOBANK';
  }
  return 'UNKNOWN';
};

const getHeaderIndex = (headers: string[], name: string) =>
  headers.findIndex(header => normalizeHeader(header) === name);

export const parseTransactionsCsv = (content: string): ParsedCsvResult => {
  const rows = parseCsv(content);
  if (rows.length === 0) {
    return { source: 'UNKNOWN', rows: [], skipped: 0, errors: ['CSV is empty'] };
  }

  const headers = (rows[0] ?? []).map(header => normalizeHeader(header));
  const source = detectSource(headers);

  if (source === 'UNKNOWN') {
    return {
      source,
      rows: [],
      skipped: rows.length - 1,
      errors: ['Unsupported CSV format'],
    };
  }

  const parsedRows: ParsedCsvRow[] = [];
  let skipped = 0;
  const errors: string[] = [];

  if (source === 'REVOLUT') {
    const dateIndex = getHeaderIndex(headers, 'Completed Date');
    const fallbackDateIndex = getHeaderIndex(headers, 'Started Date');
    const descriptionIndex = getHeaderIndex(headers, 'Description');
    const amountIndex = getHeaderIndex(headers, 'Amount');
    const currencyIndex = getHeaderIndex(headers, 'Currency');
    const stateIndex = getHeaderIndex(headers, 'State');

    rows.slice(1).forEach(row => {
      const state = row[stateIndex]?.trim();
      if (state && state !== 'COMPLETED') {
        skipped += 1;
        return;
      }

      const dateValue = row[dateIndex] || row[fallbackDateIndex] || '';
      const date = parseRevolutDate(dateValue);
      const amount = parseNumber(row[amountIndex]);
      const currency = row[currencyIndex]?.trim();
      const description = row[descriptionIndex]?.trim() || 'Imported transaction';

      if (!date || amount == null || !currency) {
        skipped += 1;
        return;
      }

      parsedRows.push({
        date,
        description,
        amount,
        currency: currency.toUpperCase(),
        source,
      });
    });
  }

  if (source === 'MONOBANK') {
    const dateIndex = getHeaderIndex(headers, 'Дата i час операції');
    const descriptionIndex = getHeaderIndex(headers, 'Деталі операції');
    const amountCardIndex = getHeaderIndex(headers, 'Сума в валюті картки (UAH)');
    const amountOperationIndex = getHeaderIndex(headers, 'Сума в валюті операції');
    const currencyIndex = getHeaderIndex(headers, 'Валюта');

    rows.slice(1).forEach(row => {
      const dateValue = row[dateIndex] || '';
      const date = parseMonobankDate(dateValue);
      const description = row[descriptionIndex]?.trim() || 'Imported transaction';
      const operationAmount = parseNumber(row[amountOperationIndex]);
      const cardAmount = parseNumber(row[amountCardIndex]);
      const currencyRaw = row[currencyIndex]?.trim();

      if (!date || (operationAmount == null && cardAmount == null)) {
        skipped += 1;
        return;
      }

      const currency = currencyRaw && !isEmDash(currencyRaw) ? currencyRaw : 'UAH';

      parsedRows.push({
        date,
        description,
        amount: operationAmount ?? cardAmount ?? 0,
        currency: currency.toUpperCase(),
        fallbackAmount: cardAmount ?? undefined,
        fallbackCurrency: cardAmount != null ? 'UAH' : undefined,
        source,
      });
    });
  }

  if (parsedRows.length === 0) {
    errors.push('No valid rows parsed');
  }

  return { source, rows: parsedRows, skipped, errors };
};

export interface ImportKeyInput {
  accountId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  description: string;
  date: Date;
}

const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

const normalizeDateToMinute = (value: Date) => {
  const normalized = new Date(value);
  normalized.setSeconds(0, 0);
  return normalized.toISOString();
};

export const createImportKey = ({
  accountId,
  type,
  amount,
  currency,
  description,
  date,
}: ImportKeyInput) => {
  const normalizedDescription = normalizeText(description || '');
  const normalizedCurrency = currency.toUpperCase();
  const normalizedAmount = amount.toFixed(2);
  const normalizedDate = normalizeDateToMinute(date);
  return `${accountId}|${type}|${normalizedAmount}|${normalizedCurrency}|${normalizedDate}|${normalizedDescription}`;
};
