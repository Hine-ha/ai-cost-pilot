export default function HeroCodeExample() {
  return (
    <div className="mx-auto mt-8 w-full max-w-xl text-left">
      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed shadow-inner ring-1 ring-slate-800">
        <code className="block font-mono text-slate-100">
          <span className="text-violet-300">from</span> tokenlens{" "}
          <span className="text-violet-300">import</span>{" "}
          <span className="text-sky-300">TokenLens</span>
          {"\n"}
          tl = <span className="text-sky-300">TokenLens</span>(){"\n"}
          client = tl.<span className="text-amber-200">track</span>(anthropic_client)
        </code>
      </pre>
    </div>
  );
}
