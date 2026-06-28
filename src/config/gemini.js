import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'dummy_gemini_key';

export const ai = new GoogleGenAI({ apiKey });

export default ai;
