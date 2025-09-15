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

  // Disable React Strict Mode to prevent double API calls in development
  reactStrictMode: false,
}

module.exports = nextConfig
