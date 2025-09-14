/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure caching headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },

  // Enable compression
  compress: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Configure image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable static exports for better caching
  trailingSlash: false,
}

module.exports = nextConfig
