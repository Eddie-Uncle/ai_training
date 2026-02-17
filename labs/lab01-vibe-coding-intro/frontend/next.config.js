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
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,POST,PUT' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
