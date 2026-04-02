const ARS_LOCALE = "es-AR";

export function formatARS(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(ARS_LOCALE, {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatPct(value: number, fractionDigits = 2): string {
  return `${value.toLocaleString(ARS_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}
