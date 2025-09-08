import React from "react";
import { useSolanaClient } from "@/hooks/solana/useSolanaClient";
import { initializeAnaheimAccount } from "@/hooks/solana/initializeAnaheimAccount";
import { StakeStatus } from "@/components/stake/StakeStatus";

export default function StakeMiningPage({ address, payer, signers }: { address: string, payer: any, signers: any }) {
    const { client}: { client: any, error: any, isLoading: any } = useSolanaClient({});

    return (
        <StakeStatus
            address={address}
            client={client}
            initializeStakeAccount={(address, client) =>
                initializeAnaheimAccount(client, address, payer, signers)
            }
        />
    );
}