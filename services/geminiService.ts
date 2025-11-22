import { GoogleGenerativeAI } from "@google/generative-ai";
import { SceneData, AspectRatio, PersonaState } from "../types";

/** Count words */
const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/** Forbidden punctuation rules */
const hasForbiddenPunctuation = (text: string): boolean => {
  const forbiddenRegex = /[!…;—:"“”]/;
  return forbiddenRegex.test(text);
};

/** Retry wrapper for Gemini operations */
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
      const isQuota =
        error.status === 429 ||
        errorMessage.includes("quota") ||
        errorMessage.includes("resource exhausted") ||
        errorMessage.includes("too many requests");

      console.warn(`Attempt ${i + 1} failed:`, error.message);

      if (!error.status || error.status >= 500 || isQuota) {
        const baseDelay = isQuota ? 4000 : 1000;
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }

  const finalMsg = lastError?.message?.toLowerCase() || "";
  if (
    lastError?.status === 429 ||
    finalMsg.includes("quota") ||
    finalMsg.includes("resource exhausted")
  ) {
    throw new Error(
      "Limite de uso da IA excedido temporariamente. Aguarde alguns segundos e tente novamente."
    );
  }

  throw lastError || new Error("Falha na operação após tentativas.");
};

/** FEW-SHOT STYLE DEFINITIONS */
const BLOCK_STYLES = {
  AFETIVA: {
    name: "Chamada Afetiva",
    desc: "High emotion hook, desire-focused.",
    example:
      "Amiga você não tem noção. Eu tô simplesmente obcecada nesse [Nome da Peça], é a coisa mais perfeita que já vesti."
  },
  VALIDACAO: {
    name: "Validação",
    desc: "Validate quality, fit, and fabric.",
    example:
      "O tecido abraça o corpo e não marca nada, fora que dá pra usar em qualquer ocasião."
  },
  CTA: {
    name: "CTA",
    desc: "Urgência, escassez e comando final.",
    example:
      "Corre que o estoque tá voando. Garante o seu agora antes que acabe."
  }
};

/** Rewrite text to exact word count using Gemini */
const rewriteToExactSpecs = async (
  ai: GoogleGenerativeAI,
  text: string,
  target: number,
  blockType: string,
  mandatoryEnding?: string,
  pieceName?: string
): Promise<string> => {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const endingRule = mandatoryEnding
    ? `4. MUST end with: "${mandatoryEnding}".`
    : "";

  let contentRule = "";
  let exampleText = "";

  if (blockType.toLowerCase().includes("afetiva")) {
    contentRule = BLOCK_STYLES.AFETIVA.desc;
    exampleText = BLOCK_STYLES.AFETIVA.example;
  } else if (blockType.toLowerCase().includes("validação")) {
    contentRule = BLOCK_STYLES.VALIDACAO.desc;
    exampleText = BLOCK_STYLES.VALIDACAO.example;
  } else if (blockType.toLowerCase().includes("cta")) {
    contentRule = BLOCK_STYLES.CTA.desc;
    exampleText = BLOCK_STYLES.CTA.example;
  }

  const prompt = `
TASK: Rewrite the text in BR Portuguese.

Original: "${text}"
Block type: ${blockType}

RULES:
1. EXACTLY ${target} words (±2)
2. Forbidden: ! ... ; — : "
3. Tone: TikTok Shop viral, natural, friendly.
${endingRule}

Focus: ${contentRule}
Example: "${exampleText}"

Output only rewritten text.
`;

  try {
    const result = await generateWithRetry(() =>
      model.generateContent(prompt)
    );

    return result.response.text().trim();
  } catch {
    return text;
  }
};

/** IMAGE GENERATION ENGINE */
export const generateLook = async (
  imageBase64: string,
  sceneData: SceneData,
  personaData: PersonaState,
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenerativeAI(process.env.API_KEY);

  const cleanBase64 = imageBase64.replace(
    /^data:image\/(png|jpeg|jpg|webp);base64,/,
    ""
  );

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash-image"
  });

  const seed = Math.floor(Math.random() * 999999);

  const prompt = `
Generate a photorealistic fashion photo. Unique model. No resemblance to reference.

[SEED: ${seed}]

Scene: ${sceneData.category}
Details: ${Object.entries(sceneData.options)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}

Clothing must match EXACTLY the reference image.
`;

  const result = await generateWithRetry(() =>
    model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        image: { aspectRatio }
      }
    }),
    4
  );

  const parts = result.response.candidates?.[0]?.content?.parts || [];

  for (const p of parts) {
    if (p.inlineData?.data) {
      return `data:image/png;base64,${p.inlineData.data}`;
    }
  }

  throw new Error("Nenhuma imagem foi gerada.");
};

/** VIDEO SCRIPT ENGINE — FIXED with new Gemini API */
export const generateVideoInstructions = async (
  pieceName: string,
  speechQuantity: number,
  finalImageUrl: string,
  sceneData: SceneData
): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenerativeAI(process.env.API_KEY);
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const WORD_TARGET = 22;
  const CTA_PHRASE = "clica aqui embaixo no carrinho laranja";

  const blocks: { text: string; type: string }[] = [];

  /** Build blocks raw */
  for (let i = 0; i < speechQuantity; i++) {
    let type = "Validação";

    if (i === 0) type = "Chamada Afetiva";
    if (i === speechQuantity - 1) type = "CTA";

    const prompt = `
Generate a BR Portuguese TikTok Shop speech block.

Piece: "${pieceName}"
Block type: ${type}
Scene: ${sceneData.category}

Rules:
- ~${WORD_TARGET} words
- Forbidden punctuation: ! ... ; — : "
- Viral human tone
${type === "CTA" ? `- MUST end with: "${CTA_PHRASE}"` : ""}
`;

    const result = await generateWithRetry(() => model.generateContent(prompt));
    blocks.push({ text: result.response.text().trim(), type });
  }

  /** Apply strict rewrite rules */
  let finalScript = "";

  for (const b of blocks) {
    const rewritten = await rewriteToExactSpecs(
      ai,
      b.text,
      WORD_TARGET,
      b.type,
      b.type === "CTA" ? CTA_PHRASE : undefined,
      pieceName
    );

    finalScript += `[ ${b.type.toUpperCase()} ]\n${rewritten}\n\n`;
  }

  return `
Generate a video with the following exact instructions:

VISUALS: Photorealistic, cinematic 8K. Model wearing "${pieceName}".
SCENE CONTEXT: ${sceneData.category.toUpperCase()}

CRITICAL CONSISTENCY:
No flicker, no morphing, no disappearance.
Any handheld object must stay stable.

AUDIO: Female native pt-BR voice.

SCRIPT:
${finalScript}
`;
};
