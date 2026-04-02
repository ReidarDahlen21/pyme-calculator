"use client";

import { useMemo, useState } from "react";
import { computeCalculator } from "@/lib/calculator";
import { buildCommercialConclusion } from "@/lib/commercialConclusion";
import { formatARS, formatPct } from "@/lib/format";
import type { CalculatorInputs } from "@/lib/types/calculator";
import { validateInputs } from "@/lib/validation";
import { Tooltip } from "./Tooltip";
import { SectionCard } from "./SectionCard";

const DEFAULT_FORM = {
  montoCheque: "200000000",
  diasAlVencimiento: "60",
  recargoPct: "10",
  tnaPct: "31",
  sgrAnualPct: "3",
  brokerPct: "1",
  inflacionMensualPct: "3",
};

function parseNum(s: string): number {
  const n = Number(String(s).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function Row({
  label,
  value,
  tooltip,
  emphasize,
}: {
  label: string;
  value: string;
  tooltip?: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${emphasize ? "bg-slate-50/80 -mx-2 px-2 rounded-lg border-0" : ""}`}
    >
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {tooltip ? (
          <Tooltip label={tooltip}>
            <span>{label}</span>
          </Tooltip>
        ) : (
          <span>{label}</span>
        )}
      </div>
      <div
        className={`font-mono text-base tabular-nums text-slate-900 sm:text-right ${emphasize ? "text-lg font-semibold" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

export function CalculatorApp() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [ladderDetailOpen, setLadderDetailOpen] = useState(false);

  const inputs: CalculatorInputs | null = useMemo(() => {
    const montoCheque = parseNum(form.montoCheque);
    const diasAlVencimiento = parseNum(form.diasAlVencimiento);
    const recargoPct = parseNum(form.recargoPct);
    const tnaPct = parseNum(form.tnaPct);
    const sgrAnualPct = parseNum(form.sgrAnualPct);
    const brokerPct = parseNum(form.brokerPct);
    const inflacionMensualPct = parseNum(form.inflacionMensualPct);
    if (
      [montoCheque, diasAlVencimiento, recargoPct, tnaPct, sgrAnualPct, brokerPct, inflacionMensualPct].some(
        (n) => !Number.isFinite(n)
      )
    ) {
      return null;
    }
    return {
      montoCheque,
      diasAlVencimiento,
      recargoPct,
      tnaPct,
      sgrAnualPct,
      brokerPct,
      inflacionMensualPct,
    };
  }, [form]);

  const issues = useMemo(() => (inputs ? validateInputs(inputs) : []), [inputs]);
  const result = useMemo(() => (inputs && issues.length === 0 ? computeCalculator(inputs) : null), [inputs, issues.length]);
  const conclusion = useMemo(() => (result ? buildCommercialConclusion(result) : ""), [result]);

  const bestReal = useMemo(() => {
    if (!result) return null as "esperar" | "canje" | "cartera" | null;
    const a = result.valorRealEsperar;
    const b = result.valorRealNetoCanje;
    const c = result.valorRealCartera;
    if (a >= b && a >= c) return "esperar";
    if (b >= a && b >= c) return "canje";
    return "cartera";
  }, [result]);

  function handleCalc(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleResetExample() {
    setForm(DEFAULT_FORM);
    setSubmitted(true);
  }

  const showErrors = submitted && issues.length > 0;
  const showResults = submitted && result;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:max-w-4xl lg:px-8">
      <header className="mb-10 text-center lg:text-left">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Herramienta comercial
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Comparador de canje de cheques
        </h1>
      </header>

      <form onSubmit={handleCalc} className="space-y-8">
        <SectionCard title="Información">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Info del cheque</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-slate-600">Monto del cheque</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.montoCheque}
                    onChange={(e) => setForm((f) => ({ ...f, montoCheque: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Días al vencimiento</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.diasAlVencimiento}
                    onChange={(e) => setForm((f) => ({ ...f, diasAlVencimiento: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">
                    Recargo % sobre precio contado (venta financiada)
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.recargoPct}
                    onChange={(e) => setForm((f) => ({ ...f, recargoPct: e.target.value }))}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">Mercado</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm text-slate-600">TNA descuento %</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.tnaPct}
                    onChange={(e) => setForm((f) => ({ ...f, tnaPct: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">SGR anual %</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.sgrAnualPct}
                    onChange={(e) => setForm((f) => ({ ...f, sgrAnualPct: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Comisión broker %</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.brokerPct}
                    onChange={(e) => setForm((f) => ({ ...f, brokerPct: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Inflación mensual estimada %</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    value={form.inflacionMensualPct}
                    onChange={(e) => setForm((f) => ({ ...f, inflacionMensualPct: e.target.value }))}
                  />
                </label>
              </div>
            </div>
          </div>

          {showErrors ? (
            <ul className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {issues.map((i) => (
                <li key={`${i.field}-${i.message}`}>{i.message}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Calcular
            </button>
            <button
              type="button"
              onClick={handleResetExample}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
            >
              Restablecer ejemplo
            </button>
          </div>
        </SectionCard>
      </form>

      {showResults ? (
        <div className="mt-10 space-y-8">
          <SectionCard
            step={1}
            title="Valor del cheque"
            hint="Primero anclamos el nominal y el precio contado implícito de la venta financiada."
          >
            <Row
              label="Monto del cheque"
              value={formatARS(result.valorEsperarNominal)}
              tooltip="Nominal al cobro, según el monto informado."
            />
            <Row
              label="Precio contado implícito"
              value={formatARS(result.precioContado)}
              tooltip="Monto cheque ÷ (1 + recargo%). Es el precio de contado equivalente."
            />
            <Row
              label="Ganancia extra por venta financiada"
              value={formatARS(result.gananciaExtraFinanciado)}
              tooltip="Diferencia entre el cheque y el precio contado implícito."
              emphasize
            />
          </SectionCard>

          <SectionCard
            step={2}
            title="Qué pasa si lo canjeás hoy"
            hint="Descuento, SGR prorrateada por días y comisión del broker."
          >
            <Row
              label="Interés financiero del canje"
              value={formatARS(result.interesDescuento)}
              tooltip="Cheque × TNA × (días / 365)."
            />
            <Row
              label="Costo SGR (anual prorrateada)"
              value={formatARS(result.costoSgr)}
              tooltip="Cheque × SGR anual × (días / 365). No es un porcentaje fijo flat sobre nominal sin plazo."
            />
            <Row
              label="Comisión broker"
              value={formatARS(result.costoBroker)}
              tooltip="Cheque × comisión %."
            />
            <Row
              label="Neto que recibís hoy"
              value={formatARS(result.netoCanje)}
              tooltip="Cheque menos interés, SGR y broker."
              emphasize
            />
          </SectionCard>

          <SectionCard
            step={3}
            title="Qué pasa si invertís el neto"
            hint="Neto dividido en 5 partes iguales e invertidas en escalera."
          >
            {ladderDetailOpen ? (
              <div className="mb-4 space-y-3">
                {result.tramos.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-slate-800">{t.label}</span>
                      <span className="text-xs text-slate-500">20% del neto</span>
                    </div>
                    <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-slate-500">Asignado</span>
                        <div className="font-mono tabular-nums text-slate-900">{formatARS(t.montoAsignado)}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Valor final estimado al vencimiento</span>
                        <div className="font-mono tabular-nums text-slate-900">{formatARS(t.valorFuturo)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <ResultHighlight
              label="Total cartera escalera (nominal al plazo)"
              value={formatARS(result.totalCarteraEscalera)}
            />
            <button
              type="button"
              onClick={() => setLadderDetailOpen((o) => !o)}
              className="mt-3 text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
            >
              {ladderDetailOpen ? "Ocultar detalle por instrumento" : "Ver detalle por instrumento"}
            </button>
          </SectionCard>

          <SectionCard
            step={4}
            title="Impacto de la inflación"
            hint="Comparamos poder de compra estimado en pesos de hoy al vencimiento."
          >
            <Row
              label="Inflación acumulada al plazo (estimada)"
              value={formatPct(result.inflacionAcumuladaPct)}
              tooltip="Factor (1 + inflación mensual)^(días/30), expresado como % acumulado."
            />
            <Row
              label="Valor nominal si esperás al cobro"
              value={formatARS(result.valorEsperarNominal)}
            />
            <ResultHighlight
              className="mt-4"
              label="Valor real hoy de esperar el cheque"
              value={formatARS(result.valorRealEsperar)}
              tooltip="Nominal al vencimiento descontado por inflación acumulada estimada."
            />
          </SectionCard>

          <SectionCard
            step={5}
            title="Comparación final"
            hint="Tres lecturas: cobro futuro, liquidez hoy, y canje con reinversión modelada."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <CompareCard
                title="Esperar al vencimiento"
                tag="Maximiza resultado final (nominal al vencimiento)"
                nominal={result.valorEsperarNominal}
                real={result.valorRealEsperar}
                highlight={bestReal === "esperar"}
              />
              <CompareCard
                title="Canjear hoy"
                tag="Maximiza liquidez inmediata"
                nominal={result.netoCanje}
                real={result.valorRealNetoCanje}
                highlight={bestReal === "canje"}
              />
              <CompareCard
                title="Canjear + invertir"
                tag="Equilibra liquidez y rendimiento"
                nominal={result.totalCarteraEscalera}
                real={result.valorRealCartera}
                highlight={bestReal === "cartera"}
              />
            </div>
            <div className="mt-6 grid gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <span className="text-slate-500">Diferencia nominal (esperar − canje hoy)</span>
                <div className="font-mono font-medium tabular-nums">{formatARS(result.diffNominalEsperarVsCanje)}</div>
              </div>
              <div>
                <span className="text-slate-500">Diferencia nominal (esperar − cartera)</span>
                <div className="font-mono font-medium tabular-nums">{formatARS(result.diffNominalEsperarVsCartera)}</div>
              </div>
              <div>
                <span className="text-slate-500">Diferencia real (esperar − canje hoy)</span>
                <div className="font-mono font-medium tabular-nums">{formatARS(result.diffRealEsperarVsCanje)}</div>
              </div>
              <div>
                <span className="text-slate-500">Diferencia real (esperar − cartera)</span>
                <div className="font-mono font-medium tabular-nums">{formatARS(result.diffRealEsperarVsCartera)}</div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            step={6}
            title="Conclusión comercial"
            hint="Texto guionado según brechas reales y rol de la cartera; ajustalo en voz si hace falta."
          >
            <p className="text-base leading-relaxed text-slate-700">{conclusion}</p>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}

function ResultHighlight({
  label,
  value,
  tooltip,
  className = "",
}: {
  label: string;
  value: string;
  tooltip?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-900/10 bg-slate-900 px-4 py-3 text-white ${className}`.trim()}
    >
      <div className="text-sm font-medium text-slate-300">
        {tooltip ? (
          <Tooltip label={tooltip}>
            <span>{label}</span>
          </Tooltip>
        ) : (
          label
        )}
      </div>
      <div className="mt-1 text-2xl font-semibold font-mono tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

function CompareCard({
  title,
  tag,
  nominal,
  real,
  highlight,
}: {
  title: string;
  tag: string;
  nominal: number;
  real: number;
  highlight: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-sm ${
        highlight
          ? "border-slate-900 ring-2 ring-slate-900/10 bg-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-xs leading-snug text-slate-500">{tag}</p>
      {highlight ? (
        <span className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
          Mejor valor real estimado
        </span>
      ) : null}
      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Nominal al cierre / hoy</div>
          <div className="text-xl font-semibold font-mono tabular-nums text-slate-900">{formatARS(nominal)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Valor real (pesos de hoy)</div>
          <div className="text-lg font-mono tabular-nums text-slate-800">{formatARS(real)}</div>
        </div>
      </div>
    </div>
  );
}
