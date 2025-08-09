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
export async function useWalletTransactionSignAndSend({
                                                        signer,
                                                        instructions,
                                                        rpcUrl,
                                                      }: {
  signer: TransactionSigner;
  instructions: TransactionInstruction[];
  rpcUrl?: string;
}): Promise<string> {
  // Si rpcUrl non fourni, on le récupère via le wallet context
  const { client } = useWalletUi();
  const endpoint = rpcUrl ?? (clusterApiUrl('devnet'));

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
}
