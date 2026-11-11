/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_PUBLIC_APP_MODE === "demo" ? "export" : undefined,
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  transpilePackages: ["@coconea/shared", "@coconea/types", "@coconea/validation"],
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react"],
    cpus: 2,
  },
};

export default nextConfig;
