"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardMessages } from "@/lib/i18n/dashboard";

export default function SdkConfigPanel({ t }: { t: DashboardMessages }) {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  if (!user?.id) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="mb-8 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-sky-950">{t.sdkConfigTitle}</h2>
      <p className="mt-1 text-sm text-sky-900/80">{t.sdkConfigDesc}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-sky-800/70">
            {t.userIdLabel}
          </p>
          <code className="mt-1 block overflow-x-auto rounded-lg bg-white px-3 py-2 font-mono text-sm text-slate-800 ring-1 ring-sky-100">
            {user.id}
          </code>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="shrink-0 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <p className="mt-3 font-mono text-xs text-sky-900/70">{t.sdkExample}</p>
    </section>
  );
}
