# Anaheim Solana Dapp Stake Initialization Error Diagnosis

**Path: src/pages/StakeMining.tsx**  
**Path: src/hooks/solana/useStakeAccount.ts**  
**Path: src/hooks/solana/useSolanaClient.ts**  
**Path: src/hooks/solana/useInitializeStakeAccount.ts**

---

## Error Summary

> **Erreur lors de la récupération du compte de stake**  
> **Adresse Solana invalide**  
> **Programme Non Initialisé**  
> **Votre compte n'existe pas. Cliquez pour le créer.**
>
> **Simulation failed. Message: Transaction simulation failed: Error processing Instruction 2: custom program error: 0x0. Logs:**  
> `Allocate: account Address { address: 3eE8dgdxHmpmHzqVCm5d3MHfyA9VW2LrCQ9EMyWirfKu, base: None } already in use`  
> `"Program 11111111111111111111111111111111 failed: custom program error: 0x0"`  
> `"Program FZ1uRqV9P17MA2QP9ABmsvDP831UBjVicuc82SmrTykw failed: custom program error: 0x0"`

---

## **Batch Error Analysis & Fixes**

### 1. **Account Already Exists**

- The error **"account ... already in use"** means you're trying to create/initialize an account that already exists on Solana.
- Your UI suggests the account doesn't exist, but RPC and program logs say it does.

#### **Fix / Patch**
- Before initializing, **check if the account already exists** using `getAccountInfo` or similar.
- Only initialize if the account is not found (null result).
- If exists, skip creation and proceed as initialized.

**Patch Example for the Stake Account Hook:**
```typescript name=src/hooks/solana/useStakeAccount.ts
import { useSolanaClient } from './useSolanaClient'

export function useStakeAccount(address: string) {
  const { client } = useSolanaClient()
  // PATCH: Check if account exists before initializing
  return useQuery({
    queryKey: ['stake-account', address],
    queryFn: async () => {
      if (!client) throw new Error("Client not ready")
      const accountInfo = await client.rpc.getAccountInfo(address).send()
      if (!accountInfo) {
        // Account doesn't exist, show option to initialize
        return null
      }
      return accountInfo
    }
  })
}