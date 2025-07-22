// FILE: src/app/stake/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';
import { fetchStakeState } from '@/lib/stake/stakeHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppAlert } from '@/components/app-alert';

/**
 * Renders the results of the stake activation query.
 */
function StakeResult({ data }: { data: any }) {
    // ===================================================================
    // FIX #1: THE `return` STATEMENT IS GUARANTEED.
    // This is the definitive fix for the "cannot be used as a JSX component" error.
    // ===================================================================
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
        // ===================================================================
        // FIX #2: THE `queryFn` NOW PASSES TWO SEPARATE ARGUMENTS.
        // This is what the compiler has been demanding. This resolves the
        // TS2554 "Expected 2 arguments, but got 1" error permanently.
        // ===================================================================
        queryFn: async () => {
            assertIsAddress(addressToQuery);
            return fetchStakeState(connection, new PublicKey(addressToQuery));
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
                    <AppAlert action={null}>
                        <div className="text-center font-semibold text-red-500">
                            <p>Error: {error.message}</p>
                            <p className="text-sm font-normal text-muted-foreground">
                                Please check the address and your network connection.
                            </p>
                        </div>
                    </AppAlert>
                )}

                {/* This line will now work, which resolves the "Unused constant data" warning. */}
                {data && <StakeResult data={data} />}
            </div>
        </div>
    );
}