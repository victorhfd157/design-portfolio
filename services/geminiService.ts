import { GoogleGenAI, Chat } from "@google/genai";
import { AI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize the API client
// Note: In a real production app, ensure API_KEY is set in your environment
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });


let chatSession: Chat | null = null;

export const initializeChat = () => {
  if (!chatSession) {
    try {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: AI_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
    }
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "⚠️ API Key not configured. Please add your API KEY to the environment to test the chat.";
  }


  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Sorry, the chat system is currently unavailable.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Sorry, I couldn't process your response.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "An error occurred while connecting to my intelligence. Please try again later.";
  }
};