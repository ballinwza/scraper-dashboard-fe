import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_SERVICE_URI || 'https://scraper-dashboard-be-prod-758337397665.asia-southeast1.run.app'}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
