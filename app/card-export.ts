"use client";

import { toJpeg, toPng } from "html-to-image";
import JSZip from "jszip";

export type ExportFormat = "png" | "jpg";

const safeName = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "prisma";

async function ready(node: HTMLElement) {
  await document.fonts?.ready;
  await Promise.all(Array.from(node.querySelectorAll("img")).map(async (image) => { if (!image.complete) await new Promise<void>((resolve) => { image.onload = () => resolve(); image.onerror = () => resolve(); }); }));
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

export async function renderCard(node: HTMLElement, format: ExportFormat = "png") {
  await ready(node);
  const options = { cacheBust: true, pixelRatio: 1, backgroundColor: "#0E1116", quality: 0.94 };
  return format === "jpg" ? toJpeg(node, options) : toPng(node, options);
}

export async function downloadCard(node: HTMLElement, name: string, format: ExportFormat = "png") {
  const dataUrl = await renderCard(node, format);
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${safeName(name)}.${format}`;
  anchor.click();
}

export async function downloadCardsZip(nodes: HTMLElement[], name: string, format: ExportFormat = "png") {
  const zip = new JSZip();
  for (const [index, node] of nodes.entries()) {
    const dataUrl = await renderCard(node, format);
    zip.file(`${safeName(name)}-${String(index + 1).padStart(2, "0")}.${format}`, dataUrl.split(",")[1], { base64: true });
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${safeName(name)}.zip`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}
