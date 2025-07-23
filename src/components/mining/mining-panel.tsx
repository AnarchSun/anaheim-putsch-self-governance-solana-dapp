// FILE: src/components/mining/MiningPanel.tsx
import React, { useEffect, useState } from "react";
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';
import {ANAHEIM_ACCOUNT_PUBKEY} from "@/lib/anaheim-program";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useWallet} from "@solana/wallet-adapter-react";

function useIncrement() {
    const { program, provider } = useAnaheimProgram();
    const wallet = useWallet();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!provider || !program || !wallet.connected) throw new Error();
            const sig = await program.methods.increment()
                .accounts({ anaheim: ANAHEIM_ACCOUNT_PUBKEY! })
                .rpc();
            const hb = await provider.connection.getLatestBlockhash();
            await provider.connection.confirmTransaction({ signature: sig, ...hb }, 'confirmed');
            return sig;
        },
        onSuccess: () => queryClient.invalidateQueries(['anaheim-account'])
    });
}

export default function MiningPanel() {
    const { program, provider } = useAnaheimProgram();
    const [status, setStatus] = useState<string>("Idle");

    useEffect(() => {
        const mine = async () => {
            if (!provider?.wallet?.publicKey) return;
            setStatus("Mining...");

            try {
                const tx = await program.methods
                    .mine()
                    .accounts({
                        user: provider.wallet.publicKey,
                    })
                    .rpc();

                console.log("Transaction:", tx);
                setStatus("Success!");
            } catch (err) {
                console.error(err);
                setStatus("Error");
            }
        };

        mine();
    }, [program, provider]);

    return (
        <div>
            <h2>Mining Status: {status}</h2>
        </div>
    );
}
