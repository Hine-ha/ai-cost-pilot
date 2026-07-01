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
