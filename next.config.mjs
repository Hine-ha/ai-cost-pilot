/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
  },
  async redirects() {
    return [
      { source: "/diagnose", destination: "/", permanent: false },
      { source: "/diagnose/:path*", destination: "/", permanent: false },
      { source: "/results", destination: "/dashboard", permanent: false },
      { source: "/results/:path*", destination: "/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
