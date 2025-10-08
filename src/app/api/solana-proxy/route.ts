// PATH: src/app/api/solana-proxy/route.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: Use SOLANA_RPC_URL from config/solana.ts, error unused (@typescript-eslint/no-unused-vars), always add path and filename!

import { NextRequest, NextResponse } from 'next/server'
// PATCH: Import the true punk config, stop hardcoding!
import { SOLANA_CLUSTER_URL as SOLANA_RPC_URL } from "@/config/solana";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const origin = req.headers.get("origin") || "";
    const headers = {
        "Content-Type": "application/json",
        ...(origin ? { "Origin": origin } : {})
    };
    try {
        const res = await fetch(SOLANA_RPC_URL, {
            method: "POST",
            headers,
            body,
        });
        const result = await res.text();
        return new NextResponse(result, { status: res.status });
    } catch {
        // PATCH: Remove unused 'error' parameter in catch block for linter compliance
        return new NextResponse("Proxy error", { status: 500 });
    }
}

// PATCH NOTES:
// - SOLANA_RPC_URL now imported from config/solana.ts (not hardcoded)
// - Removed unused 'error' parameter in catch block for linter compliance
// - Filename/path éternel, batch fix, matrix override!