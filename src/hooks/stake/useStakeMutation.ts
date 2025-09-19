// PATH: src/hooks/useStakeMutation.ts
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useAnaheimProgram } from '@/hooks/useAnaheimProgram'

export function useStakeMutation() {
    const { publicKey } = useWallet()
    const { program } = useAnaheimProgram()

    const createStake = async () => {
        if (!publicKey || !program) throw new Error('Wallet/program manquant')

        const [stakePda] = PublicKey.findProgramAddressSync(
            [Buffer.from('stake'), publicKey.toBuffer()],
            program.programId
        )

        return await program.methods
            .createStake()
            .accounts({
                stake: stakePda,          // ✅ match le nom dans le Rust
                user: publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc()
    }

    return { createStake }
}
