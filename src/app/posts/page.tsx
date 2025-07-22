// FILE: src/app/posts/page.tsx

import PostCard from '@/components/anaheim/PostCard';
import { Key } from 'react';

// This is a placeholder for your actual data fetching logic.
async function getPostsFromChain() {
    const mockPosts = [
        {
            author: '5x...yZ',
            content: 'This is a short post. No button should appear here.',
            timestamp: Date.now()
        },
        {
            author: 'G2...pD',
            content: 'This is a much, much longer post designed to test the summarization feature. The core idea behind integrating artificial intelligence is to enhance the user experience by providing valuable, context-aware features instead of forcing users to read through potentially hundreds of words to grasp the main idea of a post.',
            timestamp: Date.now()
        }
    ];

    // ===================================================================
    // THIS IS THE FIX.
    // By adding `return`, the function now correctly returns a Promise
    // that resolves to an array, fixing the TypeScript error.
    // =================================g==================================
    return mockPosts;
}

export default async function PostsPage() {
    const posts = (await getPostsFromChain()) || [];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
            {posts.map((post, index: Key | null | undefined) => (
                <PostCard key={index} post={post} />
            ))}
        </div>
    );
}