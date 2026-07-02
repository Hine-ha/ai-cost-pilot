"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CodeBlock from "@/components/docs/CodeBlock";
import { FEEDBACK_FORM_URL } from "@/lib/links";
import { DocsLocale, getDocsMessages } from "@/lib/i18n/docs";

const LOCALE_LABELS: Record<DocsLocale, string> = {
  zh: "中文",
  ja: "日本語",
};

const MODELS = [
  {
    id: "claude",
    nameKey: "claude" as const,
    badge: "C",
    bg: "bg-orange-100 text-orange-700 ring-orange-200",
  },
  {
    id: "gpt4",
    nameKey: "gpt4" as const,
    badge: "G",
    bg: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  },
  {
    id: "gemini",
    nameKey: "gemini" as const,
    badge: "Ge",
    bg: "bg-blue-100 text-blue-700 ring-blue-200",
  },
  {
    id: "deepseek",
    nameKey: "deepseek" as const,
    badge: "D",
    bg: "bg-violet-100 text-violet-700 ring-violet-200",
  },
];

const STEPS = [
  { key: "step1" as const, codeKey: "codeStep1" as const, lang: "shell" as const },
  { key: "step2" as const, codeKey: "codeStep2" as const, lang: "python" as const },
  { key: "step3" as const, codeKey: "codeStep3" as const, lang: "python" as const },
];

function detectDefaultLocale(): DocsLocale {
  if (typeof navigator === "undefined") return "ja";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "ja";
}

export default function DocsPage() {
  const [locale, setLocale] = useState<DocsLocale>("ja");
  const t = useMemo(() => getDocsMessages(locale), [locale]);

  useEffect(() => {
    setLocale(detectDefaultLocale());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 pb-20 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              SDK Docs
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500">
              {t.language}
            </span>
            <div
              className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
              role="group"
              aria-label={t.language}
            >
              {(["zh", "ja"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={locale === lang}
                  onClick={() => setLocale(lang)}
                  className={`min-w-[72px] rounded-lg px-4 py-2 text-sm font-medium transition ${
                    locale === lang
                      ? "bg-white text-sky-700 shadow-sm ring-1 ring-sky-100"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {LOCALE_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900">{t.prereqTitle}</h2>
          <div className="mt-6 space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                1. {t.prereqInstallLabel}
              </h3>
              <CodeBlock
                code={t.codePrereqInstall}
                language="shell"
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                2. {t.prereqApiKeyLabel}
              </h3>
              <CodeBlock
                code={t.codePrereqApiKey}
                language="shell"
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
              <p className="mt-4 text-sm text-slate-600">{t.prereqApiKeyNote}</p>
              <Link
                href="/dashboard"
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
              >
                {t.viewDashboard}
              </Link>
            </div>
          </div>
        </section>

        <ol className="mb-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.key}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  {t[`${step.key}Title`]}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {t[`${step.key}Desc`]}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="space-y-10">
          {STEPS.map((step, index) => (
            <section key={step.key}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h2 className="text-lg font-semibold text-slate-900">
                  {t[`${step.key}Title`]}
                </h2>
              </div>
              <CodeBlock
                code={t[step.codeKey]}
                language={step.lang}
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            </section>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-lg font-semibold text-slate-900">
            {t.supportedModels}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MODELS.map((model) => (
              <div
                key={model.id}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ring-1 ${model.bg}`}
                >
                  {model.badge}
                </div>
                <p className="mt-3 font-medium text-slate-900">
                  {t.models[model.nameKey]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            {t.viewDashboard}
          </Link>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            {t.feedback}
          </a>
        </div>
      </main>
    </div>
  );
}
