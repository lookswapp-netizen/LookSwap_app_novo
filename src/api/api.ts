import type { GenerateImageOptions } from '../types';

// Helper para converter File/Blob para base64
const toBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

// Função unificada para chamar a API da Netlify Function
async function callApi<T>(action: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling API action "${action}":`, error);
    // Re-throw para que o componente possa capturar o erro
    throw error;
  }
}

export const getClothingDescription = async (imageFile: File): Promise<string> => {
  const base64Image = await toBase64(imageFile);
  const payload = {
    image: base64Image,
    mimeType: imageFile.type,
  };
  const result = await callApi<{ description: string }>('describe', payload);
  return result.description;
};

export const generateStyledImage = async (options: GenerateImageOptions, imageFile: File | Blob): Promise<string> => {
  const base64Image = await toBase64(imageFile);
  const payload = {
    options,
    image: base64Image,
    mimeType: imageFile.type,
  };
  const result = await callApi<{ imageB64: string }>('generate', payload);
  return result.imageB64;
};