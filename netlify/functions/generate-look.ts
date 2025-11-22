import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { imageBase64, sceneData, aspectRatio } = body;

    console.log("🔍 Recebido:", { aspectRatio, hasBase64: !!imageBase64 });

    if (!process.env.API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API Key is missing" }),
      };
    }

    const ai = new GoogleGenerativeAI(process.env.API_KEY);

    const model = ai.getGenerativeModel({
      model: "models/gemini-2.5-flash-image",
      apiVersion: "v1beta",
    });

    const cleanBase64 = imageBase64.split(",")[1];

    const mime =
      imageBase64.includes("png")
        ? "image/png"
        : imageBase64.includes("jpg") || imageBase64.includes("jpeg")
        ? "image/jpeg"
        : "image/webp";

    const prompt = `Generate photorealistic fashion photo. Scene: ${sceneData.category}`;

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mime,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.0,
      },
      image: {
        aspectRatio: aspectRatio, // ✔️ novo formato válido
      },
    });

    console.log("🔍 RAW Gemini response:", JSON.stringify(response, null, 2));

    const parts = response.response?.candidates?.[0]?.content?.parts;
    let generatedImage = null;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nenhuma imagem gerada." }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ image: generatedImage }),
    };
  } catch (error) {
    console.error("🔥 NETLIFY FUNCTION ERROR:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
