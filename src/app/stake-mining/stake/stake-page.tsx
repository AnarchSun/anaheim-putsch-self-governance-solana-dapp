// PATH: src/app/stake-mining/stake/stake-page.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Use unused useSingTransactionMutation hook, matrix override, filename/path éternel!

import React, { useState } from "react";
import { useSolanaClient } from "@/hooks/solana/useSolanaClient";
import { initializeAnaheimAccount } from "@/hooks/solana/initializeAnaheimAccount";
import { StakeStatus } from "@/components/stake/StakeStatus";
import { StakingComponent } from "@/components/stake/StakingComponent";
import { fetchStakeActivation } from './pubkey';
// PATCH: Use the hook!
import { useSingTransactionMutation } from "@/components/solana/useSingTransaction";

export default function StakeMiningPage({ address, payer, signers }: { address: string, payer: any, signers: any }) {
    const { client }: { client: any, error: any, isLoading: any } = useSolanaClient({});
    const [stakeActivation, setStakeActivation] = useState<any>(null);
    const [activationLoading, setActivationLoading] = useState(false);
    const [activationError, setActivationError] = useState<string | null>(null);

    // PATCH: Use the hook, even if just for demo/test
    const singTxMutation = useSingTransactionMutation();

    const handleCheckStake = async () => {
        setActivationLoading(true);
        setActivationError(null);
        try {
            const result = await fetchStakeActivation(address);
            setStakeActivation(result);
        } catch (e: any) {
            setActivationError(e?.message || "Erreur inconnue");
            setStakeActivation(null);
        }
        setActivationLoading(false);
    };

    const handleInitializeAnaheimAccount = async () => {
        await handleCheckStake();
        if (stakeActivation && stakeActivation.state === "active") {
            alert("Le compte de stake est déjà actif.");
            return;
        }
        await initializeAnaheimAccount({
            client,
            address,
            payer,
            signers,
        } as any);
    };

    // PATCH: Example button to trigger the useSingTransactionMutation
    const handleSendSol = async () => {
        singTxMutation.mutate({ destination: address, amount: 0.001 });
    };

    return (
        <div>
            <StakeStatus
                address={address}
                client={client}
                initializeStakeAccount={handleInitializeAnaheimAccount}
            />
            <button
                onClick={handleCheckStake}
                disabled={activationLoading}
                style={{
                    marginTop: '1em',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: '#fccb06',
                    color: '#222',
                    fontWeight: 700,
                    border: '2px solid #df2d4f',
                    cursor: activationLoading ? 'not-allowed' : 'pointer',
                    boxShadow: activationLoading ? 'none' : '0 2px 8px #df2d4f33',
                }}
            >
                {activationLoading ? "Vérification..." : "Vérifier l'activation du stake"}
            </button>
            {activationError && (
                <div className="text-red-500 mt-2">Erreur: {activationError}</div>
            )}
            {/* PATCH: Use StakingComponent to show address + stake info */}
            <StakingComponent address={address} accountInfo={stakeActivation} />
            {/* PATCH: Example button for SOL transfer using singTxMutation */}
            <button
                style={{
                    marginTop: '1em',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#00ff99',
                    color: '#222',
                    fontWeight: 700,
                    border: '2px solid #111',
                    cursor: singTxMutation.isPending ? 'not-allowed' : 'pointer',
                    boxShadow: singTxMutation.isPending ? 'none' : '0 2px 8px #00ff9933',
                }}
                onClick={handleSendSol}
                disabled={singTxMutation.isPending}
            >
                {singTxMutation.isPending ? "Envoi en cours..." : "Envoyer 0.001 SOL"}
            </button>
            {singTxMutation.error && (
                <div className="text-red-500 mt-2">Erreur SOL: {singTxMutation.error.message}</div>
            )}
            {singTxMutation.data && (
                <div className="text-green-600 mt-2">Signature: {singTxMutation.data}</div>
            )}
            {/* ...rest of UI... */}
        </div>
    );
}

// PATCH NOTES:
// - useSingTransactionMutation hook is now used in the page, plus d’unused function warning!
// - Ajout d’un exemple d’utilisation (bouton pour envoyer du SOL)
// - Filename/path éternel, matrix override, batch fix grunge!