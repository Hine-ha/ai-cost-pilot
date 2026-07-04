import Link from "next/link";
import {
  ChartBarIcon,
  CodeBracketIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import FeatureCard from "@/components/FeatureCard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="bg-gradient-to-b from-slate-50 to-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
              生成AIを業務利用する企業向け
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              生成AI APIコストを見える化し、
              <br className="hidden sm:block" />
              無駄な支出を削減
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-600">
              TokenLens SDK で Anthropic / OpenAI の API 利用量とコストを自動記録。
              ダッシュボードでプロジェクト別の推移と Prompt Caching による削減額を確認できます。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex items-center rounded-xl bg-sky-700 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-sky-900/10 transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg hover:shadow-sky-900/15"
              >
                SDK ドキュメントを見る
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                ダッシュボード
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                主な機能
              </h2>
              <p className="mt-3 text-slate-600">
                2 行のコードで API コストの可視化とキャッシュ削減の追跡
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={CodeBracketIcon}
                title="SDK 自動トラッキング"
                description="track() でクライアントをラップするだけ。トークン数・コスト・キャッシュヒットを自動送信します。"
              />
              <FeatureCard
                icon={ChartBarIcon}
                title="リアルタイムダッシュボード"
                description="プロジェクト別のリクエスト数、モデル別コスト、30 日間の支出トレンドを一覧表示。"
              />
              <FeatureCard
                icon={LightBulbIcon}
                title="Prompt Caching 削減額"
                description="cache_read_tokens からキャッシュによる節約金額を自動計算し、ダッシュボードに表示。"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        © 2026 TokenLens. All rights reserved.
      </footer>
    </div>
  );
}
