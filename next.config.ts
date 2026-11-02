import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.tikwm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.tiktokcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.muscdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.byteoversea.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ibytedtos.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
