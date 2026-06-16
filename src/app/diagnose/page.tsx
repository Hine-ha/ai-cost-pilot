"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { MODEL_OPTIONS, USE_CASE_OPTIONS } from "@/lib/pricing";
import { saveCostInput } from "@/lib/storage";
import { CostInput, ModelId, UseCase } from "@/types";

const defaultForm: CostInput = {
  projectName: "",
  model: "gpt-4.1",
  monthlyRequests: 10000,
  averageInputTokens: 800,
  averageOutputTokens: 400,
  failureRate: 5,
  averageRetries: 1,
  useCase: "カスタマーサポート",
  hasCache: false,
  hasRag: false,
  hasAgent: false,
};

export default function DiagnosePage() {
  const router = useRouter();
  const [form, setForm] = useState<CostInput>(defaultForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveCostInput(form);
    router.push("/results");
  };

  const updateNumber = (field: keyof CostInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : Number(value),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">コスト診断入力</h1>
          <p className="mt-2 text-gray-600">
            プロジェクトの利用状況を入力してください。診断結果はすぐに表示されます。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              基本情報
            </h2>

            <div>
              <label
                htmlFor="projectName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                プロジェクト名
              </label>
              <input
                id="projectName"
                type="text"
                required
                value={form.projectName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, projectName: e.target.value }))
                }
                placeholder="例: カスタマーサポートボット"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="model"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  使用モデル
                </label>
                <select
                  id="model"
                  value={form.model}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      model: e.target.value as ModelId,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="useCase"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  利用シーン
                </label>
                <select
                  id="useCase"
                  value={form.useCase}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      useCase: e.target.value as UseCase,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {USE_CASE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              利用量
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="monthlyRequests"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  月間リクエスト数
                </label>
                <input
                  id="monthlyRequests"
                  type="number"
                  min={1}
                  required
                  value={form.monthlyRequests}
                  onChange={(e) =>
                    updateNumber("monthlyRequests", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="failureRate"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  失敗率 (%)
                </label>
                <input
                  id="failureRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  required
                  value={form.failureRate}
                  onChange={(e) => updateNumber("failureRate", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="averageInputTokens"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  平均入力トークン数
                </label>
                <input
                  id="averageInputTokens"
                  type="number"
                  min={1}
                  required
                  value={form.averageInputTokens}
                  onChange={(e) =>
                    updateNumber("averageInputTokens", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="averageOutputTokens"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  平均出力トークン数
                </label>
                <input
                  id="averageOutputTokens"
                  type="number"
                  min={1}
                  required
                  value={form.averageOutputTokens}
                  onChange={(e) =>
                    updateNumber("averageOutputTokens", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="averageRetries"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  平均再試行回数
                </label>
                <input
                  id="averageRetries"
                  type="number"
                  min={0}
                  step={0.1}
                  required
                  value={form.averageRetries}
                  onChange={(e) =>
                    updateNumber("averageRetries", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              構成オプション
            </h2>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={form.hasCache}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      hasCache: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    キャッシュを利用
                  </span>
                  <p className="text-sm text-gray-500">
                    同一・類似リクエストの応答を再利用し、入力トークンを削減します
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={form.hasRag}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, hasRag: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    検索拡張生成を利用
                  </span>
                  <p className="text-sm text-gray-500">
                    関連情報の検索により、入力コンテキストが増加します
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={form.hasAgent}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      hasAgent: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    エージェント構成
                  </span>
                  <p className="text-sm text-gray-500">
                    複数ステップの推論により、呼び出し回数が増加します
                  </p>
                </div>
              </label>
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-700"
          >
            診断結果を見る
          </button>
        </form>
      </main>
    </div>
  );
}
