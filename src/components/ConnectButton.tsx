// src/components/ConnectButton.tsx
"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectButton() {
    const { connect, connected, publicKey } = useWallet();

    return (
        <button
            onClick={async () => {
                try {
                    await connect();
                } catch (err) {
                    console.error("Wallet connection failed:", err);
                }
            }}
        >
            {connected
                ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...`
                : "Connect"}
        </button>
    );
}
