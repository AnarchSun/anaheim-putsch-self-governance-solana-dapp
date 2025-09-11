// PATH: src/components/solana/stakingButton.tsx
// GRUNGE BATCH FIX — DAO BUTTON — ANARCHY MAGIC — PATCHED JSX COMMENT ERROR

import { useState } from "react";
import { callSolanaRpc } from "@/utils/solana/solanaRpcClient";

// StakingButton: A punk anarcho button to fetch balance and show it
export default function StakingButton({ publicKey }: { publicKey: string }) {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStake = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await callSolanaRpc({
                method: "getBalance",
                params: [publicKey],
                id: Date.now(),
                jsonrpc: "2.0"
            });
            // HACK THE MATRIX: Decode grunge, show balance
            setBalance(result?.result || null);
        } catch (err: any) {
            setError(err?.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleStake}
                disabled={loading || !publicKey}
                style={{
                    padding: "8px 16px",
                    fontWeight: "bold",
                    background: "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px"
                }}
            >
                {loading ? "Loading..." : "Check Balance"}
            </button>
            {/* Grunge info output */}
            <>
                {balance !== null && (
                    <div style={{marginTop: 8, color: "#00ff99", fontFamily: "monospace"}}>
                        Balance: {balance} lamports
                    </div>
                )}
                {error && (
                    <div style={{marginTop: 8, color: "#ff0033", fontFamily: "monospace"}}>
                        Error: {error}
                    </div>
                )}
            </>
        </>
    );
}