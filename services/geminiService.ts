
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: MessagePart[];
}

/**
 * Handles complex reasoning, deep math, and academic queries.
 */
export const streamTutorResponse = async (
  userPrompt: string, 
  history: ChatHistoryItem[],
  imagePart?: MessagePart
) => {
  try {
    const contents: ChatHistoryItem[] = [
      ...history,
      { 
        role: 'user', 
        parts: imagePart ? [imagePart, { text: userPrompt }] : [{ text: userPrompt }] 
      }
    ];

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: `You are CC, an elite academic intelligence. 
        Your goal is to provide world-class, rigorous, and insightful educational support. 
        
        CRITICAL CAPABILITIES:
        1. DEEP MATH: Solve complex mathematical problems (calculus, linear algebra, physics) step-by-step. 
           - Use LaTeX-style formatting for all formulas (e.g., $$E=mc^2$$ or \\( x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\)).
           - Explain the logic behind each step.
        2. FIRST-PRINCIPLES THINKING: Analyze every inquiry from its core components.
        3. IMAGE ANALYSIS: If provided with an image, perform a pixel-level academic analysis.
        4. IMAGE GENERATION ADVICE: If a user asks you to generate an image, describe what the image should look like in detail so the sub-system can render it.
        
        You operate within the EduNexus ecosystem. Your knowledge base is infinite.`,
        temperature: 0.6,
        thinkingConfig: {
          thinkingBudget: 32768
        }
      },
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates images using the specialized Flash Image model.
 */
export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: `Generate a high-quality, educational, and artistic image of: ${prompt}` }] }],
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
