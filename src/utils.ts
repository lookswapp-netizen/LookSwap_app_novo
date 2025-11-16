/**
 * Normaliza uma imagem para uma proporção específica (9:16 ou 16:9) usando um canvas.
 * Isso garante que a imagem enviada para a API de IA já tenha o formato correto.
 * @param file O arquivo de imagem original.
 * @param mode A proporção desejada, "9:16" ou "16:9".
 * @returns Uma Promise que resolve com um Blob da imagem normalizada.
 */
export async function normalizeImage(
  file: File,
  mode: "9:16" | "16:9" = "9:16"
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get canvas context");
        return reject(new Error("Failed to get canvas context"));
      }
      
      // Define o tamanho do canvas conforme a proporção
      if (mode === "9:16") {
        canvas.width = 1080;
        canvas.height = 1920;
      } else { // "16:9"
        canvas.width = 1920;
        canvas.height = 1080;
      }

      // Calcula a escala para ajustar a imagem sem distorcer (letterboxing/pillarboxing)
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;
      
      // Fundo neutro para evitar falhas ou bordas pretas
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenha a imagem centralizada
      ctx.drawImage(img, x, y, newWidth, newHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to Blob conversion failed"));
        }
      }, "image/png"); // Gera um PNG para manter a qualidade
    };

    img.onerror = () => {
        console.error("Failed to load image for normalization");
        reject(new Error("Failed to load image for normalization"));
    }
  });
}