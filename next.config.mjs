/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  reactStrictMode: true,
  distDir: process.env.NEXT_DEBUG_DIST || ".next",
};

export default nextConfig;
