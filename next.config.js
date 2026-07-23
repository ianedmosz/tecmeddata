const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // Manuales y documentos escaneados guardados en Supabase Storage:
      // se cachean para poder abrirlos sin conexion una vez vistos.
      urlPattern: ({ url }) => url.pathname.includes("/storage/v1/object/"),
      handler: "CacheFirst",
      options: {
        cacheName: "tecmed-storage-files",
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Llamadas a la API REST de Supabase (listas de equipos, mantenimientos, etc.)
      urlPattern: ({ url }) => url.pathname.includes("/rest/v1/"),
      handler: "NetworkFirst",
      options: {
        cacheName: "tecmed-api-data",
        networkTimeoutSeconds: 6,
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "tecmed-fallback",
        expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
