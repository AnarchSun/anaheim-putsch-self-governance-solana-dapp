// src/app/api/gemini-helper/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI client with your API key from the environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Export a named function for the HTTP method, e.g., POST
export async function POST(req: NextRequest) {
    try {
        const { programIdl, programName } = await req.json();

        if (!programIdl || !programName) {
            return NextResponse.json({ error: 'Program IDL and name are required.' }, { status: 400 });
        }

        // --- THIS IS THE CORRECTED LINE ---
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      You are a senior Solana developer and expert smart contract auditor.
      Based on the following Solana program IDL for a program named "${programName}", provide a comprehensive analysis in Markdown format.

      The analysis should include:
      1.  **High-Level Summary**: What is the likely purpose of this program?
      2.  **Accounts Analysis**: Describe the purpose of each account struct (e.g., 'anaheimAccount', 'postAccount', 'userAccount').
      3.  **Instructions Breakdown**: Detail what each instruction does, which accounts it modifies, and its arguments.
      4.  **Potential Security Considerations or Improvements**: Based on the structure, suggest any potential areas to double-check for security or logic improvements.

      Here is the program IDL:
      \`\`\`json
      ${JSON.stringify(programIdl, null, 2)}
      \`\`\`
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ analysis: text });

    } catch (error: any) {
        console.error('Error calling Gemini API:', error);
        // Return the actual error message from Gemini for better debugging
        return NextResponse.json({ error: error.message || 'Failed to get analysis' }, { status: 500 });
    }
}