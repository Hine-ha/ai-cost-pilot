export interface CsvParseResult {
  headers: string[];
  rows: Record<string, string>[];
}

const REQUIRED_COLUMNS = [
  "timestamp",
  "model",
  "input_tokens",
  "output_tokens",
  "status",
  "latency_ms",
  "retries",
  "use_case",
] as const;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current.trim());
  return fields;
}

export function parseCsv(text: string): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSVにはヘッダー行と1行以上のデータが必要です。");
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });

  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(
      `必須列が不足しています: ${missing.join(", ")}`
    );
  }

  return { headers, rows };
}

export const SAMPLE_CSV = `timestamp,model,input_tokens,output_tokens,status,latency_ms,retries,use_case
2026-06-18T10:00:00Z,GPT-4.1,1200,500,success,1800,0,customer_support
2026-06-18T10:01:00Z,GPT-4.1,1600,700,error,3000,1,customer_support
2026-06-18T10:02:00Z,GPT-4.1 mini,800,300,success,1200,0,translation
2026-06-18T10:03:00Z,Claude Sonnet,2000,900,success,2400,0,document_analysis
2026-06-18T10:04:00Z,DeepSeek Chat,900,250,error,2200,2,summarization`;

export function downloadSampleCsv(): void {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-cost-pilot-sample.csv";
  link.click();
  URL.revokeObjectURL(url);
}
