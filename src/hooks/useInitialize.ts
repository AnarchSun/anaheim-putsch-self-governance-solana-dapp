// FILE: src/hooks/useInitialize.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { Program } from '@coral-xyz/anchor';
import { Anaheim } from '@/../anchor/target/types/anaheim';
import { useAnaheimProgram } from './useProgram';

// This is the raw async function for the mobile transaction.
// It is NOT a hook. I've renamed it for clarity.
async function initializeTransaction(program: Program<Anaheim>): Promise<string> {
    // This assumes you have another file with the mobile-specific logic.
    // Let's create a placeholder for now since that logic is complex.
    console.log("Simulating mobile transaction initialization...");

    // In a real mobile app, you would have the 'transact' logic here.
    // For now, we simulate success after a delay.
    return new Promise((resolve) => {
        setTimeout(() => {
            const fakeSignature = "5SimulatedSignatureForMobileInit...andSoOn";
            console.log("Simulated transaction successful with signature:", fakeSignature);
            resolve(fakeSignature);
        }, 2000);
    });
}

// THIS is the actual React Hook you will use in your component.
export function useInitializeMutation() {
    const { program } = useAnaheimProgram();

    return useMutation({
        mutationKey: ['initialize-mobile'],
        // The mutation function calls our async logic.
        mutationFn: () => {
            if (!program) {
                throw new Error("Program is not ready!");
            }
            return initializeTransaction(program);
        },
        onSuccess: (signature) => {
            console.log(`✅ Mutation successful: ${signature}`);
            // Here you would add your toast notifications and query invalidations.
        },
        onError: (error: Error) => {
            console.error(`❌ Mutation failed: ${error.message}`);
        }
    });
}