// FILE: src/app/dev-helper/page.tsx
"use client";

import React, { useState } from 'react';
// Assuming you created this reusable UI component.
import { PromptAnalyzer } from '@/components/ui/PromptAnalyzer';

export default function DevHelperPage() {
    // These state variables are now used by the handleAnalyze function.
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // ===================================================================
    // THIS IS THE CORRECT, FULL IMPLEMENTATION OF THE FUNCTION.
    // It uses all the parameters and state setters, resolving the linter errors.
    // ===================================================================
    const handleAnalyze = async (programName: string, idlInput: string) => {
        if (!programName.trim()) {
            alert('Please enter a program name.');
            return;
        }
        if (!idlInput.trim()) {
            alert('Please paste the program IDL.');
            return;
        }

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

            if (!response.ok) {
                // Use the error message from the API response if available.
                setAnalysis(`Error: ${data.error || 'An unknown error occurred.'}`);
            } else {
                setAnalysis(data.analysis);
            }
        } catch (error: any) {
            setAnalysis(`Error fetching from API: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // This container provides the consistent, centered, boxed layout.
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