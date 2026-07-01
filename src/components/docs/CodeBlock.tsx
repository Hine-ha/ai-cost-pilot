"use client";

import { useState } from "react";

const KEYWORDS = new Set([
  "import",
  "from",
  "def",
  "return",
  "class",
  "if",
  "else",
  "for",
  "in",
  "True",
  "False",
  "None",
  "pip",
  "install",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightPython(code: string): string {
  const lines = code.split("\n");

  return lines
    .map((line) => {
      if (/^\s*#/.test(line)) {
        return `<span class="text-slate-500">${escapeHtml(line)}</span>`;
      }

      let html = escapeHtml(line);

      html = html.replace(
        /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
        '<span class="text-emerald-400">$1</span>'
      );

      html = html.replace(
        /\b(\d+)\b/g,
        '<span class="text-amber-300">$1</span>'
      );

      html = html.replace(
        /\b([a-zA-Z_][\w]*)\s*(?=\()/g,
        '<span class="text-sky-300">$1</span>'
      );

      for (const keyword of Array.from(KEYWORDS)) {
        html = html.replace(
          new RegExp(`\\b${keyword}\\b`, "g"),
          `<span class="text-purple-400">${keyword}</span>`
        );
      }

      return html;
    })
    .join("\n");
}

function highlightShell(code: string): string {
  const trimmed = code.trim();
  if (trimmed.startsWith("pip install ")) {
    const pkg = trimmed.slice("pip install ".length);
    return `<span class="text-purple-400">pip</span> <span class="text-sky-300">install</span> <span class="text-emerald-400">${escapeHtml(pkg)}</span>`;
  }
  return escapeHtml(code);
}

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
  const highlighted =
    language === "shell" ? highlightShell(code) : highlightPython(code);

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
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-100">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
