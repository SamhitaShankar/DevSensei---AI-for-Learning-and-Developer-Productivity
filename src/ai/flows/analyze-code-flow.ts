'use server';
/**
 * DevSensei Code Analysis Flow
 * Optimized version with repo tree caching
 */

import { z } from "genkit";

const AnalyzeCodeInputSchema = z.object({
  selectedCode: z.string(),
  feature: z.string(),
  difficulty: z.boolean().optional(),
  userMessage: z.string().optional(),
  conversationHistory: z.array(z.any()).optional(),
  repoTree: z.string().optional()
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

export type AnalyzeCodeOutput = {
  type: "fallback" | "structured";
  content: any;
  raw?: string;
};

/**
 * Session cache for repo tree
 * Prevents sending huge repo data every request
 */
let cachedRepoTree: string | null = null;

export async function analyzeCode(
  input: AnalyzeCodeInput
): Promise<AnalyzeCodeOutput> {

  const {
    feature,
    selectedCode,
    conversationHistory,
    userMessage,
    repoTree
  } = input;

  /**
   * Safe payload limits
   */
  const MAX_CODE_LENGTH = 15000;   // ~350 lines
  const MAX_TREE_LENGTH = 25000;
  const MAX_HISTORY = 6;

  const safeCode =
    selectedCode?.length > MAX_CODE_LENGTH
      ? selectedCode.slice(0, MAX_CODE_LENGTH)
      : selectedCode || "";

  /**
   * Cache repo tree once
   */
  if (repoTree && !cachedRepoTree) {

    cachedRepoTree =
      repoTree.length > MAX_TREE_LENGTH
        ? repoTree.slice(0, MAX_TREE_LENGTH)
        : repoTree;

    console.log("DevSensei cached repository tree");
  }

  const safeHistory =
    conversationHistory?.slice(-MAX_HISTORY) || [];

  /**
   * Only send repo tree first time
   */
  const repoContext = cachedRepoTree || "";

  try {

    console.log("DevSensei request", {
      feature,
      codeLength: safeCode.length,
      repoTreeLength: repoContext.length,
      historyItems: safeHistory.length
    });

    const response = await fetch(
      "https://cgrk3vi80i.execute-api.us-east-1.amazonaws.com/default/devsensei-backend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          feature,
          selectedCode: safeCode,
          history: safeHistory,
          userMessage: userMessage || "",
          repoTree: repoContext
        })
      }
    );

    /**
     * Handle Lambda HTTP errors
     */
    if (!response.ok) {

      const text = await response.text();

      console.error("DevSensei Lambda HTTP error", {
        status: response.status,
        body: text
      });

      return {
        type: "fallback",
        content:
          "The Sensei backend returned an error. Please try again.",
        raw: `HTTP ${response.status}: ${text}`
      };
    }

    const data = await response.json();

    /**
     * Handle AI errors
     */
    if (data?.error) {

      console.error("DevSensei analysis error", data);

      return {
        type: "fallback",
        content:
          data.raw ||
          "The Sensei encountered an issue while analyzing the code.",
        raw: JSON.stringify(data)
      };
    }

    return {
      type: "structured",
      content: data
    };

  } catch (error: any) {

    console.error("DevSensei network failure", error);

    return {
      type: "fallback",
      content:
        "Connection to the Sensei was lost. Check your network.",
      raw: error?.message || "Unknown error"
    };
  }
}