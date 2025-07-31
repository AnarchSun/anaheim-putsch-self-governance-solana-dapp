// FILE: src/app/dev-helper/page.tsx
"use client";

import React, { useState } from 'react';
import { PromptAnalyzer } from '@/components/ui/PromptAnalyzer';

export default function DevHelperPage() {
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAnalyze = async (programName: string, idlInput: string) => {
        if (!programName.trim()) { /* ... validation ... */ }
        if (!idlInput.trim()) { /* ... validation ... */ }
        let parsedIdl;
        try {
            parsedIdl = JSON.parse(idlInput);
        } catch (error) {
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

            // ===================================================================
            // THIS IS THE FIX.
            // Instead of throwing an error, we now handle the bad response
            // directly by setting the error message in the state.
            // This resolves the "'throw' of exception caught locally" warning.
            // ===================================================================
            if (!response.ok) {
                setAnalysis(`Error: ${data.error || 'Something went wrong'}`);
            } else {
                setAnalysis(data.analysis);
            }
        } catch (error: any) {
            // This 'catch' block will now only handle network-level errors
            // (e.g., the server is down, no internet connection).
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
};