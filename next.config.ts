import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build for faster development
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/coins/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      allowedOrigins: [],
    },
    optimizePackageImports: ['lucide-react'],
  },

  // Optimize webpack for faster builds
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Faster source maps in development
      config.devtool = 'eval-cheap-module-source-map';

      // Optimize module resolution
      config.resolve.symlinks = false;

      // Enable webpack cache
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

export default nextConfig;
