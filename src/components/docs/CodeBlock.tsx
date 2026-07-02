"use client";

import { useState, type ReactNode } from "react";

const HIGHLIGHT_CLASS =
  "rounded bg-amber-500/25 px-0.5 font-semibold text-amber-300 ring-1 ring-amber-400/30";

const HIGHLIGHT_PATTERN =
  /(project="my-project"|model="[^"]+"|YOUR_API_KEY)/g;

function tokenizeHighlights(text: string) {
  const parts: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const re = new RegExp(HIGHLIGHT_PATTERN.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[0], highlight: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  if (parts.length === 0) {
    parts.push({ text, highlight: false });
  }

  return parts;
}

function HighlightedLine({ line }: { line: string }) {
  const commentMatch = line.match(/^(.+?)(\s+#.+)$/);
  const codePart = commentMatch ? commentMatch[1] : line;
  const commentPart = commentMatch ? commentMatch[2] : null;
  const segments = tokenizeHighlights(codePart);

  return (
    <>
      {segments.map((segment, index) =>
        segment.highlight ? (
          <mark key={index} className={HIGHLIGHT_CLASS}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
      {commentPart && (
        <span className="text-emerald-400/90">{commentPart}</span>
      )}
    </>
  );
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
    <>
      {lines.map((line, index) => (
        <span key={index}>
          <HighlightedLine line={line} />
          {index < lines.length - 1 ? "\n" : null}
        </span>
      ))}
    </>
  );
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

function CodeBlockShell({
  language,
  copyLabel,
  copiedLabel,
  onCopy,
  headerExtra,
  footnote,
  children,
}: {
  language: string;
  copyLabel: string;
  copiedLabel: string;
  onCopy: () => Promise<void>;
  headerExtra?: ReactNode;
  footnote?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-xl bg-slate-950 shadow-inner ring-1 ring-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-2">
          <div className="flex items-center gap-2">
            {headerExtra}
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {language}
            </span>
          </div>
          <CopyButton
            onCopy={onCopy}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
          />
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="font-mono text-slate-100">{children}</code>
        </pre>
      </div>
      {footnote && (
        <p className="mt-2 text-xs text-amber-700">{footnote}</p>
      )}
    </div>
  );
}

export default function CodeBlock({
  code,
  language = "python",
  copyLabel,
  copiedLabel,
  annotate = false,
  footnote,
}: {
  code: string;
  language?: "python" | "shell";
  copyLabel: string;
  copiedLabel: string;
  annotate?: boolean;
  footnote?: string;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <CodeBlockShell
      language={language}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
      onCopy={handleCopy}
      footnote={footnote}
    >
      {annotate ? <HighlightedCode code={code} /> : code}
    </CodeBlockShell>
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
  annotate = false,
  footnote,
}: {
  tabs: CodeTab[];
  language?: "python" | "shell";
  copyLabel: string;
  copiedLabel: string;
  annotate?: boolean;
  footnote?: string;
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
    <CodeBlockShell
      language={language}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
      onCopy={handleCopy}
      footnote={footnote}
      headerExtra={
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
      }
    >
      {annotate ? (
        <HighlightedCode code={activeTab.code} />
      ) : (
        activeTab.code
      )}
    </CodeBlockShell>
  );
}
