import { parse } from 'csv-parse/sync';
import { prospectSchema } from '../growthos';
const allowed = ['name', 'website', 'industry', 'location', 'email', 'email_source', 'notes'];
export function parseProspectCsv(text: string) {
  if (Buffer.byteLength(text, 'utf8') > 65536) throw new Error('File too large');
  const rows = parse(text, {
    bom: true,
    columns: (headers: string[]) => {
      const keys = headers.map((h) => h.trim().toLowerCase());
      if (
        !keys.includes('name') ||
        keys.some((k) => !allowed.includes(k)) ||
        new Set(keys).size !== keys.length
      )
        throw new Error('Invalid headers');
      return keys;
    },
    skip_empty_lines: true,
    relax_column_count: false,
    trim: true,
    max_record_size: 10000,
  }) as Record<string, string>[];
  if (!rows.length || rows.length > 100) throw new Error('Provide 1 to 100 records');
  return rows.map((row) =>
    prospectSchema.parse(Object.fromEntries(allowed.map((key) => [key, row[key] ?? '']))),
  );
}
