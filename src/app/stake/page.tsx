// FILE: src/app/stake/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';

// Assuming your helper is here.
import { fetchStakeState } from '@/lib/stake/stakeHelpers';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppAlert } from '@/components/app-alert';

/**
 * Renders the results of the stake activation query.
 */
function StakeResult({ data }: { data: any }) { // TODO: Replace 'any' with a proper type
    return (
        <div className="mt-4 space-y-2 rounded-lg border bg-card p-4 text-left">
            <h3 className="text-lg font-bold">Stake Account Details</h3>
            <p><strong>State:</strong> <span className="font-mono text-green-400">{data.state}</span></p>
            <p><strong>Active Stake:</strong> <span className="font-mono">{(data.active / 1e9).toFixed(9)} SOL</span></p>
            <p><strong>Inactive Stake:</strong> <span className="font-mono">{(data.inactive / 1e9).toFixed(9)} SOL</span></p>
        </div>
    );
}

/**
 * Main page for checking the status of a stake account.
 */
export default function StakePage() {
    const { connection } = useConnection();
    const [stakeAddress, setStakeAddress] = useState<string>('');
    const [addressToQuery, setAddressToQuery] = useState<string>('');

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['stakeActivation', addressToQuery],
        queryFn: async () => {
            assertIsAddress(addressToQuery);
            return fetchStakeState({
                connection,
                address: new PublicKey(addressToQuery)
            });
        },
        enabled: !!addressToQuery,
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

    // ===================================================================
    // THIS IS THE FIX.
    // The outer div no longer has conflicting layout classes like 'container' or 'mx-auto'.
    // It will now fit perfectly inside the .content-box provided by app-layout.tsx.
    // ===================================================================
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Stake Account Inspector</h1>
                <p className="text-muted-foreground mt-2">
                    Enter a stake account address to check its activation status.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Enter Stake Account Address"
                    value={stakeAddress}
                    onChange={(e) => setStakeAddress(e.target.value)}
                    className="font-mono"
                />
                <Button onClick={handleFetch} disabled={isLoading || !stakeAddress}>
                    {isLoading ? 'Loading...' : 'Check Status'}
                </Button>
            </div>

            <div className="mt-6">
                {isLoading && <p className="text-center">Fetching account details...</p>}

                {isError && (
                    <AppAlert>
                        <div className="text-center font-semibold text-red-500">
                            <p>Error: {error.message}</p>
                            <p className="text-sm font-normal text-muted-foreground">
                                Please check the address and your network connection.
                            </p>
                        </div>
                    </AppAlert>
                )}

                {data && <StakeResult data={data} />}
            </div>
        </div>
    );
}