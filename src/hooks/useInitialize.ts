// src/hooks/useInitialize.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { toast } from 'sonner';
import { useAnaheimProgram } from '@/lib/anaheim-program';
import {initialize} from "esbuild";
import {AnchorProvider} from "@coral-xyz/anchor";

export function useInitializeMutation() {
    const queryClient = useQueryClient();
    const { program, provider } = useAnaheimProgram(AnchorProvider);
    const { publicKey } = useWallet();

    return useMutation({
        mutationKey: ['initialize-program', publicKey?.toBase58()],
        mutationFn: async () => {
            if (!program || !provider || !publicKey) {
                throw new Error('Wallet, program, or provider is not ready!');
            }

            // Derive PDA + bump
            const [pda, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from('anaheim'), publicKey.toBuffer()],
                program.programId
            );

            // Read the live IDL to know what initialize expects
            const initIx = (program.idl.instructions as any[]).find(i => i.name === 'initialize');
            if (!initIx) throw new Error('initialize instruction not found in IDL');

            // Does initialize need a bump arg?
            const needsBump = Array.isArray(initIx.args) && initIx.args.length > 0;

            // Figure out the account field names from IDL
            const anaheimField =
                initIx.accounts.find((a: any) => a.name === 'anaheim_account') ? 'anaheim_account' :
                    initIx.accounts.find((a: any) => a.name === 'anaheim') ? 'anaheim' :
                        null;

            if (!anaheimField) {
                throw new Error('Could not find anaheim/anaheim_account in IDL');
            }

            // System program field name (usually "system_program")
            const sysField =
                (initIx.accounts.find((a: any) => a.address === '11111111111111111111111111111111')?.name) ||
                'system_program';

            // Build accounts map dynamically to satisfy whichever IDL you have
            const accounts: any = {
                [anaheimField]: pda,
                payer: publicKey,
                [sysField]: SystemProgram.programId,
            };

            // Call initialize with or without bump
            const builder = needsBump
                ? (program.methods as any).initialize(bump)
                : (program.methods as any).initialize();

            return await builder.accounts(accounts).rpc();
        },
        onSuccess: (signature) => {
            toast.success('Program initialized successfully!', {
                description: `Transaction: ${signature}`,
                action: {
                    label: 'View',
                    onClick: () => window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank'),
                },
            });
            queryClient.invalidateQueries({ queryKey: ['anaheim-account', publicKey?.toBase58()] });
        },
        onError: (error: Error) => {
            console.error('❌ Initialization Mutation failed:', error);
            toast.error('Initialization failed!', { description: error.message });
        },
    });
}
