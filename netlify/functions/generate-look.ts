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

    if (!process.env.API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API Key is missing" }),
      };
    }

    const ai = new GoogleGenerativeAI(process.env.API_KEY);

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
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
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.0,
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
