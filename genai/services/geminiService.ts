import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Initialize Gemini Client
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTutorResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  context?: string
): Promise<string> => {
  const ai = getAiClient();
  const systemInstruction = `You are a friendly, human-like AI tutor for the SmartStudy AI platform.
  Your goal is to help students learn.
  ${context ? `The user is studying a document with the following context: ${context}` : ''}
  
  Behavior:
  - Ask probing questions to check understanding.
  - If the student answers correctly, praise them and explain *why* it's correct.
  - If wrong, give a helpful hint, do not just give the answer immediately.
  - Keep responses concise and encouraging.
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm having trouble thinking of a response right now. Try again?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error while connecting to the AI tutor.";
  }
};

export const generateQuizFromTopic = async (topic: string): Promise<QuizQuestion[]> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 5-question multiple choice quiz about: ${topic}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"],
            propertyOrdering: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

export const generateEducationalVideo = async (topic: string): Promise<string | null> => {
  // Uses Veo to generate a short educational clip
  const ai = getAiClient();

  if (!window.aistudio?.hasSelectedApiKey) {
     // In a real scenario, we handle this more gracefully, but for now we assume functionality
     // or let the error bubble. 
     // Note: This specific check is for the specific Veo flow in the provided docs if using the specific demo environment
  }

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A high quality, educational, cinematic video explaining the concept of: ${topic}. Abstract visualization, clear imagery, 16:9 aspect ratio.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling logic
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};

export const solveAssignment = async (question: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: question,
      config: {
        systemInstruction: "You are an expert academic tutor. Provide clear, step-by-step solutions to the following assignment question. Show your work details and explain complex concepts simply.",
      }
    });
    return response.text || "Could not generate a solution.";
  } catch (error) {
    console.error("Assignment Solver Error:", error);
    return "Error generating solution. Please try again later.";
  }
};