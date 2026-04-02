# Comparador de canje de cheques (PyME)

Mini app Next.js (solo cliente) para reuniones comerciales.

## Requisitos

- Node.js 18+ (recomendado 20+)

## Cómo correrlo en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3010](http://localhost:3010) (puerto definido en `package.json`).

Build de producción (modo Node / hosting con servidor Next):

```bash
npm run build
npm start
```

## Build estático y GitHub Pages

En **local** seguís con `npm run dev` / `npm run build` sin variables extra: Next en modo app normal.

Para generar la carpeta `out/` como sitio 100% estático (por ejemplo para GitHub Pages en `https://<usuario>.github.io/<repo>/`):

```bash
npx cross-env STATIC_EXPORT=1 BASE_PATH=/<nombre-del-repo> npm run build
```

Sustituí `<nombre-del-repo>` por el nombre exacto del repositorio en GitHub (ej. `pyme-calculator`). Si omitís `BASE_PATH`, el export sirve para publicar en la raíz de un dominio.

Variables:

| Variable         | Valor   | Efecto                                      |
|------------------|---------|---------------------------------------------|
| `STATIC_EXPORT`  | `1`     | `output: "export"`, HTML en `out/`          |
| `BASE_PATH`      | `/repo` | Rutas y assets bajo ese prefijo (Pages)   |

El workflow `.github/workflows/github-pages.yml` define `STATIC_EXPORT=1` y `BASE_PATH=/${{ github.event.repository.name }}` al hacer push a `main`.

### Cómo publicar en GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Hacé merge/push a **`main`** con este workflow presente; la Action **build** + **deploy** sube el contenido de `out/`.
3. La URL queda `https://<tu-usuario>.github.io/<nombre-repo>/` (puede tardar unos minutos).

Para probar el estático en la PC antes de subir: ejecutá el comando de build de arriba y serví la carpeta `out/` con un servidor estático (o abrí comprobando que la URL coincida con el `BASE_PATH`).

### Si el deploy falla (X roja en Actions / Deployments)

En los logs suele aparecer **`Failed to create deployment (status: 404)`** o *Ensure GitHub Pages has been enabled*. Eso casi siempre significa que **Pages no está publicando vía GitHub Actions**:

1. Abrí **Settings → Pages** del repo.
2. En **Build and deployment**, el **Source** tiene que ser explícitamente **GitHub Actions**, no “Deploy from a branch”.
3. Si antes elegiste una rama (`gh-pages` / `main` / `/root`), cambiá a **GitHub Actions** y guardá.
4. Volvé a **Actions**, abrí el último run fallido y usá **Re-run all jobs** (o hacé un push vacío a `main`).

El job **build** suele estar en verde; el que falla es **deploy** hasta que el origen de Pages sea Actions. La primera vez GitHub puede pedir **aprobar el entorno `github-pages`** en la pestaña Actions (banner amarillo): revisá y aprobá si aparece.

## Dónde tunear

- Tasas y pesos de la cartera escalera: `src/lib/config/ladderPortfolio.ts`
- Fórmulas: `src/lib/calculator.ts`
- Texto de conclusión: `src/lib/commercialConclusion.ts`
- UI y copy: `src/components/CalculatorApp.tsx`, `src/app/globals.css`
