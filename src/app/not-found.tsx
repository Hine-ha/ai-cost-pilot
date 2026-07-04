import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          ページが見つかりません
        </h1>
        <p className="mt-3 text-slate-600">
          診断機能（/diagnose、/results）は終了しました。TokenLens SDK と
          ダッシュボードをご利用ください。
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            ホーム
          </Link>
          <Link
            href="/docs"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            ダッシュボード
          </Link>
        </div>
      </main>
    </div>
  );
}
