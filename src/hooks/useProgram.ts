// FILE: src/hooks/useProgram.ts
import { useMemo } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Anaheim } from '@/types/anaheim'; // This path must point to your generated types
import { IDL } from '@coral-xyz/anchor/dist/cjs/native/system'

export function useAnaheimProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const provider = useMemo(() => {
        if (wallet.connected && wallet.wallet) {
            return new AnchorProvider(connection, wallet as any, { commitment: "confirmed" });
        }
        return null;
    }, [connection, wallet]);
    const program = useMemo(() => {
        if (provider) {
            return new Program<Anaheim>(IDL, provider);
        }
        return null;
    }, [provider]);
    return { program, provider };
}