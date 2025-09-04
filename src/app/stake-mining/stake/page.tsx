// FILE: src/app/stake/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query'; // Removed useQueryClient
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { assertIsAddress } from '@solana/addresses';
import { fetchStakeState } from '@/lib/stake/stakeHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppAlert } from '@/components/app-alert';
import { useAnaheimProgram } from '@/hooks/useProgram';
import { toast } from 'sonner';

function StakeResult({ data }: { data: any }) { /* ... */ }

export default function StakePage() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { program } = useAnaheimProgram();

    // ✅ FIX: The unused `queryClient` constant has been removed.
    // const queryClient = useQueryClient();

    const [manualAddress, setManualAddress] = useState<string>('');
    const [stakePda, setStakePda] = useState<PublicKey | null>(null);

    const { data: stakeData, error, isLoading, isError } = useQuery({
        queryKey: ['stakeActivation', stakePda?.toBase58()],
        queryFn: async () => {
            if (!stakePda) return null;
            return await fetchStakeState(connection, stakePda);
        },
        enabled: !!stakePda,
    });

    const getOrCreateStakeMutation = useMutation({
        mutationFn: async () => {
            // ... (mutation logic is the same and correct)
            if (!program || !publicKey) {
                throw new Error("Program or wallet not ready!");
            }
            const [pda] = PublicKey.findProgramAddressSync(
                [Buffer.from("stake"), publicKey.toBuffer()],
                program.programId
            );
            const accountInfo = await connection.getAccountInfo(pda);
            if (accountInfo) {
                toast.success("Found existing stake account!");
                return { pda };
            }
            // ... (creation logic)
            return { pda };
        },
        onSuccess: ({ pda }) => {
            // Setting the stakePda is enough to trigger the useQuery to refetch.
            setStakePda(pda);
        },
        onError: (err: any) => {
            toast.error('Operation failed', { description: err.message });
        },
    });

    const handleManualFetch = () => {
        try {
            assertIsAddress(manualAddress);
            setStakePda(new PublicKey(manualAddress));
        } catch {
            toast.error("Invalid Solana address entered.");
        }
    };

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            {/* ... (Your JSX is correct and does not need changes) ... */}
            <div className="text-center">
                <h1 className="text-3xl font-bold">Stake Account Inspector</h1>
                <p>...</p>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Enter Stake Account Address"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                />
                <Button onClick={handleManualFetch} disabled={isLoading || !manualAddress.trim()}>
                    Check Status
                </Button>
            </div>

            <Button
                onClick={() => getOrCreateStakeMutation.mutate()}
                disabled={!program || !publicKey || getOrCreateStakeMutation.isPending}
            >
                {getOrCreateStakeMutation.isPending ? 'Working...' : 'Get / Create My Stake Account'}
            </Button>

            {stakePda && (
                <div className="p-2 bg-muted rounded-md text-center">
                    <p className="text-sm"><strong>Your Stake Account PDA:</strong></p>
                    <p className="font-mono text-xs">{stakePda.toBase58()}</p>
                </div>
            )}

            <div className="mt-6">
                {isLoading && <p>Fetching account details...</p>}
                {isError && <AppAlert>Error: {error?.message}</AppAlert>}
                {stakeData && <StakeResult data={stakeData} />}
            </div>
        </div>
    );
}