import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { imageBase64, sceneData, aspectRatio } = req.body;

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash-image'
    });

    const clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `
Generate a photorealistic fashion photo.
Scene: ${sceneData.category}
Details: ${Object.entries(sceneData.options)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}
Clothing must match EXACTLY the reference image.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: clean,
                mimeType: 'image/jpeg'
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1
      },
      toolConfig: {
        image: { aspectRatio }
      }
    });

    const parts = result.response.candidates?.[0]?.content?.parts || [];

    for (const p of parts) {
      if (p.inlineData?.data) {
        return res.json({
          image: `data:image/png;base64,${p.inlineData.data}`
        });
      }
    }

    res.status(400).json({ error: 'Nenhuma imagem gerada.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
