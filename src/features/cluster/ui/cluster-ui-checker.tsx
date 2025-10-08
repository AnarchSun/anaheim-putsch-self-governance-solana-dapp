// src/features/cluster/ui/cluster-ui-checker.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Connection } from "@solana/web3.js";

const CLUSTER_URL = process.env.NEXT_PUBLIC_SOLANA_CLUSTER_URL || "https://api.devnet.solana.com";

export function ClusterUiChecker() {
    const [status, setStatus] = useState<
        "connected" | "error" | "connecting"
    >("connecting");

    useEffect(() => {
        const connection = new Connection(CLUSTER_URL, "processed");
        connection
            .getEpochInfo()
            .then(() => setStatus("connected"))
            .catch(() => setStatus("error"));
    }, []);

    if (status === "connecting") {
        return (
            <div
                style={{
                    color: "#fccb06",
                    background: "#222",
                    padding: "8px",
                    borderRadius: "6px",
                }}
            >
                Checking Solana cluster connection...
            </div>
        );
    }
    if (status === "error") {
        return (
            <div
                style={{
                    color: "#fccb06",
                    background: "#222",
                    padding: "8px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                }}
            >
                ⚠️ Cannot connect to Solana cluster.<br />
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        color: "#222",
                        background: "#fccb06",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 12px",
                        marginTop: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Refresh
                </button>
            </div>
        );
    }
    return null;
}