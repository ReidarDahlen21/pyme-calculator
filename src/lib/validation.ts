import type { CalculatorInputs } from "./types/calculator";

export interface ValidationIssue {
  field: string;
  message: string;
}

const MAX_PCT = 500;

export function validateInputs(raw: CalculatorInputs): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (raw.montoCheque < 0) {
    issues.push({ field: "montoCheque", message: "El monto no puede ser negativo." });
  }
  if (raw.montoCheque === 0) {
    issues.push({ field: "montoCheque", message: "Ingresá un monto mayor a cero." });
  }

  if (!Number.isFinite(raw.diasAlVencimiento) || raw.diasAlVencimiento <= 0) {
    issues.push({
      field: "diasAlVencimiento",
      message: "Los días al vencimiento deben ser mayores a cero.",
    });
  }
  if (raw.diasAlVencimiento > 3650) {
    issues.push({
      field: "diasAlVencimiento",
      message: "Plazo demasiado largo (máx. sugerido 3650 días).",
    });
  }

  if (raw.recargoPct < 0 || raw.recargoPct > MAX_PCT) {
    issues.push({
      field: "recargoPct",
      message: `Recargo fuera de rango (0–${MAX_PCT}%).`,
    });
  }

  for (const [key, label] of [
    ["tnaPct", "TNA"],
    ["sgrAnualPct", "SGR anual"],
    ["brokerPct", "Broker"],
    ["inflacionMensualPct", "Inflación mensual"],
  ] as const) {
    const v = raw[key];
    if (v < 0 || v > MAX_PCT) {
      issues.push({
        field: key,
        message: `${label}: usá un porcentaje entre 0 y ${MAX_PCT}%.`,
      });
    }
  }

  return issues;
}
