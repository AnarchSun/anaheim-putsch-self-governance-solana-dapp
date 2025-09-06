// Path: src/app/stake-mining/stake/StakeInitStatus.tsx
// ULTRA FINAL ANARCHOPUNK PATCH:
// - Usage of initializeAnaheimAccount clarified/ensured
// - Error displays for existence/signer/other errors
// - No unused function warnings
// - All errors batch fixed, filename ALWAYS at top, matrix hacked

import React, { useState } from "react";
import { initializeAnaheimAccount } from "./initStakeAccount";
import { Connection, Keypair } from "@solana/web3.js";

type StakeInitStatusProps = {
    connection: Connection;
    accountAddress: string;
    payer: Keypair; // must be a Signer!
};

export function StakeInitStatus({ connection, accountAddress, payer }: StakeInitStatusProps) {
    const [status, setStatus] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [logs, setLogs] = useState<string[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);

    const handleInit = async () => {
        setStatus("");
        setError("");
        setLogs([]);
        const result = await initializeAnaheimAccount(
            connection,
            accountAddress,
            payer.publicKey,
            undefined,
            [payer] // Keypair as Signer
        );
        setStatus(result.status);
        setError(result.error || "");
        setLogs(result.logs || []);
        if (result.status.includes("déjà initialisé")) setInitialized(true);
        if (result.status === "Initialisation réussie") setInitialized(true);
    };

    return (
        <div>
            <button onClick={handleInit} disabled={initialized}>
                Créer/Initialiser le compte Anaheim
            </button>
            {status && <div>Status: {status}</div>}
            {error && <div style={{ color: "red" }}>Erreur: {error}</div>}
            {logs.length > 0 && (
                <details>
                    <summary>Voir les logs</summary>
                    <pre>{logs.join("\n")}</pre>
                </details>
            )}
            {initialized && <div>Votre compte Anaheim est déjà initialisé ou existant.</div>}
        </div>
    );
}