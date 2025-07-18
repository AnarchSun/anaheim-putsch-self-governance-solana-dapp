// FILE: src/app/stake/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';

// Assuming your helper is here. We'll call it inside the useQuery hook.
import { fetchStakeState } from '@/lib/stake/stakeHelpers';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppAlert } from '@/components/app-alert';

/**
 * Renders the results of the stake activation query.
 */
function StakeResult({ data }: { data: any }) { // Replace 'any' with the actual type from your helper
    return (
        <div className="mt-4 space-y-2 rounded-lg border bg-card p-4">
            <h3 className="text-lg font-bold">Stake Account Details</h3>
            <p><strong>State:</strong> <span className="font-mono text-green-400">{data.state}</span></p>
            <p><strong>Active Stake:</strong> <span className="font-mono">{data.active / 1e9} SOL</span></p>
            <p><strong>Inactive Stake:</strong> <span className="font-mono">{data.inactive / 1e9} SOL</span></p>
        </div>
    );
}

/**
 * This is the main page for checking the status of a stake account.
 * It allows users to input an address and fetches its activation state.
 */
export default function StakePage() {
    const { connection } = useConnection();
    const [stakeAddress, setStakeAddress] = useState<string>('');
    const [addressToQuery, setAddressToQuery] = useState<string>('');

    // Use TanStack Query to manage the data fetching lifecycle.
    const { data, error, isLoading, isError } = useQuery({
        // The query key uniquely identifies this query.
        // It includes the address so the query re-runs when the address changes.
        queryKey: ['stakeActivation', addressToQuery],

        // The queryFn is the actual async function that fetches data.
        // It uses your existing helper function.
        queryFn: async () => {
            assertIsAddress(addressToQuery);
            return fetchStakeState(connection, new PublicKey(addressToQuery));
        },

        // Important: Disable the query from running automatically until an address is set.
        enabled: !!addressToQuery,

        // Don't endlessly retry if the account is not found.
        retry: 1,
    });

    const handleFetch = () => {
        try {
            assertIsAddress(stakeAddress);
            setAddressToQuery(stakeAddress);
        } catch (e) {
            alert('Please enter a valid Solana address.');
        }
    };

    return (
        <div className="container mx-auto p-6 lg:p-10">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Stake Account Inspector</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter a stake account address to check its activation status.
                    </p>
                </div>

                {/* Input Form */}
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter Stake Account Address"
                        value={stakeAddress}
                        onChange={(e) => setStakeAddress(e.target.value)}
                        className="font-mono"
                    />
                    <Button onClick={handleFetch} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Check Status'}
                    </Button>
                </div>

                {/* Results Area */}
                <div className="mt-6">
                    {isLoading && <p className="text-center">Fetching account details...</p>}

                    {isError && (
                        <AppAlert action={null}>
                            <div className="text-center font-semibold text-red-500">
                                <p>Error: Account Not Found</p>
                                <p className="text-sm font-normal text-muted-foreground">
                                    The provided address is not a valid stake account on this network.
                                </p>
                            </div>
                        </AppAlert>
                    )}

                    {data && <StakeResult data={data} />}
                </div>
            </div>
        </div>
    );
}