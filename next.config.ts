// FILE: next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '1mb',
            allowedOrigins: ['https://anarcrypt.sol']
        }
    },
    // ⚠️ Ceci est optionnel, garde ou retire selon besoin
    webpack(config: any, { dev, isServer }): any {
        // Tu peux mettre des règles custom ici si tu veux modifier Webpack
        return config;
    }
};

export default nextConfig;
