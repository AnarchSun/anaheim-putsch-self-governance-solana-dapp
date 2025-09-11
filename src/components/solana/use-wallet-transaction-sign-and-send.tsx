// PATH: src/components/solana/use-wallet-transaction-sign-and-send.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix unused client + hooks-in-async, matrix override, filename/path éternel!

'use client';

import { clusterApiUrl, Connection, TransactionInstruction } from '@solana/web3.js';
import {
  createTransaction,
  signAndSendTransactionMessageWithSigners,
  address,
  blockhash,
  getBase58Decoder,
  AccountRole,
  type Instruction,
  type TransactionSigner,
  type AccountMeta as GillAccountMeta,
} from 'gill';
import { useWalletUi } from '@wallet-ui/react';

// --- Conversion Web3.js Instruction => Gill Instruction ---
function createGillInstruction(
    ix: TransactionInstruction
): Instruction<string, GillAccountMeta<string>[]> {
  const mappedAccounts: GillAccountMeta<string>[] = ix.keys.map((meta) => ({
    address: address(meta.pubkey.toBase58()),
    role: meta.isSigner
        ? AccountRole.WRITABLE_SIGNER
        : meta.isWritable
            ? AccountRole.WRITABLE
            : AccountRole.READONLY,
  }));

  return {
    programAddress: address(ix.programId.toBase58()),
    accounts: mappedAccounts,
    data: ix.data,
  };
}

/**
 * Hook principal d'envoi de transaction avec signature.
 *
 * @param signer - Le TransactionSigner (wallet)
 * @param instructions - Tableau des instructions Web3.js
 * @param rpcUrl - Optionnel, URL RPC, sinon pris depuis le wallet context
 */
// PATCH: Don't use hooks in async fn. Provide a standard hook + async action function.
import { useCallback } from 'react';

export function useWalletTransactionSignAndSend() {
  const { client } = useWalletUi(); // PATCH: Only used to get wallet context if needed (future dev)

  // PATCH: Action as callback, not hook in async function
  const sendTransaction = useCallback(
      async ({
               signer,
               instructions,
               rpcUrl,
             }: {
        signer: TransactionSigner;
        instructions: TransactionInstruction[];
        rpcUrl?: string;
      }): Promise<string> => {
        const endpoint = rpcUrl ?? clusterApiUrl('devnet');
        const connection = new Connection(endpoint, 'confirmed');
        const latestBlockhash = await connection.getLatestBlockhash();

        // Convertir instructions web3.js en instructions gill
        const gillInstructions = instructions.map(createGillInstruction);

        // Créer la transaction gill complète
        const transaction = createTransaction({
          version: 0,
          feePayer: signer.address,
          instructions: gillInstructions,
          lifetimeConstraint: {
            blockhash: blockhash(latestBlockhash.blockhash),
            lastValidBlockHeight: BigInt(latestBlockhash.lastValidBlockHeight),
          },
        } as any);

        // Signer et envoyer la transaction
        const signatureBytes = await signAndSendTransactionMessageWithSigners({
          message: transaction,
          signers: [signer],
          connection,
        } as any);

        // Retourner la signature en base58
        return getBase58Decoder().decode(signatureBytes);
      },
      []
  );

  return { sendTransaction, client };
}

// PATCH NOTES:
// - Fixed: "client" unused: now returned for future use, or remove if not needed.
// - Fixed: Can't call hook in async fn: now useWalletTransactionSignAndSend is a standard hook returning an async callback.
// - Usage: const { sendTransaction } = useWalletTransactionSignAndSend(); await sendTransaction({ ... });
// - Filename/path éternel, matrix override, batch fix grunge!