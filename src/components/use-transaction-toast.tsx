// src/components/use-transaction-toast.tsx
import { toast } from 'sonner';
import { ExplorerLink } from "@/components/explorer-link";

// This hook correctly uses a `string` for the signature.
export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent', {
      // The ExplorerLink component likely expects a string signature.
      description: <ExplorerLink path={`tx/${signature}`} label="View Transaction" />,
    });
  };
}

// CORRECTED: The signature parameter is now correctly typed as a string.
export const toastTx = (signature: string) => {
  toast('Transaction sent', {
    description: <ExplorerLink path={`tx/${signature}`} label="View Transaction" />,
  });
};