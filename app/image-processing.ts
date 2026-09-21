"use client";

export type PreparedImage = {
  dataUrl: string;
  name: string;
};

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_EDGE = 2200;

export async function prepareImageForCard(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem válido.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("Use uma imagem de até 12 MB.");

  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
      element.src = sourceUrl;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível preparar esta imagem.");
    context.drawImage(image, 0, 0, width, height);
    const keepTransparency = file.type === "image/png";
    return {
      dataUrl: canvas.toDataURL(keepTransparency ? "image/png" : "image/jpeg", keepTransparency ? undefined : 0.9),
      name: file.name,
    };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
