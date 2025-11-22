import { GoogleGenAI, Type } from "@google/genai";
import { SceneData, AspectRatio, PersonaState } from "../types";

/**
 * Helper to count words in a string (Portuguese rules).
 * Splits by whitespace.
 */
const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Helper to check for forbidden punctuation.
 * Prohibited: !, ..., ;, —, :, " (internal quotes)
 */
const hasForbiddenPunctuation = (text: string): boolean => {
  const forbiddenRegex = /[!…;—:"“ ”]/; // Check for exclamation, ellipsis, semi-colon, em-dash, colon, quotes
  return forbiddenRegex.test(text);
};

/**
 * Helper to execute content generation (Text or Image) with retry logic.
 * Enhanced to handle Quota Exceeded (429) errors gracefully.
 */
const generateWithRetry = async (
  operation: () => Promise<any>,
  retries = 3
): Promise<any> => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message?.toLowerCase() || "";
      
      // Detect Quota or Rate Limit errors
      const isQuota = error.status === 429 || 
                      errorMessage.includes('quota') || 
                      errorMessage.includes('resource exhausted') ||
                      errorMessage.includes('too many requests');
                      
      console.warn(`Attempt ${i + 1} failed:`, error.message);

      // Retry on server errors (5xx) or Quota errors (429)
      if (!error.status || error.status >= 500 || error.code >= 500 || isQuota) {
        // If quota, wait longer (starts at 4s, then 8s, 16s...) to allow bucket refill
        const baseDelay = isQuota ? 4000 : 1000;
        const delay = baseDelay * (Math.pow(2, i));
        
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Don't retry other 4xx errors (like Bad Request)
    }
  }
  
  // Throw a user-friendly error if it was a quota issue
  const finalMsg = lastError?.message?.toLowerCase() || "";
  if (lastError?.status === 429 || finalMsg.includes('quota') || finalMsg.includes('resource exhausted')) {
      throw new Error("Limite de uso da IA excedido temporariamente. Aguarde alguns segundos e tente novamente.");
  }
  
  throw lastError || new Error("Falha na operação após tentativas.");
};

// --- DEFINIÇÕES DE ESTILO E EXEMPLOS (FEW-SHOT) ---
const BLOCK_STYLES = {
  AFETIVA: {
    name: "Chamada Afetiva",
    desc: "High emotion hook, focus on desire, 'love at first sight'. Must sound like a best friend recommending a secret.",
    example: "Amiga você não tem noção. Eu tô simplesmente obcecada nesse [Nome da Peça], é a coisa mais perfeita que já vesti."
  },
  VALIDACAO: {
    name: "Validação",
    desc: "Validate quality, fit, fabric, versatility or social proof. Justify the purchase rationally but with casual tone.",
    example: "O tecido abraça o corpo e não marca nada, fora que dá pra usar em qualquer ocasião e fica super elegante."
  },
  CTA: {
    name: "CTA",
    desc: "Urgency, scarcity, final call to action.",
    example: "Corre que o estoque tá voando. Garante o seu agora antes que acabe, clica aqui embaixo no carrinho laranja."
  }
};

/**
 * Helper to force a specific text rewrite to exact word count AND strict punctuation using Gemini.
 * NOW SUPPORTS MANDATORY ENDING PHRASE PRESERVATION AND BLOCK TYPE CONTEXT WITH EXAMPLES.
 */
const rewriteToExactSpecs = async (
  ai: GoogleGenAI, 
  text: string, 
  target: number, 
  blockType: string,
  mandatoryEnding?: string,
  pieceName?: string
): Promise<string> => {
  const endingRule = mandatoryEnding 
    ? `4. CRITICAL MANDATORY ENDING: The sentence MUST end with the exact phrase: "${mandatoryEnding}". This phrase counts towards the word limit.` 
    : "";

  // Contextual rules based on block type to ensure content isn't lost during rewrite
  let contentRule = "";
  let exampleText = "";

  if (blockType.toLowerCase().includes('chamada') || blockType.toLowerCase().includes('afetiva')) {
      contentRule = `CONTENT FOCUS: ${BLOCK_STYLES.AFETIVA.desc} You MUST mention the product name "${pieceName || 'the piece'}" if possible.`;
      exampleText = `STYLE EXAMPLE: "${BLOCK_STYLES.AFETIVA.example}"`;
  } else if (blockType.toLowerCase().includes('validação') || blockType.toLowerCase().includes('validacao')) {
      contentRule = `CONTENT FOCUS: ${BLOCK_STYLES.VALIDACAO.desc}`;
      exampleText = `STYLE EXAMPLE: "${BLOCK_STYLES.VALIDACAO.example}"`;
  } else if (blockType.toLowerCase().includes('cta')) {
      contentRule = `CONTENT FOCUS: ${BLOCK_STYLES.CTA.desc}`;
      exampleText = `STYLE EXAMPLE: "${BLOCK_STYLES.CTA.example}"`;
  }

  const prompt = `
    TASK: Rewrite the following speech block in Portuguese (Brazil).
    
    Original Text: "${text}"
    Target Block Type: ${blockType}
    
    STRICT CONSTRAINTS:
    1. EXACTLY ${target} WORDS (or very close, +/- 2 words).
    2. FORBIDDEN CHARACTERS: Exclamation (!), Ellipsis (...), Semi-colon (;), Colon (:), Em-dash (—), Quotes ("").
    3. TONE: Viral TikTok Shop, natural, human.
    ${endingRule}
    
    ${contentRule}
    ${exampleText}
    
    OUTPUT (Just the rewritten text):
  `;

  try {
    const response = await generateWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
    }));
    return response.text?.trim() || text;
  } catch (e) {
    console.warn("Rewrite failed", e);
    return text;
  }
};

/**
 * Generates a new look based on the input image and scene data.
 * Uses the 'gemini-2.5-flash-image' model with strict preservation rules.
 */
export const generateLook = async (
  imageBase64: string,
  sceneData: SceneData,
  personaData: PersonaState,
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean the base64 string
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  // Determine selected environment or fallback
  const selectedEnvironment = sceneData.options['Ambiente'] || "Estúdio Fotográfico Branco";

  // Mapping Persona IDs to Rich Visual Descriptions for the AI
  const skinToneMap: Record<string, string> = {
    'pele_clara': 'Very Fair/Pale skin tone, Caucasian/European features',
    'morena_clara': 'Light Brown/Tan skin tone, Mediterranean or Light Latina features',
    'morena_media': 'Medium Brown/Olive skin tone, Latina or Mixed Race features',
    'morena_escura': 'Dark Brown skin tone, Afro-Latina or South Asian features',
    'negra': 'Deep Ebony/Black skin tone, African features',
    'asiatica': 'Light skin tone, East Asian (Korean/Japanese) features'
  };

  const visualSkinDescription = skinToneMap[personaData.skinTone] || personaData.skinTone;

  // Logic for Recalibrated Instructions
  let recalibrationInstruction = "";
  if (personaData.autoRecalibrated) {
      recalibrationInstruction = `
        NOTE ON HAIR/SKIN:
        - Ensure natural blending between ${visualSkinDescription} skin and ${personaData.hairStyle} hair.
      `;
  }

  // Generate a random variation seed to ensure the model treats this as a fresh attempt
  // and to prevent caching or repetition of the same output on "Generate Again".
  const requestSeed = Math.floor(Math.random() * 1000000);

  // STRICT PROMPT UPDATE: DIRECTIVE GENERATION
  // We shift from "Task: Change this" to "Generate: A new thing"
  // This forces the model to construct the subject from scratch.
  const prompt = `
    Generate a high-fidelity, photorealistic fashion photo of a **${visualSkinDescription}** model with **${personaData.hairStyle}** hair.

    The model is wearing the clothing item visible in the attached reference image.

    [UNIQUE_ID: ${requestSeed}]

    **SCENE CONFIGURATION:**
    - Location: ${selectedEnvironment}
    - Style: ${sceneData.category}
    - Details: ${Object.entries(sceneData.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
    - Lighting: ${sceneData.options['Iluminação'] || 'Studio Lighting'}

    **CRITICAL GENERATION RULES:**
    1. **IDENTITY SWAP (MANDATORY):** The generated person MUST be a COMPLETELY NEW PERSON based on the skin/hair description above. Do NOT resemble the face or body of the person in the reference image.
    2. **IGNORE REFERENCE IDENTITY:** The person in the input image is IRRELEVANT (just a mannequin). Discard their identity, ethnicity, and pose completely.
    3. **CLOTHING TRANSFER:** Accurately transfer the fabric, texture, color, and pattern of the clothing from the reference image to the new model.
    4. **NEW COMPOSITION:** Do not blindly copy the pose of the reference. Create a fresh, professional composition that fits the requested Scene Configuration.
    
    ${recalibrationInstruction}
    
    OUTPUT: A realistic photo of the NEW model in the NEW scene wearing the reference clothing.
  `;

  try {
    // Execute Image Generation with Retry Logic
    const response = await generateWithRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio // Use the user-selected aspect ratio (9:16 or 16:9)
        },
        // High temperature encourages variance and prevents regression to the input image
        temperature: 1.0 
      }
    }), 4); // Increased retries for Image Generation

    // Iterate through parts to find the image output
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Nenhuma imagem foi gerada. Por favor, tente novamente.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * SPEECH ENGINE (Autonomous Version)
 * Generates Video Instructions using Internal Patterns and Strict Constraints.
 * USES JSON SCHEMA FOR ROBUSTNESS.
 * NOW AWARE OF SCENE CONTEXT.
 * OUTPUTS 'VEO3 READY' PROMPT FORMAT.
 */
export const generateVideoInstructions = async (
  pieceName: string,
  speechQuantity: number,
  finalImageUrl: string,
  sceneData: SceneData // Added Scene Data for contextualization
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const WORD_COUNT_TARGET = 22;
  const WORD_COUNT_TOLERANCE = 5; 
  const MANDATORY_CTA_PHRASE = "clica aqui embaixo no carrinho laranja";

  // Format scene context for the prompt
  const sceneContextStr = `
    VISUAL CONTEXT:
    - Scenario Category: ${sceneData.category}
    - Details: ${Object.entries(sceneData.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
  `;

  // Construct strict block logic based on quantity - REFINED LOGIC
  let structurePrompt = "";
  const midStart = 2;
  const midEnd = speechQuantity - 1;

  if (speechQuantity === 1) {
    structurePrompt = `1. **BLOCK 1 [TYPE: "CTA"]**: Single powerful closing statement. ${BLOCK_STYLES.CTA.desc} CRITICAL: Must end with: "${MANDATORY_CTA_PHRASE}".`;
  } else {
    // Block 1 is always Affectionate/Hook
    structurePrompt = `1. **BLOCK 1 [TYPE: "Chamada Afetiva"]**: ${BLOCK_STYLES.AFETIVA.desc} Must mention "${pieceName}". Example: "${BLOCK_STYLES.AFETIVA.example}"\n`;
    
    // Middle blocks are Validation (only if we have more than 2 blocks total)
    if (midEnd >= midStart) {
        const label = midStart === midEnd ? `BLOCK ${midStart}` : `BLOCKS ${midStart} to ${midEnd}`;
        structurePrompt += `${label} **[TYPE: "Validação"]**: ${BLOCK_STYLES.VALIDACAO.desc} Example: "${BLOCK_STYLES.VALIDACAO.example}"\n`;
    }
    
    // Final block is always CTA
    structurePrompt += `${speechQuantity}. **BLOCK ${speechQuantity} [TYPE: "CTA"]**: ${BLOCK_STYLES.CTA.desc} CRITICAL: Must end with: "${MANDATORY_CTA_PHRASE}". Example: "${BLOCK_STYLES.CTA.example}"`;
  }

  const prompt = `
    ACT AS: Speech Engine VEO3 (TikTok Shop Specialist).
    
    TASK: Generate exactly ${speechQuantity} speech blocks for a video selling a fashion piece named "${pieceName}".
    
    CONTEXT:
    ${sceneContextStr}

    ADAPTATION RULE: Adjust the tone and vocabulary to match the VISUAL CONTEXT.
    - "mirror"/"selfie" -> Intimate, casual friend advice.
    - "promo"/"editorial" -> Sophisticated, confident.

    **REQUIRED STRUCTURE (STRICT FLOW):**
    ${structurePrompt}

    STRICT CONSTRAINTS:
    - TARGET LENGTH: ~${WORD_COUNT_TARGET} words per block.
    - LANGUAGE: Portuguese (Brazil). Natural, fluid, viral style.
    - NO EXCLAMATION MARKS (!). Use strong words instead.
  `;

  // Define JSON Schema for structured output
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        blockId: { type: Type.STRING, description: "Identifier like 'Bloco 1'" },
        text: { type: Type.STRING, description: "The speech text content" },
        type: { 
          type: Type.STRING, 
          description: "The specific function: 'Chamada Afetiva', 'Validação', or 'CTA'" 
        }
      },
      required: ["blockId", "text", "type"]
    }
  };

  try {
    let blocks: any[] = [];
    
    // --- ATTEMPT 1: STRUCTURED OUTPUT ---
    try {
        const response = await generateWithRetry(() => ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        }));

        const jsonText = response.text || "[]";
        try {
            blocks = JSON.parse(jsonText);
        } catch (e) {
            // Fallback for markdown wrapping
            const match = jsonText.match(/\[[\s\S]*\]/);
            if (match) {
                 try { blocks = JSON.parse(match[0]); } catch(e2) {}
            }
        }
    } catch (schemaError) {
        console.warn("Structured output generation failed, falling back to text mode...", schemaError);
    }

    // --- ATTEMPT 2: FALLBACK TEXT MODE (If Attempt 1 failed) ---
    if (!Array.isArray(blocks) || blocks.length === 0) {
        console.log("Attempting fallback generation...");
        const fallbackPrompt = prompt + "\n\nIMPORTANT: Return ONLY a valid JSON Array of objects. Do not add markdown formatting.";
        
        const response = await generateWithRetry(() => ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: { parts: [{ text: fallbackPrompt }] }
        }));
        
        const jsonText = response.text || "[]";
        const match = jsonText.match(/\[[\s\S]*\]/); // Find JSON array pattern
        if (match) {
             try { blocks = JSON.parse(match[0]); } catch(e2) { console.error("Fallback parse failed", e2); }
        }
    }

    if (!Array.isArray(blocks) || blocks.length === 0) {
         throw new Error("Unable to generate valid script content after retries.");
    }

    let validatedScript = "";
    
    // --- POST-PROCESSING VALIDATION LOOP (Motor 2 Correction) ---
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        
        // Force correct type classification based on index (Logic Enforcement)
        let enforcedType = block.type;
        if (i === 0) enforcedType = "Chamada Afetiva"; // Block 1 is ALWAYS Afetiva (unless qty=1, handled below)
        if (speechQuantity === 1) enforcedType = "CTA"; // Override if single block
        else if (i === blocks.length - 1) enforcedType = "CTA"; // Last block is ALWAYS CTA
        else if (i > 0 && i < blocks.length - 1) enforcedType = "Validação"; // Middle is Validation

        const prefix = `[ ${enforcedType?.toUpperCase() || 'FALA'} ]`; 
        let currentText = (block.text || "").trim();
        
        // Identify if this is the final CTA block
        const isLastBlock = i === blocks.length - 1;
        
        // If it's the CTA block, we MUST enforce the ending phrase during any rewrites
        const mandatoryPhrase = isLastBlock ? MANDATORY_CTA_PHRASE : undefined;

        let count = countWords(currentText);
        let hasForbidden = hasForbiddenPunctuation(currentText);
        
        let attempts = 0;
        const MAX_ATTEMPTS = 2; 
        const isCountValid = Math.abs(count - WORD_COUNT_TARGET) <= WORD_COUNT_TOLERANCE;

        // Check if CTA block actually has the phrase
        let missingMandatory = false;
        if (mandatoryPhrase && !currentText.toLowerCase().includes(mandatoryPhrase.toLowerCase())) {
            missingMandatory = true;
        }

        // Validation Loop
        while ((!isCountValid || hasForbidden || missingMandatory) && attempts < MAX_ATTEMPTS) {
            // Rewrite Logic with Retry and Mandatory Phrase Injection
            currentText = await rewriteToExactSpecs(ai, currentText, WORD_COUNT_TARGET, enforcedType || "General", mandatoryPhrase, pieceName);
            
            count = countWords(currentText);
            hasForbidden = hasForbiddenPunctuation(currentText);
            
            if (mandatoryPhrase && !currentText.toLowerCase().includes(mandatoryPhrase.toLowerCase())) {
                missingMandatory = true;
            } else {
                missingMandatory = false;
            }
            
            attempts++;
        }

        validatedScript += `${prefix}\n${currentText}\n\n`;
    }

    // Construct Final TXT File in Veo3 Ready format
    const sceneDetailsEnglish = Object.entries(sceneData.options)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const finalOutput = `Generate a video with the following exact instructions:

VISUALS: Style must be photorealistic, cinematic quality, 8K. The main visual theme is a model wearing an elegant "${pieceName}". Full-body composition.
SCENE CONTEXT: ${sceneData.category.toUpperCase()}
DETAILS: ${sceneDetailsEnglish}

CRITICAL CONSISTENCY INSTRUCTION: The model and her entire appearance (clothing, hair, accessories) must remain 100% consistent. NO flicker, no disappearance, no morphing. Any handheld object must remain perfectly stable.

AUDIO (VOICE): You MUST use a native Brazilian Portuguese (pt-BR) female voice. Tone must be natural, warm, emotional and excited.

SCRIPT (Spoken Text):
${validatedScript}
`;

    return finalOutput;

  } catch (error) {
    console.error("Gemini API Error (Instructions):", error);
    throw error;
  }
};
