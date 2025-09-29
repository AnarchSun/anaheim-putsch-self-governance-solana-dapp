// src/components/ProgramStatus.tsx
'use client';

import {useAnaheimProgram} from "../../anchor/src";

export function ProgramStatus() {
    const { isProgramReady } = useAnaheimProgram();

    return (
        <div>
            Program Initialization Status:
            {isProgramReady ? '✅ Ready!' : '⏳ Program not loaded yet...'}
        </div>
    );
}