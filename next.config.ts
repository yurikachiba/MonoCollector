import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Render.com
  output: 'export',

  // Disable image optimization for static export
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
