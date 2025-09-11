import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LucideAlertCircle, LucideCheckCircle, LucideLoader } from 'lucide-react';

const queryClient = new QueryClient();

// Déclarez une variable globale pour la bibliothèque Solana pour la rendre accessible après le chargement du script
// Declare a global variable for the Solana library to make it accessible after script load
/** @type {typeof import('@solana/web3.js')} */
let solanaWeb3;

// Une fonction simple et claire pour vérifier la santé du point de terminaison RPC Solana
// A simple, clear-purpose function to check the Solana RPC endpoint's health
const getSolanaHealth = async () => {
    if (!solanaWeb3) {
        throw new Error("Solana Web3 library is not loaded yet.");
    }
    // Changement du point de terminaison RPC vers devnet comme demandé
    // Changing the RPC endpoint to devnet as requested
    const rpcUrl = "https://api.devnet.solana.com";
    const connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
    try {
        const health = await connection.getHealth();
        return {
            status: health,
            endpoint: rpcUrl,
            error: null,
        };
    } catch (err) {
        console.error('Connection check failed:', err);
        return {
            status: 'unhealthy',
            endpoint: rpcUrl,
            error: err.message || 'Unknown error',
        };
    }
};

window.solanaWeb3 = undefined;
const SolanaStatusCheck = () => {
    const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

    useEffect(() => {
        // Créez et ajoutez une balise de script pour charger la bibliothèque Solana Web3.js
        // Create and append a script tag to load the Solana Web3.js library
        const script = document.createElement('script');
        // Mettre à jour le chemin du script pour résoudre les problèmes de chargement
        // Updating the script path to fix loading issues
        script.src = 'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.91.7/dist/bundle.iife.js';
        console.log(`Attempting to load script from: ${script.src}`);
        script.onload = () => {
            // Lorsque la bibliothèque est chargée, rendez-la accessible globalement et mettez à jour l'état
            // When the library is loaded, make it globally accessible and update state
            solanaWeb3 = window.solanaWeb3;
            console.log("Solana Web3.js library loaded. Version:", solanaWeb3.VERSION);
            setIsLibraryLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Solana Web3.js library');
        };
        document.head.appendChild(script);

        return () => {
            // Nettoyage : retirez la balise de script si le composant est démonté
            // Cleanup: remove the script tag if the component is unmounted
            document.head.removeChild(script);
        };
    }, []);

    // Le hook 'useQuery' a maintenant une 'queryFn' claire avec un but unique.
    // The 'useQuery' hook now has a clear 'queryFn' with a singular purpose.
    const { data, isLoading, error } = useQuery({
        queryKey: ['solanaHealth'],
        queryFn: getSolanaHealth,
        enabled: isLibraryLoaded, // Activer la requête uniquement lorsque la bibliothèque est chargée
        staleTime: 5000, // Re-fetch every 5 seconds
        refetchInterval: 5000,
    });
    error.message = undefined;

    const getStatusIcon = () => {
        if (isLoading) {
            return <LucideLoader className="h-6 w-6 text-blue-500 animate-spin" />;
        }
        if (error) {
            return <LucideAlertCircle className="h-6 w-6 text-red-500" />;
        }
        if (data && data.status === 'ok') {
            return <LucideCheckCircle className="h-6 w-6 text-green-500" />;
        }
        return <LucideAlertCircle className="h-6 w-6 text-yellow-500" />;
    };

    const getStatusText = () => {
        if (!isLibraryLoaded) {
            return 'Loading Solana Web3 library...';
        }
        if (isLoading) {
            return 'Checking connection...';
        }
        if (error) {
            return `Failed to connect: ${error.message}`;
        }
        if (data) {
            return `Connection Status: ${data.status.toUpperCase()}`;
        }
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
                    <p className="mb-2"><strong>RPC Endpoint:</strong> {data?.endpoint || 'N/A'}</p>
                    <p>This tool verifies that the program can connect to a public Solana RPC endpoint. A `403` error indicates a permissions issue with the endpoint itself, which may require a different API key or URL.</p>
                </div>
                {error && (
                    <div className="mt-4 text-left bg-red-800 p-4 rounded-md text-sm">
                        <h3 className="font-bold">Last Error:</h3>
                        <pre className="whitespace-pre-wrap text-red-300">{error.message}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant principal qui enveloppe l'application dans le QueryClientProvider
// Main component that wraps the application in the QueryClientProvider
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SolanaStatusCheck />
        </QueryClientProvider>
    );
}
