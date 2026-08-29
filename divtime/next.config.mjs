/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";
const API_PROXY_ORIGIN = process.env.API_PROXY_ORIGIN ?? "https://divtimebackend.liara.run";
const DEV_ALLOWED_ORIGINS = (process.env.DEV_ALLOWED_ORIGINS ?? "").split(",").filter(Boolean);
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@time/core"],
  env: {
    NEXT_PUBLIC_API_BASE: API_BASE,
  },
  async rewrites() {
    if (USE_MOCKS) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_ORIGIN}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
      },
    ],
  },
  // Allow LAN access during dev (Turbopack warning fix)
  ...(DEV_ALLOWED_ORIGINS.length > 0
    ? { allowedDevOrigins: DEV_ALLOWED_ORIGINS }
    : {
        allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.0.101:3000"],
      }),
};

export default nextConfig;
