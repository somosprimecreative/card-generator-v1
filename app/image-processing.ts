"use client";

export type PreparedImage = {
  dataUrl: string;
  name: string;
};

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 1800;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function dataUrlBytes(dataUrl: string) {
  return Math.ceil((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
}

function encode(canvas: HTMLCanvasElement, type: "image/jpeg" | "image/png" | "image/webp", quality?: number) {
  return canvas.toDataURL(type, quality);
}

export async function prepareImageForCard(file: File): Promise<PreparedImage> {
  if (!supportedTypes.has(file.type)) throw new Error("Use JPG, PNG, WebP ou GIF de até 12 MB.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("Use uma imagem de até 12 MB.");

  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
      element.src = sourceUrl;
    });
    const initialScale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    for (const scaleFactor of [1, 0.82, 0.66, 0.52]) {
      const width = Math.max(1, Math.round(image.naturalWidth * initialScale * scaleFactor));
      const height = Math.max(1, Math.round(image.naturalHeight * initialScale * scaleFactor));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível preparar esta imagem.");
      context.drawImage(image, 0, 0, width, height);

      const preserveAlpha = file.type === "image/png" || file.type === "image/webp";
      const attempts = preserveAlpha
        ? [["image/png", undefined], ["image/webp", 0.88], ["image/webp", 0.76]] as const
        : [["image/jpeg", 0.9], ["image/jpeg", 0.8], ["image/jpeg", 0.7]] as const;
      for (const [type, quality] of attempts) {
        const dataUrl = encode(canvas, type, quality);
        if (dataUrlBytes(dataUrl) <= MAX_OUTPUT_BYTES) return { dataUrl, name: file.name };
      }
    }
    throw new Error("A imagem é complexa demais para uso local. Escolha uma foto menor ou mais comprimida.");
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
