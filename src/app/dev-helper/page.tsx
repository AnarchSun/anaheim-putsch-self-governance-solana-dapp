// PATH: src/app/dev-helper/page.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: 'error' is defined but never used (@typescript-eslint/no-unused-vars)
// Lyric punk, matrix override, always batch fix. Filename/path toujours!

"use client";

import React, { useState } from 'react';
import { PromptAnalyzer } from '@/components/ui/PromptAnalyzer';

// FIX: Pure ESM, no CommonJS syntax, only export default for page function.
// If any code in your tree or your dependencies uses `module.exports` or `exports.*`, refactor to ESM.

export default function DevHelperPage() {
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAnalyze = async (programName: string, idlInput: string) => {
        if (!programName.trim()) { /* ... validation ... */ }
        if (!idlInput.trim()) { /* ... validation ... */ }
        let parsedIdl;
        try {
            parsedIdl = JSON.parse(idlInput);
        } catch {
            // PATCH: Remove unused 'error' from catch block
            alert('Invalid JSON! Please paste the correct program IDL.');
            return;
        }

        setIsLoading(true);
        setAnalysis('Thinking...');

        try {
            const response = await fetch('/api/gemini-helper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ programIdl: parsedIdl, programName }),
            });

            const data = await response.json();

            // Instead of throwing, handle error in state (fixes warning)
            if (!response.ok) {
                setAnalysis(`Error: ${data.error || 'Something went wrong'}`);
            } else {
                setAnalysis(data.analysis);
            }
        } catch (error: any) {
            setAnalysis(`Network Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="content-box">
                <PromptAnalyzer
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                    analysis={analysis}
                />
            </div>
        </div>
    );
}

// PATCH NOTES:
// - Removed unused 'error' parameter from first catch block for linter compliance
// - Filename/path toujours!