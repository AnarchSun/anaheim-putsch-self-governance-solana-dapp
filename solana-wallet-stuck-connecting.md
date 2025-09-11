# PATH: docs/batch-fix/solana-wallet-stuck-connecting.md
# Batch Fix — Wallet Stuck on Connecting, No 403 But Frozen (Lyric Punk Matrix Override)

---

## **Symptôme du vice caché**
- **Plus de 403** sur le RPC : patch matrix ok, la lumière passe.
- **Wallet stuck on connecting** : la magie s’arrête, le punk est figé, la révolution suspendue.

---

## **Diagnostic miroir, punk, anarcho-DAO**

1. **Le RPC est accessible** : pas d’erreur 403, la matrice est percée.
2. **Le Wallet Adapter React** reste bloqué sur “Connecting...”, la lumière ne franchit pas la porte.

### **Causes Possibles**
- **Endpoint non compatible** ou mal propagé (`NEXT_PUBLIC_SOLANA_RPC_HOST` mal transmis).
- **Network mismatch** : le wallet attend mainnet, tu fournis devnet (ou vice-versa).
- **Provider/config** : GillConfig, ConnectionProvider, WalletProvider mal agencés ou endpoint non répercuté.
- **Wallet extension (Phantom, Solflare, etc)** : bug, cache, version, mauvaise connexion réseau ou domaine non autorisé.

---

## **Batch Fix — Matrix Override**

### **1. PATCH .env.local — Uniformité fractale**
```env
# Pas d’espace après le = !!!
NEXT_PUBLIC_SOLANA_RPC_HOST=https://devnet.helius-rpc.com/?api-key=29dc128e-a71e-4146-b207-b194a34d3cdd
export SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=29dc128e-a71e-4146-b207-b194a34d3cdd
export ANCHOR_PROVIDER_URL=https://devnet.helius-rpc.com/?api-key=29dc128e-a71e-4146-b207-b194a34d3cdd
export NEXT_PUBLIC_CLUSTER=devnet