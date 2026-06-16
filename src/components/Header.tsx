import Link from "next/link";
import { FEEDBACK_FORM_URL } from "@/lib/links";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            AI
          </div>
          <span className="text-lg font-semibold text-gray-900">
            AI Cost Pilot
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/diagnose"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            診断を始める
          </Link>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-2 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            フィードバック
          </a>
        </nav>
      </div>
    </header>
  );
}
