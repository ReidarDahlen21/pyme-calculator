import type { NextConfig } from "next";

/**
 * Build estático para GitHub Pages (u otro hosting solo estático):
 *   STATIC_EXPORT=1
 *   BASE_PATH=/nombre-del-repo   (obligatorio si el sitio no está en la raíz del dominio)
 *
 * Desarrollo local: no definas estas variables (Next en modo app normal).
 */
const staticExport = process.env.STATIC_EXPORT === "1";
let basePath = (process.env.BASE_PATH ?? "").trim();
if (basePath === "/") basePath = "";
if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
