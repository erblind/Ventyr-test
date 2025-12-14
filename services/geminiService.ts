
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
};

// 1. Fast AI Responses using Flash Lite for Descriptions
export const generateEventDescription = async (title: string, basicInfo: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Write a short, hype-building, futuristic description (max 3 sentences) for an event titled "${title}". Info: ${basicInfo}`,
    });
    return response.text || "Join us for an unforgettable experience.";
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    return "Experience the future of events.";
  }
};

// 2. Image Generation using Nano Banana Pro (Gemini 3 Pro Image)
export const generateEventPoster = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Futuristic event poster, minimal, neon style, 4k: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K" 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};

// 3. Chatbot using Gemini 3 Pro
export const chatWithAssistant = async (message: string, context?: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: You are EventOS AI, a helpful assistant for an event app. ${context || ''}\n\nUser: ${message}`,
      config: {
        systemInstruction: "You are a helpful, futuristic AI assistant. Keep answers short and friendly.",
      }
    });
    return response.text || "I'm having trouble connecting to the network.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "System offline. Please try again.";
  }
};

// 4. Video Generation (Veo)
export const generatePromoVideo = async (prompt: string): Promise<void> => {
  try {
    const ai = getAIClient();
    console.log("Starting Veo generation...");
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await window.aistudio.openSelectKey();
        }
    }
    return;
  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};

// 5. Search Grounding for Venue Info
export const getVenueInfo = async (venueName: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `What are 3 cool facts about the venue: ${venueName}? Keep it very brief.`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        return response.text || "Venue information unavailable.";
    } catch (e) {
        return "Could not fetch venue details.";
    }
}

// 6. THE ARCHITECT: Generates a full event strategy from a prompt
export const generateEventStrategy = async (userPrompt: string) => {
    try {
        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as an Event Architect. Based on this request: "${userPrompt}", generate a JSON object with:
            1. A catchy 'title'
            2. A 'description' (marketing copy)
            3. A list of 'tags'
            4. 'suggestedTicketPricing' array (name, price) based on demand
            5. A 'marketingPlan' (3 bullet points)
            6. A 'targetAudience' description
            7. A simple 'schedule' array (time, title, type)
            `,
            config: {
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Architect Error", e);
        return null;
    }
}
