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

    webpack(config, { isServer }) {
        // This is the fix. We are telling Webpack to ignore the 'fs' module
        // for the client-side bundle (when isServer is false).
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }

        // Important: return the modified config
        return config;
    }
};

export default nextConfig;