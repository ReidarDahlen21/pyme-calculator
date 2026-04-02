import { LADDER_INSTRUMENTS } from "./config/ladderPortfolio";
import type { CalculatorInputs, CalculatorResult, LadderTramoResult } from "./types/calculator";

const DAYS_YEAR = 365;
const DAYS_MONTH = 30;

/** Caución a 1 día: capitalización diaria con TNA. */
function fvCaucion1Dia(principal: number, dias: number, tnaPct: number): number {
  if (dias <= 0 || principal <= 0) return principal;
  const r = tnaPct / 100;
  return principal * Math.pow(1 + r / DAYS_YEAR, dias);
}

/**
 * Caución a N días: bloques completos con interés simple prorrateado anual;
 * remanente con proporcional simple sobre días.
 */
function fvCaucionBloques(
  principal: number,
  dias: number,
  tnaPct: number,
  blockDays: number
): number {
  if (dias <= 0 || principal <= 0) return principal;
  const r = tnaPct / 100;
  let a = principal;
  const full = Math.floor(dias / blockDays);
  const rem = dias % blockDays;
  for (let i = 0; i < full; i++) {
    a *= 1 + r * (blockDays / DAYS_YEAR);
  }
  if (rem > 0) {
    a *= 1 + r * (rem / DAYS_YEAR);
  }
  return a;
}

/** Letra con tasa mensual: renovar cada 30 días; fracción final lineal sobre el mes. */
function fvLetra30Dias(principal: number, dias: number, tasaMensualPct: number): number {
  if (dias <= 0 || principal <= 0) return principal;
  const rm = tasaMensualPct / 100;
  let a = principal;
  const fullMonths = Math.floor(dias / DAYS_MONTH);
  const rem = dias % DAYS_MONTH;
  for (let i = 0; i < fullMonths; i++) {
    a *= 1 + rm;
  }
  if (rem > 0) {
    a *= 1 + rm * (rem / DAYS_MONTH);
  }
  return a;
}

/** Letra al plazo total: misma tasa mensual compuesta a fracción de mes (días/30). */
function fvLetraPlazoTotal(principal: number, dias: number, tasaMensualPct: number): number {
  if (dias <= 0 || principal <= 0) return principal;
  const rm = tasaMensualPct / 100;
  const exponent = dias / DAYS_MONTH;
  return principal * Math.pow(1 + rm, exponent);
}

function tramoFuturo(
  principal: number,
  dias: number,
  inst: (typeof LADDER_INSTRUMENTS)[number]
): number {
  switch (inst.kind) {
    case "caucion_1d":
      return fvCaucion1Dia(principal, dias, inst.rateAnnualPct);
    case "caucion_7d":
      return fvCaucionBloques(principal, dias, inst.rateAnnualPct, 7);
    case "caucion_14d":
      return fvCaucionBloques(principal, dias, inst.rateAnnualPct, 14);
    case "letra_30d":
      return fvLetra30Dias(principal, dias, inst.rateMonthlyPct);
    case "letra_plazo_total":
      return fvLetraPlazoTotal(principal, dias, inst.rateMonthlyPct);
    default:
      return principal;
  }
}

/**
 * Cálculo principal: descuento, SGR prorrateada anual, cartera escalera, inflación.
 */
export function computeCalculator(inputs: CalculatorInputs): CalculatorResult {
  const {
    montoCheque,
    diasAlVencimiento,
    recargoPct,
    tnaPct,
    sgrAnualPct,
    brokerPct,
    inflacionMensualPct,
  } = inputs;

  const precioContado = montoCheque / (1 + recargoPct / 100);
  const gananciaExtraFinanciado = montoCheque - precioContado;

  const interesDescuento =
    montoCheque * (tnaPct / 100) * (diasAlVencimiento / DAYS_YEAR);
  const costoSgr =
    montoCheque * (sgrAnualPct / 100) * (diasAlVencimiento / DAYS_YEAR);
  const costoBroker = montoCheque * (brokerPct / 100);

  const netoCanje = montoCheque - interesDescuento - costoSgr - costoBroker;
  const valorEsperarNominal = montoCheque;

  const inflacionFactor = Math.pow(
    1 + inflacionMensualPct / 100,
    diasAlVencimiento / DAYS_MONTH
  );
  const inflacionAcumuladaPct = (inflacionFactor - 1) * 100;
  const valorRealEsperar = montoCheque / inflacionFactor;

  const valorRealNetoCanje = netoCanje;

  const tramos: LadderTramoResult[] = [];
  let totalCarteraEscalera = 0;
  const perTramo = netoCanje * (1 / LADDER_INSTRUMENTS.length);

  for (const inst of LADDER_INSTRUMENTS) {
    const vf = tramoFuturo(perTramo, diasAlVencimiento, inst);
    tramos.push({
      id: inst.id,
      label: inst.label,
      montoAsignado: perTramo,
      valorFuturo: vf,
    });
    totalCarteraEscalera += vf;
  }

  const valorRealCartera = totalCarteraEscalera / inflacionFactor;

  return {
    precioContado,
    gananciaExtraFinanciado,
    interesDescuento,
    costoSgr,
    costoBroker,
    netoCanje,
    valorEsperarNominal,
    inflacionFactor,
    inflacionAcumuladaPct,
    valorRealEsperar,
    tramos,
    totalCarteraEscalera,
    valorRealCartera,
    valorRealNetoCanje,
    diffNominalEsperarVsCanje: valorEsperarNominal - netoCanje,
    diffNominalEsperarVsCartera: valorEsperarNominal - totalCarteraEscalera,
    diffRealEsperarVsCanje: valorRealEsperar - valorRealNetoCanje,
    diffRealEsperarVsCartera: valorRealEsperar - valorRealCartera,
  };
}
