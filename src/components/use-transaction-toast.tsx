// src/components/use-transaction-toast.tsx
import { toast } from 'sonner'
import {ExplorerLink} from "@/components/explorer-link";

export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent', {
      description: <ExplorerLink transaction={signature} label="View Transaction" address={''} path={''} />,
    })
  }
}
