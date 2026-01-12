import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Scenario } from "../types";

// Schema definition for the generative model
const scenarioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          characterName: { type: Type.STRING },
          characterImage: { type: Type.STRING, description: "A keyword description of the character (e.g., 'police officer', 'waiter') to search for an image, not a URL." },
          backgroundImage: { type: Type.STRING, description: "A keyword description of the setting (e.g., 'cafe', 'airport') for image search." },
          text: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING },
                scoreDelta: { type: Type.INTEGER }
              },
              required: ["text", "isCorrect", "feedback", "scoreDelta"]
            }
          }
        },
        required: ["id", "characterName", "characterImage", "text", "options", "backgroundImage"]
      }
    }
  },
  required: ["title", "description", "nodes"]
};

// Helper to map keywords to local cartoon assets
const getImageUrl = (keyword: string, isPortrait: boolean): string => {
  const k = keyword.toLowerCase();

  if (!isPortrait) {
    // Backgrounds
    return "/games/linguaquest/bg_london.png";
  }

  // Characters
  if (k.includes("tourist") || k.includes("alex")) return "/games/linguaquest/alex_confused.png";
  if (k.includes("local") || k.includes("sarah") || k.includes("woman")) return "/games/linguaquest/sarah_base.png";
  if (k.includes("clerk") || k.includes("sato") || k.includes("man") || k.includes("police")) return "/games/linguaquest/sato_base.png";
  if (k.includes("guide") || k.includes("rio") || k.includes("friend")) return "/games/linguaquest/rio_base.png";

  // Fallback
  return "/games/linguaquest/alex_confused.png";
};

export const generateScenario = async (topic: string): Promise<Scenario> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create a roleplay visual novel scenario for learning English.
    Topic: ${topic}.
    Create exactly 5 dialogue nodes.
    The goal is for the user to pick the most polite or grammatically correct option.
    Ensure "characterImage" and "backgroundImage" fields are simple keywords describing the visual (e.g. "angry boss", "office").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scenarioSchema,
      }
    });

    const rawData = response.text;
    if (!rawData) throw new Error("No data returned from Gemini");

    const parsedData = JSON.parse(rawData);

    // Post-process to add real image URLs based on the keywords
    const processedScenario: Scenario = {
      ...parsedData,
      nodes: parsedData.nodes.map((node: any) => ({
        ...node,
        characterImage: getImageUrl(node.characterName, true),
        backgroundImage: getImageUrl(node.backgroundImage, false)
      }))
    };

    return processedScenario;

  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
};