type Props = {
  title: string;
  hint?: string;
  step?: number;
  children: React.ReactNode;
};

export function SectionCard({ title, hint, step, children }: Props) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <header className="mb-4 flex flex-wrap items-start gap-3 border-b border-slate-100 pb-3">
        {step != null ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {step}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}
