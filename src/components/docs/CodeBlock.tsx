"use client";

import { useState } from "react";

function CopyButton({
  onCopy,
  copyLabel,
  copiedLabel,
}: {
  onCopy: () => Promise<void>;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await onCopy();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

export default function CodeBlock({
  code,
  language = "python",
  copyLabel,
  copiedLabel,
}: {
  code: string;
  language?: "python" | "shell";
  copyLabel: string;
  copiedLabel: string;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-slate-950 shadow-inner ring-1 ring-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {language}
        </span>
        <CopyButton
          onCopy={handleCopy}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-100">{code}</code>
      </pre>
    </div>
  );
}

export type CodeTab = {
  id: string;
  label: string;
  code: string;
};

export function TabbedCodeBlock({
  tabs,
  language = "python",
  copyLabel,
  copiedLabel,
}: {
  tabs: CodeTab[];
  language?: "python" | "shell";
  copyLabel: string;
  copiedLabel: string;
}) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  const handleCopy = async () => {
    if (!activeTab) return;
    try {
      await navigator.clipboard.writeText(activeTab.code);
    } catch {
      // ignore
    }
  };

  if (!activeTab) return null;

  return (
    <div className="overflow-hidden rounded-xl bg-slate-950 shadow-inner ring-1 ring-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div
            className="inline-flex rounded-lg bg-slate-900 p-0.5 ring-1 ring-slate-800"
            role="tablist"
            aria-label={language}
          >
            {tabs.map((tab) => {
              const active = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(tab.id)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {language}
          </span>
        </div>
        <CopyButton
          onCopy={handleCopy}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-slate-100">{activeTab.code}</code>
      </pre>
    </div>
  );
}
