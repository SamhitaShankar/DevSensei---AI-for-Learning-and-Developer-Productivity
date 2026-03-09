import {genkit} from 'genkit';

/**
 * Genkit instance configured without the Google AI plugin.
 * This keeps the framework structure intact while removing the Gemini dependency.
 */
export const ai = genkit({
  plugins: [],
});
