
'use server';
/**
 * @fileOverview A code analysis agent for DevSensei integrated with AWS Lambda.
 */

import { z } from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  selectedCode: z.string().describe('The source code snippet to analyze.'),
  feature: z.string().describe('The type of analysis requested.'),
  difficulty: z.boolean().optional().describe('Whether to provide advanced technical insights.'),
  userMessage: z.string().optional().describe('The specific query or action description from the user.'),
  conversationHistory: z.array(z.any()).optional().describe('The recent conversation history to provide context.'),
  repoTree: z.string().optional().describe('The full repository file structure in string format.'),
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

export type AnalyzeCodeOutput = {
  type: "fallback" | "structured";
  content: any;
  raw?: string;
};

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  const { feature, selectedCode, conversationHistory, userMessage, repoTree } = input;

  try {
    const response = await fetch("https://cgrk3vi80i.execute-api.us-east-1.amazonaws.com/default/devsensei-backend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        feature,
        selectedCode,
        history: conversationHistory || [],
        userMessage,
        repoTree: repoTree || ""
      })
    });

    if (!response.ok) {
      return { 
        type: "fallback", 
        content: "The Sensei is momentarily unavailable. Please try again.", 
        raw: `HTTP Error: ${response.status}` 
      };
    }

    const data = await response.json();

    if (data.error) {
      return { 
        type: "fallback", 
        content: data.raw || "An error occurred during analysis.", 
        raw: data.raw 
      };
    }

    return { type: "structured", content: data };
  } catch (error: any) {
    return { 
      type: "fallback", 
      content: "Connection to the Sensei's wisdom was lost. Check your network.", 
      raw: error.message 
    };
  }
}
