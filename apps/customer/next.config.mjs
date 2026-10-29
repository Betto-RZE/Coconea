/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_PUBLIC_APP_MODE === "demo" ? "export" : undefined,
  // Keep production builds from overwriting the running development server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
