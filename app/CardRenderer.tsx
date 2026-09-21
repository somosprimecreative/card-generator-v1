"use client";
/* eslint-disable @next/next/no-img-element -- Data URLs and declared demo photography share the same deterministic export DOM. */

import { BrandProfile, CardComposition, Creation, templates } from "./prisma-data";
import styles from "./CardRenderer.module.css";

function densityFor(title: string, body: string) {
  const weight = title.trim().length + body.trim().length * 0.34;
  if (weight > 210) return "tight";
  if (weight > 128) return "dense";
  return "regular";
}

function initials(name?: string) {
  return name?.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "P";
}

const usesImage = (composition: CardComposition) => composition === "photo-caption";

export function CardRenderer({ creation, brand, page = 0, compact = false, exportMode = false }: { creation: Creation; brand?: BrandProfile; page?: number; compact?: boolean; exportMode?: boolean }) {
  const template = templates.find((item) => item.id === creation.templateId) ?? templates[0];
  const content = creation.pages[page] ?? creation.content;
  const composition = content.composition ?? template.pageBlueprint[Math.min(page, template.pageBlueprint.length - 1)] ?? template.style;
  const colors = brand?.colors ?? ["#2650F6", "#F3E19C"];
  const density = densityFor(content.title, content.body);
  const style = {
    aspectRatio: `${creation.dimensions.width} / ${creation.dimensions.height}`,
    "--brand-primary": colors[0],
    "--brand-secondary": colors[1],
    ...(exportMode ? { width: `${creation.dimensions.width}px`, height: `${creation.dimensions.height}px`, minHeight: `${creation.dimensions.height}px` } : {}),
  } as React.CSSProperties;
  const pageLabel = String(page + 1).padStart(2, "0");
  const countLabel = String(creation.pages.length).padStart(2, "0");
  const tag = content.subtitle || template.category;

  return <article
    data-prisma-card="true"
    data-template={composition}
    data-density={density}
    className={`${styles.card} ${styles[composition]} ${compact ? styles.compact : ""} ${exportMode ? styles.exportCard : ""}`}
    style={style}
  >
    {usesImage(composition) && <div className={styles.photo}>
      {content.imageData
        ? <img src={content.imageData} crossOrigin="anonymous" alt={content.imageName ? `Imagem: ${content.imageName}` : "Imagem da criação"} style={{ objectPosition: content.imagePosition || "50% 50%" }}/>
        : <div className={styles.photoFallback}><b>{initials(brand?.name)}</b><span>{content.imageName || "Adicione uma imagem"}</span></div>}
    </div>}

    <header className={styles.header}>
      <span className={styles.identity}>{brand?.name ?? "Sem marca"}</span>
      <span className={styles.counter}>{pageLabel}<i />{countLabel}</span>
    </header>

    <div className={styles.content}>
      {(composition === "photo-caption" || composition === "dark-copy") && <span className={styles.tag}>{tag}</span>}
      {composition === "minimal-cover" && <div className={styles.profile}><b>{initials(brand?.name)}</b><span>{tag}</span></div>}
      {composition === "minimal-copy" && <span className={styles.sectionLabel}>{tag}</span>}
      {composition === "prompt" && <span className={styles.promptIndex}>01</span>}
      {composition === "poster" && <span className={styles.posterKicker}>{tag}</span>}
      <h3>{content.title}</h3>
      {!compact && content.body && <p className={styles.body}>{content.body}</p>}
    </div>

    <footer className={styles.footer}>
      <span className={styles.dots}><i /><i /><i /></span>
      <span className={styles.action}>{content.cta || "Saiba mais"}<b aria-hidden="true">↗</b></span>
    </footer>
  </article>;
}
