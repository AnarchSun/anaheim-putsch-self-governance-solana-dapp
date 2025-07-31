import { useMemo } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Anaheim } from '@/../anchor/target/types/anaheim';
import IDL from '@/lib/idl/anaheim.json';
import { ANAHEIM_PROGRAM_ID } from '@/lib/anaheim-program';

export function useAnaheimProgram(): { program: Program<Anaheim> | null, provider: AnchorProvider | null } {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        if (!wallet?.publicKey || !wallet?.signTransaction) return null;
        return new AnchorProvider(connection, wallet as any, AnchorProvider.defaultOptions());
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<Anaheim>(IDL as any, ANAHEIM_PROGRAM_ID, provider);
    }, [provider]);

    return { program, provider };
}
