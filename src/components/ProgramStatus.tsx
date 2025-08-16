// src/components/ProgramStatus.tsx
'use client';

import { useAnaheimProgram } from '@/hooks/useAnaheimProgram';

export function ProgramStatus() {
    const { isProgramReady } = useAnaheimProgram();

    return (
        <div>
            Program Initialization Status:
            {isProgramReady ? '✅ Ready!' : '⏳ Program not loaded yet...'}
        </div>
    );
}
