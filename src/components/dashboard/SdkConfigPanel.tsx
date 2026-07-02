"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DashboardMessages } from "@/lib/i18n/dashboard";

function CopyField({
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-800/70">
          {label}
        </p>
        <code className="mt-1 block overflow-x-auto rounded-lg bg-white px-3 py-2 font-mono text-sm text-slate-800 ring-1 ring-sky-100">
          {value}
        </code>
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="shrink-0 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export default function SdkConfigPanel({ t }: { t: DashboardMessages }) {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyError, setApiKeyError] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const load = async () => {
      setApiKeyLoading(true);
      setApiKeyError(false);
      try {
        const response = await fetch("/api/dashboard/sdk-config", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("failed");
        const payload = (await response.json()) as {
          api_key: string | null;
          configured: boolean;
        };
        if (!cancelled) {
          setApiKey(payload.api_key);
        }
      } catch {
        if (!cancelled) setApiKeyError(true);
      } finally {
        if (!cancelled) setApiKeyLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!user?.id) return null;

  return (
    <section className="mb-8 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-sky-950">{t.sdkConfigTitle}</h2>
      <p className="mt-1 text-sm text-sky-900/80">{t.sdkConfigDesc}</p>

      <div className="mt-5 space-y-5">
        {apiKeyLoading && (
          <p className="text-sm text-sky-800/70">{t.apiKeyLoading}</p>
        )}

        {!apiKeyLoading && apiKeyError && (
          <p className="text-sm text-red-700">{t.apiKeyLoadError}</p>
        )}

        {!apiKeyLoading && !apiKeyError && apiKey && (
          <CopyField
            label={t.apiKeyLabel}
            value={apiKey}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
        )}

        {!apiKeyLoading && !apiKeyError && !apiKey && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t.apiKeyNotConfigured}
          </div>
        )}

        <CopyField
          label={t.userIdLabel}
          value={user.id}
          copyLabel={t.copy}
          copiedLabel={t.copied}
        />
      </div>

      <p className="mt-4 font-mono text-xs text-sky-900/70">{t.sdkExample}</p>
    </section>
  );
}
