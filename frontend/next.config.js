/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' for development
  // output: 'standalone', // Only use this for production builds

  // Add allowedDevOrigins to fix the cross-origin warning
  allowedDevOrigins: ['95.216.121.250'],
};

module.exports = nextConfig;
