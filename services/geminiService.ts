import { GoogleGenAI } from "@google/genai";
import { Project, Scene, Mode } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

// Fix: Aligned with Gemini API guidelines.
// The API key must be obtained exclusively from `process.env.API_KEY`.
// Removed fallback key and unnecessary warning logs.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceSceneDescription = async (brief: string): Promise<string> => {
    // Fix: Removed redundant API key check to align with guidelines, which assume the key is always configured.
    const systemInstruction = `You are a world-class creative director and scriptwriter. Your task is to take a user's brief scene idea and expand it into a rich, vivid, and highly detailed cinematic description. Focus on sensory details, atmosphere, lighting, camera movement hints, and character emotion. The output should be a single, well-written paragraph that can be used directly in a professional script or as a foundation for an AI image generator prompt. Do not add any conversational text or labels. Only output the enhanced description.`;

    const userPrompt = `Enhance this scene idea: "${brief}"`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
            }
        });
        // Per Gemini API guidelines, directly access the .text property for the response.
        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing description with Gemini:", error);
        throw new Error("Failed to enhance scene description.");
    }
};

export const completeCharacterDescription = async (currentDescription: string): Promise<string> => {
    const systemInstruction = `You are a master character designer and creative writer for Hollywood films. A user will provide a character or setting concept. Your task is to expand upon it with vivid, evocative, and professional-level details. Focus on appearance, attire, posture, expression, and subtle hints about their personality or backstory that bring them to life. The output should seamlessly continue or enrich the user's input. Only provide the additional descriptive text that completes the idea. Do NOT repeat the user's original text. Do not add conversational fluff or labels like "Here is the expanded description:". If the user input is 'สาวสวยสุดเซ็กซี่', a great continuation would be 'ในชุดเดรสรัดรูปสีดำขลับที่ขับเน้นสัดส่วนโค้งเว้า, ริมฝีปากอวบอิ่มเคลือบด้วยลิปสติกสีแดงสด, ดวงตาคมกริบแฝงแววลึกลับน่าค้นหา'.`;

    const userPrompt = `Based on this concept, continue and expand the description: "${currentDescription}"`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.85,
            }
        });
        return ` ${response.text.trim()}`; // Add a leading space for smooth concatenation
    } catch (error) {
        console.error("Error completing character description:", error);
        throw new Error("Failed to complete character description.");
    }
};


export const generateHollywoodPrompt = async (project: Project, scene: Scene): Promise<string> => {
  // Fix: Removed redundant API key check to align with guidelines.
  const { mode, stylePreset, characterSceneCap, isNsfw } = project;
  const { description, action, mood, cta, cameraAngle } = scene;

  // Fix: Changed prompt instructions to English for better model performance and clarity.
  const modeDescription = {
    [Mode.Image]: "AI for generating still images",
    [Mode.Video]: "AI for generating video, like VEO",
    [Mode.Story]: "AI for writing stories",
  }[mode];

  const nsfwInstruction = isNsfw ? "The theme is mature and intended for an adult audience. Incorporate elements that are suggestive, dark, or provocative as appropriate for the narrative, while respecting creative boundaries." : "";

  const systemInstruction = `You are an expert Hollywood scriptwriter and AI prompt engineer. Your task is to generate a single, highly detailed, and evocative prompt for ${modeDescription}. Combine all the provided elements into a cohesive, vivid, and long-form paragraph. The prompt should be a masterpiece of descriptive language, ready to produce a stunning visual or narrative. Do not output anything other than the final prompt.`;

  const userPrompt = `
    **Style & Tone:**
    - Style Preset: ${stylePreset.name} (${stylePreset.prompt})
    - Mood: ${mood}

    **Cinematography:**
    - Camera: ${cameraAngle}

    **Core Elements:**
    - Main Characters & Setting Overview (CAP): ${characterSceneCap}
    - Specific Scene Description: ${description}
    - Key Action in Scene: ${action}

    **Additional Context:**
    - Call to Action (if applicable, subtly integrate its theme): ${cta}
    - Maturity Level: ${nsfwInstruction}

    **Task:**
    Synthesize these details into one single, powerful, descriptive paragraph. Paint a picture with words. Focus on visual details, lighting, atmosphere, character emotion, and composition. The final output must be only the prompt itself.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.9,
        }
    });
    // Per Gemini API guidelines, directly access the .text property for the response.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    throw new Error("Failed to generate prompt. Please check your API key and connection.");
  }
};