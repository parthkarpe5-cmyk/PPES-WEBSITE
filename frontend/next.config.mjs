/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: ".",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/teacher/tests/create',
        destination: '/faculty/tests/create',
        permanent: true,
      },
      {
        source: '/teacher',
        destination: '/faculty',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
