import React, { useState, CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#e0e0e0',
        backgroundColor: '#1a1a1a',
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

const DevHelperPage: React.FC = () => {
    const [idlInput, setIdlInput] = useState<string>('');
    const [programName, setProgramName] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

// ...
    const handleAnalyze = async () => {
        let parsedIdl;
        try {
            parsedIdl = JSON.parse(idlInput);
        } catch {
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
                setAnalysis(`Error: ${data.error || 'Something went wrong'}`);
            }
        } catch (err: any) {
            setAnalysis(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div style={styles.container}>
          <h1>Solana Program Analyzer (Powered by Gemini)</h1>
          <p>
              Paste your program&apos;s IDL JSON below to get a detailed analysis.
              Start by pasting the &quot;anaheim&quot; or &quot;journal&quot; object from your IDL.
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
                {/* Pour un rendu markdown, décommentez après installation de react-markdown */}
                {/* <ReactMarkdown>{analysis}</ReactMarkdown> */}
            </div>
          )}
      </div>
    );
};

export default DevHelperPage;
