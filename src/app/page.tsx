import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              B2B SaaS 向け AI コスト最適化
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              生成AIコスト診断ツール
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-gray-600">
              LLM API
              の利用料、失敗リクエスト、過剰なトークン消費を可視化し、削減ポイントを提案します。
            </p>
            <div className="mt-10">
              <Link
                href="/diagnose"
                className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                無料で診断を始める
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                主な機能
              </h2>
              <p className="mt-3 text-gray-600">
                API コストの見える化から削減施策まで、ワンストップで診断
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon="📊"
                title="AI API コストの可視化"
                description="モデル別・ユースケース別に月次コストを試算。トークン単価に基づいた正確な見積もりを提供します。"
              />
              <FeatureCard
                icon="⚠️"
                title="失敗リクエストと再試行コストの検出"
                description="失敗率と再試行回数から、無駄な API 呼び出しコストを特定。改善余地を数値で把握できます。"
              />
              <FeatureCard
                icon="💡"
                title="モデル切替とキャッシュによる削減提案"
                description="より低コストなモデルへの切替やキャッシュ導入など、具体的な削減シナリオを自動提案します。"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              3 分でコスト診断を完了
            </h2>
            <p className="mt-3 text-gray-600">
              プロジェクト情報と API 利用状況を入力するだけで、すぐに診断結果を確認できます。
            </p>
            <Link
              href="/diagnose"
              className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              無料で診断を始める
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        © 2026 AI Cost Pilot. All rights reserved.
      </footer>
    </div>
  );
}
