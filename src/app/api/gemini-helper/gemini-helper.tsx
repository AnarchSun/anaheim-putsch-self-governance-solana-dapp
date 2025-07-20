// src/app/api/page.tsx
import React, { useState, CSSProperties } from 'react';

// For better Markdown rendering, you could install a library:
// pnpm install react-markdown
// import ReactMarkdown from 'react-markdown';

// Define types for the inline styles for better type safety
const styles: { [key: string]: CSSProperties } = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#e0e0e0', // Light text for dark backgrounds
        backgroundColor: '#1a1a1a', // Dark background
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
        whiteSpace: 'pre-wrap', // This helps in rendering markdown-like text
        lineHeight: '1.6',
        fontFamily: 'monospace',
    },
};


const DevHelperPage: React.FC = () => {
    const [idlInput, setIdlInput] = useState<string>('');
    const [programName, setProgramName] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleAnalyze = async () => {
        let parsedIdl;
        try {
            parsedIdl = JSON.parse(idlInput);
        } catch (error) {
            alert('Invalid JSON! Please paste the correct program IDL.');
            return;
        }

        if (!programName.trim()) {
            alert('Please enter a program name (e.g., anaheim).');
            return;
        }

        setIsLoading(true);
        setAnalysis('');

        try {
            const response = await fetch('/api/gemini-helper', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ programIdl: parsedIdl, programName }),
            });

            const data = await response.json();

            if (response.ok) {
                setAnalysis(data.analysis);
            } else {
                // The error object from our API route has a specific shape
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error: any) {
            setAnalysis(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1>Solana Program Analyzer (Powered by Gemini)</h1>
    <p>
    Paste your program's IDL JSON below to get a detailed analysis.
    Start by pasting the "anaheim" or "journal" object from your IDL.
    </p>

    <input
    type="text"
    placeholder="Enter program name (e.g., anaheim)"
    value={programName}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramName(e.target.value)}
    style={styles.input}
    />

    <textarea
    style={styles.textarea}
    value={idlInput}
    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIdlInput(e.target.value)}
    placeholder='// Paste your program IDL JSON here... (e.g., the "anaheim": { ... } object)'
    />

    <button
        onClick={handleAnalyze}
    disabled={isLoading}
    style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
>
    {isLoading ? 'Analyzing...' : 'Analyze Program'}
    </button>

    {analysis && (
        <div>
            <h2>Analysis Result:</h2>
    <div style={styles.output}>{analysis}</div>
        {/* For richer formatting, uncomment the line below after installing react-markdown */}
        {/* <ReactMarkdown>{analysis}</ReactMarkdown> */}
        </div>
    )}
    </div>
);
};

export default DevHelperPage;