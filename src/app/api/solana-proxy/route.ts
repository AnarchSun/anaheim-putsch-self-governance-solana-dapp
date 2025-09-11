// PATH: src/app/api/solana-proxy/route.ts
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: error unused (@typescript-eslint/no-unused-vars)
// Lyric punk, matrix override, always batch fix, always add path and filename

import { NextRequest, NextResponse } from 'next/server'

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";

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
        // PATCH: Remove unused 'error' parameter in catch block
        return new NextResponse("Proxy error", { status: 500 });
    }
}

// PATCH NOTES:
// - Removed unused 'error' parameter in catch block for linter compliance
// - Filename/path toujours!