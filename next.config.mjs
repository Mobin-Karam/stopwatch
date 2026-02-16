/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";
const API_PROXY_ORIGIN = process.env.API_PROXY_ORIGIN ?? "https://divtimebackend.liara.run";

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@time/core"],
  env: {
    NEXT_PUBLIC_API_BASE: API_BASE,
  },
  async rewrites() {
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
};

export default nextConfig;
