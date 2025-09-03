/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable turbopack to avoid Windows permission issues
  turbo: false,
}

module.exports = nextConfig