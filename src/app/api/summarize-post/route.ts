// src/app/api/summarize-post/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json();

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Post content is required and must be a string.' }, { status: 400 });
        }

        // Use the fast and efficient flash model for this task
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      You are a helpful text summarizer. Summarize the following post content into a single, concise sentence.
      Do not add any preamble like "Here is the summary:". Just provide the summary sentence itself.

      POST CONTENT:
      """
      ${content}
      """
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return NextResponse.json({ summary });

    } catch (error: any) {
        console.error('Error in summarize-post API:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
    }
}