/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
 
  // Configure image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Enable static exports
  trailingSlash: false,
}

module.exports = nextConfig
