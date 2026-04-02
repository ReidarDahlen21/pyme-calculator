import type { CalculatorResult } from "./types/calculator";

export function buildCommercialConclusion(r: CalculatorResult): string {
  const { diffRealEsperarVsCanje, diffRealEsperarVsCartera, totalCarteraEscalera, netoCanje } =
    r;

  const absVsCanje = Math.abs(diffRealEsperarVsCanje);
  const absVsCartera = Math.abs(diffRealEsperarVsCartera);
  const ref = Math.max(r.valorRealEsperar, 1);
  const relCanje = (absVsCanje / ref) * 100;
  const relCartera = (absVsCartera / ref) * 100;

  const carteraCierraBrecha =
    totalCarteraEscalera > netoCanje &&
    absVsCartera < absVsCanje * 0.85;

  const partes: string[] = [];

  if (relCartera < 2) {
    partes.push(
      "En términos reales (ajustados por inflación), la diferencia entre esperar al vencimiento y canjear con reinversión en cartera escalera es acotada."
    );
  } else if (diffRealEsperarVsCartera > 0) {
    partes.push(
      "Esperar al cobro conserva un valor real estimado mayor al de canjear hoy y reinvertir con los supuestos de cartera."
    );
  } else {
    partes.push(
      "Con los supuestos cargados, la estrategia de canje y reinversión muestra un valor real al vencimiento competitivo frente a esperar el cheque."
    );
  }

  if (relCanje < 3 && diffRealEsperarVsCanje > 0) {
    partes.push(
      "La brecha real frente al canje inmediato (sin reinvertir) es baja: la liquidez hoy puede compensar si necesitás rotar caja o reducir riesgo operativo."
    );
  } else if (diffRealEsperarVsCanje > 0 && relCanje >= 3) {
    partes.push(
      "El canje inmediato implica un menor valor real hoy frente a esperar; conviene contrastar ese costo con la necesidad de efectivo y el costo de oportunidad interno."
    );
  }

  if (carteraCierraBrecha && totalCarteraEscalera < r.valorEsperarNominal) {
    partes.push(
      "Reinvertir el neto en una cartera diversificada por plazos reduce parte de la diferencia nominal que genera el descuento."
    );
  }

  partes.push(
    "Los montos son estimaciones a fines comerciales; tasas, comisiones e inflación deben alinearse con condiciones reales del mercado y de tu operación."
  );

  return partes.join(" ");
}
