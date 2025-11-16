import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI, Modality } from "@google/genai";
import type { Option, GenerateImageOptions } from "../../src/types";

// --- Private Constants (Prompt Engineering Logic) ---

const PERSONA_OPTIONS: Option[] = [
  { id: 'p1', label: 'Loira (pele clara)', value: 'a fair-skinned blonde woman' },
  { id: 'p2', label: 'Morena Clara', value: 'a light-skinned brunette woman' },
  { id: 'p3', label: 'Morena Média', value: 'a medium-skinned brunette woman' },
  { id: 'p4', label: 'Morena Escura', value: 'a dark-skinned brunette woman' },
  { id: 'p5', label: 'Negra', value: 'a Black woman' },
  { id: 'p6', label: 'Asiática/Oriental', value: 'an East Asian woman' },
];

const HAIR_OPTIONS: Option[] = [
  { id: 'h1', label: 'Liso Longo', value: 'with long straight hair' },
  { id: 'h2', label: 'Liso Curto', value: 'with short straight hair' },
  { id: 'h3', label: 'Ondulado Médio', value: 'with medium-length wavy hair' },
  { id: 'h4', label: 'Cacheado Volumoso', value: 'with voluminous curly hair' },
  { id: 'h5', label: 'Afro Black', value: 'with a beautiful afro' },
  { id: 'h6', label: 'Coque Elegante', value: 'with an elegant bun' },
  { id: 'h7', label: 'Rabo de Cavalo', value: 'with a ponytail' },
  { id: 'h8', label: 'Tranças Longas', value: 'with long braids' },
  { id: 'h9', label: 'Ruivo', value: 'with red hair' },
  { id: 'h10', label: 'Castanho Claro', value: 'with light brown hair' },
  { id: 'h11', label: 'Castanho Escuro', value: 'with dark brown hair' },
  { id: 'h12', label: 'Loiro Dourado', value: 'with golden blonde hair' },
];

const ENVIRONMENT_OPTIONS: Option[] = [
  { id: 'e1', label: 'Quarto Luxuoso Moderno', value: 'a modern luxury bedroom' },
  { id: 'e2', label: 'Quarto Tumblr Rosa', value: 'a pink tumblr-style bedroom' },
  { id: 'e3', label: 'Closet Minimalista', value: 'a minimalist walk-in closet' },
  { id: 'e4', label: 'Decoração Nórdica', value: 'a room with nordic decor' },
  { id: 'e5', label: 'Estúdio Fotográfico Branco', value: 'a white photo studio' },
  { id: 'e6', label: 'Estúdio Industrial Urbano', value: 'an urban industrial studio' },
  { id: 'e7', label: 'Banheiro de Luxo', value: 'a luxury bathroom with a large mirror' },
  { id: 'e8', label: 'Sala Moderna', value: 'a modern living room' },
  { id: 'e9', label: 'Jardim', value: 'a beautiful garden' },
  { id: 'e10', label: 'Varanda Externa', value: 'an outdoor balcony' },
  { id: 'e11', label: 'Rua Urbana', value: 'a stylish urban street' },
  { id: 'e12', label: 'Cena Noturna com Luzes', value: 'a night scene with city lights' },
  { id: 'e13', label: 'Quarto com LEDs', value: 'a bedroom with ambient LED lights' },
  { id: 'e14', label: 'Ambiente Noturno com Neon', value: 'a night scene with neon signs' },
];

const LIGHTING_OPTIONS: Option[] = [
  { id: 'l1', label: 'Luz Natural', value: 'soft natural daylight' },
  { id: 'l2', label: 'Golden Hour', value: 'warm golden hour lighting' },
  { id: 'l3', label: 'Branca Fria', value: 'cool white studio light' },
  { id: 'l4', label: 'Quente Aconchegante', value: 'cozy warm ambient light' },
  { id: 'l5', label: 'Softbox Editorial', value: 'editorial softbox lighting' },
  { id: 'l6', label: 'Cinematic Lighting', value: 'cinematic lighting' },
  { id: 'l7', label: 'Iluminação Noturna', value: 'dramatic night lighting with deep shadows' },
  { id: 'l8', label: 'Neon Lighting', value: 'vibrant neon lighting' },
];

const PHONE_MODE_OPTIONS: Option[] = [
    { id: 'pm1', label: 'Segurando smartphone', value: 'holding a smartphone as if taking a mirror selfie' },
    { id: 'pm2', label: 'Sem telefone', value: 'with hands free, not holding a phone' },
    { id: 'pm3', label: 'Mãos livres, posando', value: 'posing naturally with hands free' },
    { id: 'pm4', label: 'Mão no bolso', value: 'with one hand in her pocket' },
];

const ACCESSORY_OPTIONS: Option[] = [
    { id: 'a1', label: 'Nenhum (clean)', value: 'with no accessories for a clean look' },
    { id: 'a2', label: 'Bolsa de ombro', value: 'carrying a stylish shoulder bag' },
    { id: 'a3', label: 'Bolsa de mão', value: 'holding a small handbag' },
    { id: 'a4', label: 'Pulseira', value: 'wearing a delicate bracelet' },
    { id: 'a5', label: 'Relógio', value: 'wearing a fashion watch' },
    { id: 'a6', label: 'Colar discreto', value: 'wearing a discrete necklace' },
    { id: 'a7', label: 'Chapéu estiloso', value: 'wearing a stylish wide-brim fashion hat' },
    { id: 'a8', label: 'Boné', value: 'wearing a minimalistic casual cap' },
    { id: 'a9', label: 'Chapéu bucket', value: 'wearing a soft bucket hat' },
    { id: 'a10', label: 'Boina elegante', value: 'wearing a chic beret' },
];

const MIRROR_INTERACTION_OPTIONS: Option[] = [
    { id: 'mi0', label: 'Nenhum (sem espelho)', value: '' },
    { id: 'mi1', label: 'Corpo inteiro no espelho', value: 'full-body view captured through a mirror perspective.' },
    { id: 'mi2', label: 'Meio corpo no espelho', value: 'upper-body view framed naturally through the mirror.' },
    { id: 'mi3', label: 'Selfie no espelho (com celular)', value: 'mirror selfie pose holding a smartphone, natural and confident.' },
    { id: 'mi4', label: 'Olhando para o espelho (sem celular)', value: 'standing in front of the mirror, looking at the reflection without holding a phone.' },
    { id: 'mi5', label: 'Ângulo lateral no espelho', value: 'side-angle mirror perspective showing the outfit naturally.' },
    { id: 'mi6', label: 'De costas com reflexo', value: 'back-facing pose with the outfit reflected clearly in the mirror.' },
    { id: 'mi7', label: 'Close no espelho', value: 'close-up mirror framing highlighting upper-body and outfit details.' },
    { id: 'mi8', label: 'Espelho ao fundo (modelo não centralizada)', value: 'mirror present in the background as part of the environment, without direct interaction.' },
];

const POSTURE_OPTIONS: Option[] = [
    { id: 'po1', label: 'Pose de influencer', value: 'with a natural influencer pose' },
    { id: 'po2', label: 'Confiante', value: 'with a confident posture' },
    { id: 'po3', label: 'Casual/Relaxada', value: 'with a casual and relaxed posture' },
    { id: 'po4', label: 'Mãos no quadril', value: 'with hands on her hips' },
    { id: 'po5', label: 'Mão na cintura', value: 'with one hand on her waist' },
    { id: 'po6', label: 'Perna à frente', value: 'with one leg slightly forward' },
];

// --- AI Service Logic ---

let ai: GoogleGenAI | null = null;

function getAiInstance() {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set in Netlify function environment.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const getClothingDescription = async (base64Image: string, mimeType: string): Promise<string> => {
  const imagePart = { inlineData: { data: base64Image, mimeType } };
  const textPart = {
    text: `Analyze the clothing worn by the person in this image. 
    Provide a detailed, technical description focusing on the following: primary color, fabric type (e.g., cotton, denim, silk), texture (e.g., smooth, ribbed, knit), style (e.g., minimalist, bohemian, formal), and any specific cuts or details (e.g., v-neck, puff sleeves, high-waist). 
    The description should be concise and suitable for use in an image generation prompt. 
    Describe only the clothing. Example: 'a red silk v-neck blouse with short puff sleeves'.`
  };
  
  const response = await getAiInstance().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text.trim();
};

const generateStyledImage = async (options: GenerateImageOptions, base64Image: string, mimeType: string): Promise<string> => {
    const {
        personaId, hairId, environmentId, lightingId, phoneModeId, accessoryIds,
        mirrorInteractionId, postureId, clothingDescription, aspectRatioId
    } = options;

    const personaValue = PERSONA_OPTIONS.find(p => p.id === personaId)?.value || '';
    const hairValue = HAIR_OPTIONS.find(h => h.id === hairId)?.value || '';
    const environmentValue = ENVIRONMENT_OPTIONS.find(e => e.id === environmentId)?.value || '';
    const lightingValue = LIGHTING_OPTIONS.find(l => l.id === lightingId)?.value || '';
    
    const mirrorInteractionValue = MIRROR_INTERACTION_OPTIONS.find(m => m.id === mirrorInteractionId)?.value || '';
    const postureValue = POSTURE_OPTIONS.find(p => p.id === postureId)?.value || '';
    let phoneModeValue = PHONE_MODE_OPTIONS.find(p => p.id === phoneModeId)?.value || '';
    const accessoryValue = ACCESSORY_OPTIONS
        .filter(a => accessoryIds.includes(a.id))
        .map(a => a.value)
        .join(', ');

    // Se a interação com o espelho já define o estado do telefone, anula o modo do telefone para evitar conflito/duplicação.
    if (mirrorInteractionId === 'mi3' || mirrorInteractionId === 'mi4') {
        phoneModeValue = '';
    }
        
    const compositionParts = [
        mirrorInteractionValue,
        phoneModeValue,
        postureValue,
        accessoryValue,
    ];
    
    const compositionDescription = compositionParts.filter(part => part && part.trim() !== '').join(', ');
    
    let cameraInstruction = '';
    let backgroundInstruction = '';
    
    if (aspectRatioId === 'ar1') { // 9:16 Vertical
        cameraInstruction = `camera: vertical portrait orientation in 9:16 style, balanced and natural. 
the mirror composition must follow a proportional vertical frame similar to 1080x1920, 
without excessive height or elongated stretching. 
keep the framing natural and centered, avoiding wide horizontal expansion 
but also avoiding overly tall or stretched vertical framing.
ensure the subject fits comfortably within the frame, with minimal empty space above and below.`;
        
        backgroundInstruction = `expand the background scene naturally beyond the reference boundaries, eliminating any white or empty areas from the input image. the final image must fill the entire vertical frame with a continuous, coherent environment.`;

    } else { // 16:9 Horizontal
        cameraInstruction = `camera: horizontal landscape orientation in 16:9 style, balanced and natural.
the composition must follow a proportional horizontal frame similar to 1920x1080,
without excessive width or stretching.
keep the framing natural and centered, avoiding overly tall vertical expansion
but also avoiding overly wide or stretched horizontal framing.
ensure the subject fits comfortably within the frame, with minimal empty space on the sides.`;

        backgroundInstruction = `expand the background scene naturally beyond the reference boundaries, eliminating any white or empty areas from the input image. the final image must fill the entire horizontal frame with a continuous, coherent environment.`;
    }
    
    const personaDescription = `${personaValue} ${hairValue}`.trim();
    
    const finalPrompt = `**Primary Critical Objective: Accurately transfer the clothing from the reference image to the new model and scene.**
- **Clothing Rule (Non-negotiable):** The generated image MUST feature the EXACT same clothing as the input image. This includes the style, cut, fabric, texture, pattern, and color. Your main goal is to preserve this outfit perfectly. Do not change, alter, or "reimagine" the clothing in any way. The original outfit is described as: ${clothingDescription}.
- **Fit:** Ensure the clothing fits the new model's body realistically and naturally.

**Secondary Task: Place the model and outfit in a new context.**
Generate an ultra-realistic photo of a ${personaDescription} ${compositionDescription}.

**Scene Details:**
- **Environment:** ${environmentValue}
- **Lighting:** ${lightingValue}

**Background Handling:**
- **Instruction:** Based on the input canvas, ${backgroundInstruction}

**Camera & Composition:**
- **Instruction:** ${cameraInstruction}
- **Feeling:** Natural, confident, and stylish.

**Overall Style:**
- **Aesthetic:** Modern, feminine, fashion-influencer.
- **Quality:** Photorealistic, cinematic, high-resolution, 8k.`;

    const imagePart = { inlineData: { data: base64Image, mimeType } };
    const textPart = { text: finalPrompt };

    const response = await getAiInstance().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [ imagePart, textPart ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("Image generation failed or returned no images.");
};


// --- Netlify Function Handler ---

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    if (!event.body) {
      throw new Error("Request body is empty.");
    }

    const { action, payload } = JSON.parse(event.body);

    switch (action) {
      case 'describe': {
        const { image, mimeType } = payload;
        const description = await getClothingDescription(image, mimeType);
        return { statusCode: 200, body: JSON.stringify({ description }) };
      }
      case 'generate': {
        const { options, image, mimeType } = payload;
        const imageB64 = await generateStyledImage(options, image, mimeType);
        return { statusCode: 200, body: JSON.stringify({ imageB64 }) };
      }
      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action specified.' }) };
    }
  } catch (error) {
    console.error('Error in Netlify function:', error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };