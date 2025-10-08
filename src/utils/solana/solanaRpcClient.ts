// GRUNGE BATCH FIX — HACK THE MATRIX — SOLANA CLIENT
// Path: src/utils/solana/solanaRpcClient.ts

// Remove unused imports, fix and clarify function types for anarcho-DAO

/**
 * Calls Solana RPC via backend proxy to bypass CORS/403/Forbidden.
 * @param jsonRpcBody - The JSON-RPC request object (method, params, id, etc)
 * @returns Promise resolving to the RPC response
 */
export async function callSolanaRpc(jsonRpcBody: object): Promise<any> {
    const res = await fetch("/api/solana-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonRpcBody),
    });
    return await res.json();
}