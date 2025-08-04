// src/components/use-transaction-toast.tsx
import { toast } from 'sonner'
import { ExplorerLink } from "@/components/explorer-link"
import {Signature, SignatureBytes} from "gill";

export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent', {
      description: <ExplorerLink transaction={signature} label="View Transaction" address={''} path={''} />,
    })
  }
}

// ➕ ajout d’une export direct
export const toastTx = (signature: xdr.Signer) => {
  toast('Transaction sent', {
    description: <ExplorerLink transaction={signature} label="View Transaction" address={''} path={''} />,
  })
}
