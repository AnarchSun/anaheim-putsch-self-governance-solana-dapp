// FILE: src/app/posts/page.tsx

import PostCard from '@/components/anaheim/PostCard';
import { Key } from 'react';

// This is a placeholder for your actual data fetching logic.
// In a real dApp, this would connect to Solana and call `program.account.postAccount.all()`.
async function getPostsFromChain() {
    // For now, we return mock data.
    return [
        {
            author: '5x...yZ',
            content: 'This is a short post. The summarize button should not appear here.',
            timestamp: Date.now()
        },
        {
            author: 'G2...pD',
            content: 'This is a much, much longer post designed to test the summarization feature. The core idea behind integrating artificial intelligence, specifically a large language model like Gemini, is to enhance the user experience by providing valuable, context-aware features. Instead of forcing users to read through potentially hundreds of words to grasp the main idea of a post, we can offer a simple, one-click solution. This function calls our own backend API, which in turn securely calls the Google AI API. This architecture ensures our secret keys are never exposed on the client-side. The result is then streamed back and displayed right below the post. It is a seamless and powerful addition to any text-heavy application running on the Solana blockchain or any other platform.',
            timestamp: Date.now()
        }
    ];
}

export default async function PostsPage() {
    // ===================================================================
    // FIX: We now provide a default empty array `[]`.
    // If getPostsFromChain() ever returns nothing, `posts` will be `[]`
    // instead of `undefined`, which prevents the .map() crash.
    // ===================================================================
    const posts = (await getPostsFromChain()) || [];

    return (
        // The outer div and its padding have been removed.
        // The layout is now correctly handled by app-layout.tsx and content-box.
        <div>
            <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
            {posts.map((post, index: Key | null | undefined) => (
                <PostCard key={index} post={post} />
            ))}
        </div>
    );
}