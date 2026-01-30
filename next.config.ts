import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization (use external service if needed)
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Strict mode for better development
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
