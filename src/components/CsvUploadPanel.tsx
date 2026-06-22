"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeCsvRows } from "@/lib/csv-calculator";
import { downloadSampleCsv, parseCsv, SAMPLE_CSV } from "@/lib/csv-parser";
import { saveCsvDiagnosis } from "@/lib/storage";

export default function CsvUploadPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError(".csv ファイルのみアップロードできます。");
      return;
    }

    setError(null);
    setWarning(null);
    setFileName(file.name);

    const resolvedProjectName =
      projectName.trim() || file.name.replace(/\.csv$/i, "");
    if (!projectName.trim()) {
      setProjectName(resolvedProjectName);
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      const result = analyzeCsvRows(parsed.rows);

      if (result.hasUnknownModels) {
        setWarning("一部のモデル料金が未登録のため、正確に計算できません。");
      }

      saveCsvDiagnosis(resolvedProjectName, result);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "CSVの解析に失敗しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-sm leading-relaxed text-gray-600">
          API利用ログのCSVをアップロードすると、リクエスト数、トークン数、失敗率、再試行コストを自動で診断できます。
        </p>
      </div>

      <div>
        <label
          htmlFor="csvProjectName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          プロジェクト名
        </label>
        <input
          id="csvProjectName"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="例: カスタマーサポート API ログ"
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onFileChange}
          className="hidden"
        />
        <p className="text-sm font-medium text-gray-900">
          CSVファイルをドラッグ＆ドロップ
        </p>
        <p className="mt-1 text-sm text-gray-500">または</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isProcessing ? "解析中..." : "ファイルを選択"}
        </button>
        {fileName && (
          <p className="mt-3 text-xs text-gray-500">選択中: {fileName}</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {warning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {warning}
        </div>
      )}

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            CSVフォーマット（サンプル）
          </h3>
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            サンプルCSVをダウンロード
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50">
          <pre className="p-4 text-xs leading-relaxed text-gray-700">
            {SAMPLE_CSV}
          </pre>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          必須列: timestamp, model, input_tokens, output_tokens, status,
          latency_ms, retries, use_case
        </p>
      </div>
    </div>
  );
}
