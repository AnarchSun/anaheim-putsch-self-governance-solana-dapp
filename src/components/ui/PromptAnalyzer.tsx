// FILE: src/components/ui/PromptAnalyzer.tsx

'use client';

import React, { useState, CSSProperties, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';

// These styles are now defined in ONLY ONE PLACE.
const styles: { [key: string]: CSSProperties } = {
    container: {
        fontFamily: 'sans-serif',
        color: '#e0e0e0',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        marginBottom: '1rem',
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        color: '#e0e0e0',
    },
    textarea: {
        width: '100%',
        minHeight: '250px',
        marginBottom: '1rem',
        fontFamily: 'monospace',
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        color: '#e0e0e0',
        fontSize: '14px',
    },
    button: {
        padding: '0.75rem 1.5rem',
        cursor: 'pointer',
        marginBottom: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
    },
    buttonDisabled: {
        backgroundColor: '#555',
        cursor: 'not-allowed',
    },
    output: {
        border: '1px solid #444',
        padding: '1rem',
        backgroundColor: '#2a2a2a',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.6',
        fontFamily: 'monospace',
    },
};

interface PromptAnalyzerProps {
    onAnalyze: (programName: string, idlInput: string) => Promise<void>;
    isLoading: boolean;
    analysis: string;
}

export const PromptAnalyzer: React.FC<PromptAnalyzerProps> = ({ onAnalyze, isLoading, analysis }) => {
    const [idlInput, setIdlInput] = useState<string>('');
    const [programName, setProgramName] = useState<string>('');

    const handleSubmit = () => {
        // FIX: Acknowledge the returned promise and handle potential errors.
        onAnalyze(programName, idlInput).catch((err) => {
            console.error("Analysis submission failed:", err);
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div style={styles.container}>
            <h1>Solana Program Analyzer (Powered by Gemini)</h1>
            <p>
                Paste your program's IDL JSON, then press <b>Enter</b> to analyze.
                <br />
                Use <b>Shift+Enter</b> for a new line.
            </p>

            <input
                type="text"
                placeholder="Enter program name (e.g., anaheim)"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                style={styles.input}
            />

            <textarea
                style={styles.textarea}
                value={idlInput}
                onChange={(e) => setIdlInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='// Paste your program IDL JSON here and press Enter...'
            />

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
            >
                {isLoading ? 'Analyzing...' : 'Send Message (or press Enter)'}
            </button>

            {analysis && (
                <div>
                    <h2>Gemini's Analysis:</h2>
                    <div style={styles.output}>
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};