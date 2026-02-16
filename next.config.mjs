/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://divtimebackend.liara.run";

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["@time/core"],
  env: {
    NEXT_PUBLIC_API_BASE: API_BASE,
  },
};

export default nextConfig;
