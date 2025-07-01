// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', // ← ici tu donnes une vraie valeur
      allowedOrigins: ['https://anarcrypt.sol'] // ← vraie valeur aussi
    }
  }
}

export default nextConfig
