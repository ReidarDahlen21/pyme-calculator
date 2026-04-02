/** Entrada del formulario (valores numéricos ya parseados). */
export interface CalculatorInputs {
  montoCheque: number;
  diasAlVencimiento: number;
  recargoPct: number;
  tnaPct: number;
  sgrAnualPct: number;
  brokerPct: number;
  inflacionMensualPct: number;
}

export interface LadderTramoResult {
  id: string;
  label: string;
  montoAsignado: number;
  valorFuturo: number;
}

export interface CalculatorResult {
  precioContado: number;
  gananciaExtraFinanciado: number;
  interesDescuento: number;
  costoSgr: number;
  costoBroker: number;
  netoCanje: number;
  valorEsperarNominal: number;
  inflacionFactor: number;
  inflacionAcumuladaPct: number;
  valorRealEsperar: number;
  tramos: LadderTramoResult[];
  totalCarteraEscalera: number;
  valorRealCartera: number;
  valorRealNetoCanje: number;
  diffNominalEsperarVsCanje: number;
  diffNominalEsperarVsCartera: number;
  diffRealEsperarVsCanje: number;
  diffRealEsperarVsCartera: number;
}
