/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/shorten',
        destination: 'http://localhost:8000/shorten',
      },
      {
        source: '/api/urls',
        destination: 'http://localhost:8000/urls',
      },
    ];
  },
};

module.exports = nextConfig;
