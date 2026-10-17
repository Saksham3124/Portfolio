/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: false,
      },
      {
        source: "/experience",
        destination: "/",
        permanent: false,
      },
      {
        source: "/work",
        destination: "/",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/",
        permanent: false,
      },
      {
        source: "/education",
        destination: "/",
        permanent: false,
      },
      {
        source: "/skills",
        destination: "/",
        permanent: false,
      },
      {
        source: "/credentials",
        destination: "/",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
