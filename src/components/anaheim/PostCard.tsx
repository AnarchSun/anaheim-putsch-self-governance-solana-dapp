// FILE: src/components/anaheim/PostCard.tsx

"use client";

import React, { useState, CSSProperties } from 'react';

// This interface is now correctly used by PostCardProps.
interface Post {
    content: string;
    author: string;
    timestamp: number;
}

// ===================================================================
// THIS IS THE DEFINITIVE FIX.
// The `PostCardProps` interface now correctly includes the `post`
// property, which resolves both the "Property 'post' does not exist"
// error and the "Unused interface Post" warning.
// ===================================================================
interface PostCardProps {
    post: Post;
}

const styles: { [key: string]: CSSProperties } = {
    card: {
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        color: '#e0e0e0',
    },
    author: {
        fontSize: '12px',
        color: '#888',
        marginBottom: '8px',
    },
    content: {
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '16px',
    },
    summary: {
        backgroundColor: '#333',
        borderLeft: '3px solid #007bff',
        padding: '8px 12px',
        fontSize: '14px',
        fontStyle: 'italic',
        color: '#ccc',
        marginTop: '12px',
    },
    button: {
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
    }
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const canSummarize = post.content.length > 200;

    const handleSummarize = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch('/api/summarize-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: post.content }),
            });

            const data = await response.json();

            if (!response.ok) {
                setSummary(`Could not generate summary: ${data.error || 'Failed to summarize'}`);
            } else {
                setSummary(data.summary);
            }

        } catch (error: any) {
            setSummary(`Network Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            <p style={styles.author}>Posted by: {post.author}</p>
            <div style={styles.content}>{post.content}</div>

            {canSummarize && !summary && (
                <button onClick={handleSummarize} disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Summarizing...' : 'Summarize with AI'}
                </button>
            )}

            {summary && (
                <div style={styles.summary}>{summary}</div>
            )}
        </div>
    );
};

export default PostCard;