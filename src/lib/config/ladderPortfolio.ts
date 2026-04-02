/**
 * Cartera tipo escalera: pesos y tasas editables en un solo lugar.
 * Tasas caución en % TNA anual; letras en % mensual.
 */
export const LADDER_WEIGHT = 0.2;

export const LADDER_INSTRUMENTS = [
  {
    id: "caucion-1d",
    label: "Caución 1 día",
    kind: "caucion_1d" as const,
    weight: LADDER_WEIGHT,
    /** TNA anual % */
    rateAnnualPct: 21.2,
  },
  {
    id: "caucion-7d",
    label: "Caución 7 días",
    kind: "caucion_7d" as const,
    weight: LADDER_WEIGHT,
    rateAnnualPct: 23.5,
  },
  {
    id: "caucion-14d",
    label: "Caución 14 días",
    kind: "caucion_14d" as const,
    weight: LADDER_WEIGHT,
    rateAnnualPct: 24.4,
  },
  {
    id: "letra-30d",
    label: "Letra 30 días",
    kind: "letra_30d" as const,
    weight: LADDER_WEIGHT,
    /** Tasa mensual % */
    rateMonthlyPct: 2.7,
  },
  {
    id: "letra-plazo-total",
    label: "Letra plazo total del cheque",
    kind: "letra_plazo_total" as const,
    weight: LADDER_WEIGHT,
    rateMonthlyPct: 2.7,
  },
] as const;

export type LadderInstrumentConfig = (typeof LADDER_INSTRUMENTS)[number];
