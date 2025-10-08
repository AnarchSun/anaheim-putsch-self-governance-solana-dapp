// src/lib/stake/stakeHelpers.ts
import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, Signer } from "@solana/web3.js";

export async function createStakeAccountIfNotExists(
    connection: Connection,
    newAccountPubkey: PublicKey,
    payer: Signer,
    signers: Signer[],
    programId: PublicKey,
    lamports: number,
    space: number
): Promise<{ status: string; error?: string; logs?: string[] }> {
  const accountInfo = await connection.getAccountInfo(newAccountPubkey);
  if (accountInfo) {
    return { status: "Compte déjà initialisé", error: "Le compte existe déjà." };
  }
  try {
    const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey,
          lamports,
          space,
          programId,
        })
    );
    const txid = await sendAndConfirmTransaction(connection, tx, [payer, ...signers]);
    return { status: "Initialisation réussie", logs: [`Transaction ID: ${txid}`] };
  } catch (err: any) {
    return { status: "Initialisation échouée", error: err.message, logs: err.logs || [] };
  }
}
