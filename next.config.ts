import {NextConfig} from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [{hostname: 'cdn.sanity.io'}],
  },
  typescript: {
    ignoreBuildErrors: true, // always ignore
  },
  eslint: {
    ignoreDuringBuilds: true, // always ignore
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    SC_DISABLE_SPEEDY: 'false',
  },
}

export default config
