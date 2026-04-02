# Comparador de canje de cheques (PyME)

Mini app Next.js (solo cliente) para reuniones comerciales.

## Requisitos

- Node.js 18+ (recomendado 20+)

## Cómo correrlo en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Build de producción:

```bash
npm run build
npm start
```

## Dónde tunear

- Tasas y pesos de la cartera escalera: `src/lib/config/ladderPortfolio.ts`
- Fórmulas: `src/lib/calculator.ts`
- Texto de conclusión: `src/lib/commercialConclusion.ts`
- UI y copy: `src/components/CalculatorApp.tsx`, `src/app/globals.css`
