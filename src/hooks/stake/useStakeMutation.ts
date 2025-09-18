// FILE: src/hooks/useStakeMutation.ts
'use client';

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';

export function useStakeMutation() {
  const { publicKey } = useWallet();
  const { program } = useAnaheimProgram();

    const createStake = async () => {
        if (!publicKey || !program) throw new Error("Wallet not connected or program not ready");

        const [stakePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("stake"), publicKey.toBuffer()],
            program.programId
        );

      return await program.methods
          .createStake() // ✅ now available after regen
          .accounts({
            stakeAccount: stakePda,
            user: publicKey,
            systemProgram: SystemProgram.programId,
          } as any)
          .rpc();
    };

    return { createStake };
}
