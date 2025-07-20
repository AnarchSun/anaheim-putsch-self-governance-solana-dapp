// src/components/anaheim/PostCard.tsx

"use client";

import React, { useState, CSSProperties } from 'react';

// ... (interfaces and styles are the same)
interface Post {
    content: string;
    author: string;
    timestamp: number;
}
interface PostCardProps {
    post: Post;
}
const styles: { [key: string]: CSSProperties } = {
    card: { /* styles */ },
    author: { /* styles */ },
    content: { /* styles */ },
    summary: { /* styles */ },
    button: { /* styles */ }
};


const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // --- DEBUG LINE: Log the length of the content for each post ---
    console.log(`Post from ${post.author} has length: ${post.content.length}`);

    const canSummarize = post.content.length > 200;

    // ... (the rest of the component is the same)
    const handleSummarize = async () => { /* ... */ };

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