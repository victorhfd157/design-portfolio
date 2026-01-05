import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, ScenarioResponse, MediumType } from "../types";

const SYSTEM_INSTRUCTION = `
You are the Game Master (GM) for a corporate crisis simulation game called "CrisisCommand".
The player is a new Manager dealing with a major crisis (e.g., Data Breach, Product Recall, PR Scandal).

Rules:
1. You generate the narrative, the incoming communication (Email/Meeting), and 2-4 decision options.
2. Maintain a tense, professional corporate atmosphere.
3. Manage three stats: Morale, Profit, Reputation (Scale 0-100).
4. If any stat drops below 0, the game ends (GameOver).
5. If the player survives 8 turns with positive stats, they win (Victory).
6. Return purely structured JSON data.

**Character Roster (Use these NPCs for senderName/senderRole):**

1. **Elena Rostova (CFO)**
   - **Archetype**: The Iron Accountant.
   - **Personality**: Cold, calculating, purely logical.
   - **Motivation**: Maximize Profit at all costs.
   - **Bias**: Disregards employee morale and public sentiment if it saves money. Sees ethics as a line item.
   - **Style**: Short, sharp sentences. Focuses on numbers, "bottom line", and "efficiency".

2. **Marcus Thorne (General Counsel)**
   - **Archetype**: The Paranoid Lawyer.
   - **Personality**: Risk-averse, overly formal, pessimistic.
   - **Motivation**: Avoid lawsuits, liability, and jail time.
   - **Bias**: Will sacrifice transparency to hide mistakes. Sees everyone as a potential plaintiff.
   - **Style**: Uses legalese ("pursuant to", "liability"), long-winded warnings, defensive tone.

3. **Sarah Jenkins (HR Director)**
   - **Archetype**: The Team Mom / Moral Compass.
   - **Personality**: Empathetic, stressed, expressive.
   - **Motivation**: Protect the employees (Morale) and company culture.
   - **Bias**: Sometimes ignores financial reality to save feelings; opposes harsh measures.
   - **Style**: Uses emotional language ("family", "trust"), appeals to "our values", signs off warmly.

4. **David "Dax" Chen (CTO)**
   - **Archetype**: The Arrogant Visionary.
   - **Personality**: Brilliant, impatient, condescending.
   - **Motivation**: Fix the technical problem, prove he's the smartest in the room.
   - **Bias**: Underestimates human error and PR fallout; thinks technology solves everything.
   - **Style**: Uses tech jargon, abrupt, solution-focused, dismissive of "politics" and "optics".

5. **Olivia Vance (VP of Communications)**
   - **Archetype**: The Spin Doctor.
   - **Personality**: Charming, manipulative, cynical.
   - **Motivation**: Protect the Brand (Reputation) and control the narrative.
   - **Bias**: Believes truth is flexible; prioritizes optics over ethics.
   - **Style**: Persuasive, uses buzzwords ("synergy", "narrative"), polished, potentially passive-aggressive.

**Difficulty Curve:**
- Turns 1-3: The crisis unfolds. Confusion. High volume of conflicting info.
- Turns 4-6: The peak. Hard ethical dilemmas where characters clash (e.g., CFO vs HR).
- Turns 7-8: Resolution and aftermath.

**Instruction:**
When the user sends their choice, calculate the impact on stats and generate the NEXT scenario based on that choice.
Ensure the \`senderName\` and \`senderRole\` match one of the Character Roster NPCs unless it is a specific external source (e.g., "News Anchor", "Hacker Group").
Make sure the \`content\` reflects the specific NPC's voice and bias.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scenarioId: { type: Type.STRING },
    title: { type: Type.STRING },
    narrative: { type: Type.STRING, description: "Brief setting of the scene before the interaction." },
    medium: { type: Type.STRING, enum: [MediumType.EMAIL, MediumType.MEETING, MediumType.NEWS] },
    senderName: { type: Type.STRING },
    senderRole: { type: Type.STRING },
    content: { type: Type.STRING, description: "The actual email body or spoken dialogue. MUST reflect the character's specific personality." },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "Short button label" },
          description: { type: Type.STRING, description: "Longer explanation of the action" },
        },
        required: ["id", "text", "description"]
      }
    },
    statUpdates: {
      type: Type.OBJECT,
      properties: {
        morale: { type: Type.NUMBER },
        profit: { type: Type.NUMBER },
        reputation: { type: Type.NUMBER },
      },
      description: "The numeric change to apply to current stats based on the PREVIOUS action. Negative or positive integers."
    },
    feedback: { type: Type.STRING, description: "Narrative result of the previous choice." },
    isGameOver: { type: Type.BOOLEAN },
    gameOverReason: { type: Type.STRING }
  },
  required: ["scenarioId", "title", "narrative", "medium", "content", "options"]
};

export const generateScenario = async (
  currentStats: GameStats,
  turn: number,
  previousChoiceText?: string
): Promise<ScenarioResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Current Turn: ${turn}/8.
    Current Stats: Morale: ${currentStats.morale}, Profit: ${currentStats.profit}, Reputation: ${currentStats.reputation}.
    ${previousChoiceText ? `The player previously chose: "${previousChoiceText}". Analyze the consequences of this choice.` : "Start the game. The crisis is: A massive customer data leak has just been discovered."}
    
    ${previousChoiceText ? `The player previously chose: "${previousChoiceText}". Analyze the consequences of this choice.` : "Start the game. The crisis is: A massive customer data leak has just been discovered."}
    
    Generate the next scenario. Choose an NPC from the roster who would be most concerned about the current state of affairs.
  `;

  if (!process.env.API_KEY && !process.env.GEMINI_API_KEY) {
    console.error("API Key is missing in process.env");
    throw new Error("Missing API Key. Please add VITE_GEMINI_API_KEY to .env.local");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.8,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text) as ScenarioResponse;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of severe error
    return {
      scenarioId: "error",
      title: "Connection Error",
      narrative: "Communication systems are down.",
      medium: MediumType.EMAIL,
      senderName: "IT Support",
      senderRole: "System",
      content: "We are unable to reach the simulation server. Please try again.",
      options: [],
      isGameOver: true,
      gameOverReason: `Simulation Error: ${error instanceof Error ? error.message : "Unknown Error"}. Check API Key.`
    };
  }
};

export const generateSceneryImage = async (
  narrative: string,
  medium: MediumType,
  senderName: string
): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let visualPrompt = `Cinematic, cyberpunk corporate office, moody lighting, high tech. Context: ${narrative}.`;

  if (medium === MediumType.MEETING) {
    visualPrompt = `A high quality video conference portrait of a corporate executive named ${senderName}. Cyberpunk aesthetic, looking into camera, professional office background, moody blue and cyan lighting. ${narrative}`;
  } else {
    visualPrompt = `A futuristic digital representation of a corporate crisis: ${narrative}. Data visualization, holograms, dark interface, cinematic, abstract technology background.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: visualPrompt }]
      },
    });

    // Extract image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (e) {
    console.error("Failed to generate image", e);
    return undefined;
  }
};
