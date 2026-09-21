"use client";
/* eslint-disable @next/next/no-img-element -- User-selected data URLs are rendered inside the deterministic card DOM before export. */

import { BrandProfile, Creation, templates } from "./prisma-data";

export function CardRenderer({ creation, brand, page = 0, compact = false, exportMode = false }: { creation: Creation; brand?: BrandProfile; page?: number; compact?: boolean; exportMode?: boolean }) {
  const template = templates.find((item) => item.id === creation.templateId) ?? templates[0];
  const content = creation.pages[page] ?? creation.content;
  const colors = brand?.colors ?? ["#2650F6", "#F3E19C"];
  const style = {
    aspectRatio: `${creation.dimensions.width} / ${creation.dimensions.height}`,
    "--brand-primary": colors[0],
    "--brand-secondary": colors[1],
    ...(exportMode ? { width: `${creation.dimensions.width}px`, height: `${creation.dimensions.height}px`, minHeight: `${creation.dimensions.height}px` } : {}),
  } as React.CSSProperties;

  return <article data-prisma-card="true" className={`creation-preview prisma-card preview-${template.style} ${compact ? "compact" : ""} ${exportMode ? "export-card" : ""}`} style={style}>
    <div className="preview-head"><span>{brand?.name ?? "Sem marca"}</span><span>{page + 1}/{creation.pages.length}</span></div>
    {template.style === "image" && <div className="preview-image">{content.imageData ? <img src={content.imageData} alt="Imagem selecionada"/> : <><span className="image-placeholder">Imagem</span><span>{content.imageName || "Imagem da criação"}</span></>}</div>}
    <div className="preview-copy">
      <p className="preview-kicker">{content.subtitle}</p>
      <h3>{content.title}</h3>
      {!compact && <p className="preview-body">{content.body}</p>}
      <span className="preview-cta">{content.cta} <span aria-hidden="true">→</span></span>
    </div>
    <div className="preview-accent" />
  </article>;
}
