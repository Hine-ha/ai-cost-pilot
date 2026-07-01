"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FEEDBACK_FORM_URL } from "@/lib/links";

function navLinkClass(isActive: boolean, hiddenOnMobile = false) {
  const base = hiddenOnMobile ? "hidden sm:inline-flex" : "inline-flex";
  const active =
    "bg-slate-100 font-semibold text-slate-900 ring-1 ring-slate-200";
  const inactive =
    "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return `${base} items-center rounded-lg px-2 py-2 transition ${isActive ? active : inactive}`;
}

export default function Header() {
  const pathname = usePathname();

  const isDocs = pathname === "/docs";
  const isDashboard = pathname === "/dashboard";
  const isDiagnose = pathname === "/diagnose";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/favicon.svg"
            alt="TokenLens"
            width={36}
            height={36}
            className="rounded-lg shadow-sm"
            priority
          />
          <span className="font-serif text-lg font-semibold tracking-tight text-slate-900">
            TokenLens
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <Link href="/docs" className={navLinkClass(isDocs, true)}>
            Docs
          </Link>
          <Link href="/dashboard" className={navLinkClass(isDashboard)}>
            ダッシュボード
          </Link>
          <Link
            href="/diagnose"
            className={`inline-flex items-center rounded-lg px-4 py-2 font-medium shadow-sm transition ${
              isDiagnose
                ? "bg-sky-800 text-white ring-2 ring-sky-300 ring-offset-1"
                : "bg-sky-700 text-white hover:bg-sky-800 hover:shadow-md"
            }`}
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
