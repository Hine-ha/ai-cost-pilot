import Link from "next/link";
import { FEEDBACK_FORM_URL } from "@/lib/links";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
            AI
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-slate-900">
            AI Cost Pilot
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/diagnose"
            className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-sky-800 hover:shadow-md"
          >
            診断を始める
          </Link>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-2 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            フィードバック
          </a>
        </nav>
      </div>
    </header>
  );
}
