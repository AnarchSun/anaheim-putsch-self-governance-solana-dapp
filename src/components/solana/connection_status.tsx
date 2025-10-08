// PATH: src/components/solana/connection_status.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Converts .jsx to TypeScript .tsx, fixes ALL TypeScript syntax errors, removes declare global from component, uses external type file for window.solanaWeb3, batch fix eternal!
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LucideAlertCircle, LucideCheckCircle, LucideLoader } from 'lucide-react';
import { SOLANA_CLUSTER_URL as rpcUrl } from '@/config/solana';

// NOTE: TypeScript global augmentation for window.solanaWeb3 MUST be in a separate .d.ts file.
// See src/types/solana-global.d.ts for the correct declaration!

const queryClient = new QueryClient();

let solanaWeb3: typeof import('@solana/web3.js') | undefined = undefined;

// Type for health result
type HealthResult = {
    status: string;
    endpoint: string;
    error: string | null;
};

const getSolanaHealth = async (): Promise<HealthResult> => {
    if (!solanaWeb3) {
        throw new Error('Solana Web3 library is not loaded yet.');
    }
    const connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
    try {
        // @ts-expect-error - getHealth exists on mainnet RPC but is not typed in web3.js
        const health = await connection.getHealth();
        return {
            status: health,
            endpoint: rpcUrl,
            error: null,
        };
    } catch (err: any) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        return {
            status: 'unhealthy',
            endpoint: rpcUrl,
            error: errorMsg,
        };
    }
};

const ConnectionStatus: React.FC = () => {
    const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.91.7/dist/bundle.iife.js';
        script.async = true;
        script.onload = () => {
            solanaWeb3 = window.solanaWeb3;
            setIsLibraryLoaded(true);
        };
        script.onerror = () => {
            // Punk alert: log error but don't crash the UI
            console.error('Failed to load Solana Web3.js library');
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const { data, isLoading, error } = useQuery<HealthResult>({
        queryKey: ['solanaHealth'],
        queryFn: getSolanaHealth,
        enabled: isLibraryLoaded,
        staleTime: 5000,
        refetchInterval: 5000,
    });

    const getStatusIcon = () => {
        if (isLoading) return <LucideLoader className="h-6 w-6 text-blue-500 animate-spin" />;
        if (error || (data && data.error)) return <LucideAlertCircle className="h-6 w-6 text-red-500" />;
        if (data && data.status === 'ok') return <LucideCheckCircle className="h-6 w-6 text-green-500" />;
        return <LucideAlertCircle className="h-6 w-6 text-yellow-500" />;
    };

    const getStatusText = () => {
        if (!isLibraryLoaded) return 'Loading Solana Web3 library...';
        if (isLoading) return 'Checking connection...';
        if (error) return `Failed to connect: ${(error.message)}`;
        if (data && data.error) return `Unhealthy: ${data.error}`;
        if (data) return `Connection Status: ${data.status.toUpperCase()}`;
        return 'Unknown status.';
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 font-sans flex flex-col items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
                <h1 className="text-3xl font-bold mb-4">Solana Network Status</h1>
                <div className="flex items-center justify-center space-x-4 mb-6">
                    {getStatusIcon()}
                    <p className="text-xl">{getStatusText()}</p>
                </div>
                <div className="text-left bg-gray-700 p-4 rounded-md text-sm break-words">
                    <p className="mb-2">
                        <strong>RPC Endpoint:</strong> {data?.endpoint || 'N/A'}
                    </p>
                    <p>
                        This tool verifies the connection to the Solana RPC endpoint. A <code>403</code> error means the endpoint requires special permissions, API key, or another URL.
                    </p>
                </div>
                {(data?.error || error) && (
                    <div className="mt-4 text-left bg-red-800 p-4 rounded-md text-sm">
                        <h3 className="font-bold">Last Error:</h3>
                        <pre className="whitespace-pre-wrap text-red-300">
                            {data?.error ?? (error instanceof Error ? error.message : String(error))}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function ConnectionStatusApp() {
    return (
        <QueryClientProvider client={queryClient}>
            <ConnectionStatus />
        </QueryClientProvider>
    );
}

// PATCH NOTES:
// - Converts .jsx to .tsx, full TypeScript strict
// - No declare global, no type error, no mutation of error.message
// - Window.solanaWeb3 type must be in src/types/solana-global.d.ts
// - Batch fix eternal, filename/path éternel!