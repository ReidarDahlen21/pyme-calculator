"use client";

import { useId, useState } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

/** Ayuda breve accesible: foco o clic en desktop/tablet. */
export function Tooltip({ label, children, className = "" }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-flex items-center gap-1 ${className}`}>
      {children}
      <button
        type="button"
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-500 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Más información"
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-1 w-56 rounded-md border border-slate-200 bg-slate-900 px-2.5 py-2 text-left text-xs font-normal leading-snug text-white shadow-lg"
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
