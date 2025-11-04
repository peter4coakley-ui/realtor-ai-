import { GoogleGenAI, FunctionDeclaration, Modality, Type, GenerateContentResponse } from '@google/genai';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Only initialize if API key is present
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Extracts the MIME type and base64 data from a data URL.
 * @param dataUrl The data URL string.
 * @returns An object with the mimeType and data.
 */
const extractMimeTypeAndData = (dataUrl: string): { mimeType: string; data: string } => {
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid data URL format. Expected "data:image/...;base64,..."');
    }
    return { mimeType: match[1], data: match[2] };
};


const imageEditFunctionDeclaration: FunctionDeclaration = {
    name: 'performImageEdit',
    description: 'Performs a creative edit on an image based on a user prompt. This can include adding, removing, or changing objects, altering styles, adjusting colors, or transforming the entire scene.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            edit_type: {
                type: Type.STRING,
                description: 'The general category of the edit. Examples: "inpaint", "restyle", "cleanup", "color_adjust", "room_clearout".',
                enum: ['room_clearout', 'flooring_upgrade', 'repaint_walls', 'declutter', 'twilight_conversion', 'exterior_boost', 'repaint_exterior', 'inpaint', 'restyle', 'cleanup', 'color_adjust', 'add_element', 'remove_element', 'transform']
            },
            prompt: {
                type: Type.STRING,
                description: 'A detailed, descriptive prompt for the image generation model. This should be a clear instruction, e.g., "Add a large, modern white sofa in the center of the living room" or "Change the sky to a dramatic sunset."',
            },
            target_area: {
                type: Type.STRING,
                description: 'Optional. A description of the specific area to be modified, e.g., "the back wall", "the chair on the left", "the sky".',
            },
            style: {
                type: Type.STRING,
                description: 'Optional. The artistic or design style to apply, e.g., "modern minimalist", "watercolor", "photorealistic".'
            }
        },
        required: ['edit_type', 'prompt'],
    },
};

export async function interpretUserIntent(
  chatHistory: { role: 'user' | 'assistant'; content: string }[],
  newUserMessage: string
): Promise<{ prompt: string } | null> {
  if (!ai) {
    throw new Error('Google API key is not configured. Please add VITE_GOOGLE_API_KEY to your .env file.');
  }

  const formattedHistory = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{text: msg.content}]
  }));

  const contents = [...formattedHistory, { role: 'user', parts: [{ text: newUserMessage }] }];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
        tools: [{ functionDeclarations: [imageEditFunctionDeclaration] }],
        systemInstruction: `You are RealtorAI Studio's primary visual model, an expert AI photo editing assistant specializing in real estate marketing. Your goal is to translate user requests into structured commands for an image editing model using the 'performImageEdit' function.

### CORE PERSONA & KNOWLEDGE BASE
- **You are an Expert:** You understand interior/exterior design, architectural styles, and professional real estate photography principles (e.g., light, space, composition).
- **You are Compliant:** You have a deep understanding of MLS & NAR guidelines. You know that altering the physical structure of a property (moving walls, changing windows) or hiding significant flaws is strictly forbidden.
- **You are Precise:** Your job is to convert ambiguous user language into hyper-descriptive, unambiguous prompts for the image generation model.

### STEP-BY-STEP REASONING PROCESS
1.  **Analyze Intent:** What is the user's ultimate goal? Are they staging, repairing, enhancing, or restyling?
2.  **Identify Action:** Is it an addition, removal, replacement, or color change?
3.  **Identify Subject:** What is the primary object or area of focus? (e.g., "the floor", "the walls", "the sky", "the sofa").
4.  **Extract Descriptors:** What specific styles, colors, materials, or qualities did the user mention? (e.g., "modern", "hardwood", "warm gray", "sunny day").
5.  **Construct the Prompt:** Combine the above into a detailed, professional-grade prompt.

### PROMPT CONSTRUCTION RULES
- **From Ambiguous to Specific:**
  - User: "add a sofa" -> Prompt: "Add a photorealistic, modern minimalist sofa with light gray fabric upholstery and clean lines, placed naturally in the center of the living room."
  - User: "make the lawn better" -> Prompt: "Enhance the lawn to be a vibrant, healthy, and lush green, fixing any brown patches while maintaining a realistic look."
- **Incorporate Safety Constraints:** If the request is sensitive (e.g., "remove that ugly wall"), you must translate it safely.
  - User: "remove the wall between the kitchen and living room" -> **DO NOT DO THIS.** Instead, you could interpret it as a request to make the space feel more open, perhaps by suggesting a different edit, or by generating a text response explaining the limitation. For the purpose of this tool, focus on generating a valid function call for a cosmetic edit. A better approach is to assume the user wants something cosmetic. If a user says "remove the clutter on the counter", the prompt should be "Remove the small, distracting items like papers and mail from the kitchen countertop, then reconstruct the countertop surface seamlessly."
- **Prioritize Photorealism:** Always include the word "photorealistic" in your prompts unless an artistic style is explicitly requested. The final output must look like a real photograph.
- **Virtual Staging/Clearing:** When clearing a room, be explicit: "Remove all movable furniture, decor, and personal items. You MUST preserve the original walls, flooring, windows, doors, and any permanent fixtures. Reconstruct the empty space by seamlessly cloning adjacent textures and lighting."

Your final output is ONLY the function call. Do not add conversational text.`
    }
  });

  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    if (call.name === 'performImageEdit') {
      return { prompt: call.args.prompt };
    }
  }
  return null;
}

export async function generateImageEdit(
  base64Image: string,
  prompt: string,
  maskBase64?: string
): Promise<string> {
    if (!ai) {
        throw new Error('Google API key is not configured. Please add VITE_GOOGLE_API_KEY to your .env file.');
    }
    const { mimeType, data: imageData } = extractMimeTypeAndData(base64Image);
    
    const imagePart = {
        inlineData: {
            data: imageData,
            mimeType: mimeType,
        },
    };

    const parts: any[] = [imagePart];
    let finalPrompt = prompt;

    if (maskBase64) {
        const maskData = maskBase64.split(',')[1];
        const maskPart = {
            inlineData: {
                data: maskData,
                mimeType: 'image/png', // Masks are always PNG to support transparency
            },
        };
        parts.push(maskPart);
        // Provide a more explicit prompt for inpainting
        finalPrompt = `You are an expert photo editor. A user has provided an image and a mask. Your task is to apply a specific edit ONLY to the area indicated by the white parts of the mask. The rest of the image must remain completely unchanged.
The user's request is: "${prompt}"`;
    }

    parts.push({ text: finalPrompt });

    const systemInstruction = `You are an AI image generation model specializing in photorealistic real estate photo editing.
**CRITICAL RULES:**
1.  **Adhere Strictly to the Prompt:** Your primary goal is to execute the user's prompt as precisely as possible.
2.  **Prioritize Photorealism Above All:** The final image must be indistinguishable from a real photograph. Pay close attention to lighting, shadows, textures, and perspective.
3.  **Preserve Unspecified Areas:** Unless explicitly told to change something, you must preserve it perfectly. Do not "creatively" alter parts of the image that were not mentioned in the prompt.
4.  **Maintain Structural Integrity:** Do not alter the physical structure of buildings (walls, windows, roofs) unless that is the explicit and clear instruction of the prompt.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
            systemInstruction,
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }

    throw new Error('No image was generated by the API.');
}

export async function analyzeImageAndSuggestEdits(base64Image: string): Promise<string> {
  if (!ai) {
    throw new Error('Google API key is not configured. Please add VITE_GOOGLE_API_KEY to your .env file.');
  }
  const { mimeType, data: imageData } = extractMimeTypeAndData(base64Image);

  const imagePart = {
    inlineData: {
      data: imageData,
      mimeType: mimeType,
    },
  };

  const systemInstruction = `You are an AI Creative Director specializing in high-end real estate photography. Your task is to analyze the provided image and offer 1-2 concise, actionable, and creative suggestions for further improvement. The user is a real estate professional looking to maximize the photo's market appeal.

**CRITICAL RULES:**
1.  **Be Specific:** Instead of "add furniture," suggest "add a modern leather armchair and a small side table next to the fireplace."
2.  **Keep it Concise:** Provide 1-2 suggestions in a single, easy-to-read paragraph. Start with an encouraging tone.
3.  **Maintain Compliance:** Focus on cosmetic changes (virtual staging, color correction, lighting enhancement). **DO NOT** suggest altering the physical structure of the property.
4.  **Natural Language:** Your response should be a single block of text, ready to be displayed in a chat bubble. Frame your suggestions as conversational ideas.
5.  **Example Response:** "This looks great! To enhance it even more, you could try repainting the back wall with a neutral 'greige' color to make the space feel warmer. You might also consider adding a large, vibrant piece of abstract art above the sofa to create a focal point."`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart] },
    config: { systemInstruction },
  });

  return response.text;
}

export async function analyzeAndNameImage(base64Image: string): Promise<string> {
  if (!ai) {
    throw new Error('Google API key is not configured. Please add VITE_GOOGLE_API_KEY to your .env file.');
  }
  const { mimeType, data: imageData } = extractMimeTypeAndData(base64Image);
  const imagePart = {
    inlineData: {
      data: imageData,
      mimeType: mimeType,
    },
  };

  const systemInstruction = `You are an AI assistant for a real estate application. Your task is to analyze an image of a property and provide a concise, descriptive name for it. The name should be suitable for a photo label. 
  
  Examples: 'Kitchen with Island', 'Master Bedroom', 'Backyard Patio', 'Front Exterior', 'Living Room with Fireplace'. 
  
  Respond with ONLY the name and nothing else. Do not add quotes or any other text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart] },
    config: { systemInstruction },
  });

  // Clean up the response to remove potential quotes or extra whitespace.
  return response.text.replace(/["']/g, "").trim();
}
