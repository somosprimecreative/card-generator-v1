"use client";
/* eslint-disable @next/next/no-img-element -- User-selected data URLs are rendered inside the deterministic card DOM before export. */

import { BrandProfile, Creation, templates } from "./prisma-data";
import styles from "./CardRenderer.module.css";

function densityFor(title: string, body: string) {
  const weight = title.trim().length + body.trim().length * 0.32;
  if (weight > 180) return "tight";
  if (weight > 105) return "dense";
  return "regular";
}

function initials(name?: string) {
  return name?.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "P";
}

export function CardRenderer({ creation, brand, page = 0, compact = false, exportMode = false }: { creation: Creation; brand?: BrandProfile; page?: number; compact?: boolean; exportMode?: boolean }) {
  const template = templates.find((item) => item.id === creation.templateId) ?? templates[0];
  const content = creation.pages[page] ?? creation.content;
  const colors = brand?.colors ?? ["#2650F6", "#F3E19C"];
  const density = densityFor(content.title, content.body);
  const style = {
    aspectRatio: `${creation.dimensions.width} / ${creation.dimensions.height}`,
    "--brand-primary": colors[0],
    "--brand-secondary": colors[1],
    ...(exportMode ? { width: `${creation.dimensions.width}px`, height: `${creation.dimensions.height}px`, minHeight: `${creation.dimensions.height}px` } : {}),
  } as React.CSSProperties;
  const isImageTemplate = ["image", "split"].includes(template.style);
  const pageCount = String(page + 1).padStart(2, "0");

  return <article
    data-prisma-card="true"
    data-template={template.style}
    data-density={density}
    className={`${styles.card} ${styles[template.style]} ${compact ? styles.compact : ""} ${exportMode ? styles.exportCard : ""}`}
    style={style}
  >
    <header className={styles.head}>
      <span className={styles.brand}>{brand?.name ?? "Sem marca"}</span>
      <span className={styles.page}>{pageCount}<i />{String(creation.pages.length).padStart(2, "0")}</span>
    </header>

    {isImageTemplate && <div className={styles.imageFrame}>
      {content.imageData
        ? <img src={content.imageData} alt={content.imageName ? `Imagem: ${content.imageName}` : "Imagem selecionada"} style={{ objectPosition: content.imagePosition || "50% 50%" }}/>
        : <div className={styles.imagePlaceholder}><b>{initials(brand?.name)}</b><span>{content.imageName || "Imagem da criação"}</span></div>}
    </div>}

    <div className={styles.copy}>
      {template.style === "quote" && <span className={styles.quoteMark}>“</span>}
      <p className={styles.kicker}>{content.subtitle || template.category}</p>
      <h3>{content.title}</h3>
      {!compact && content.body && <p className={styles.body}>{content.body}</p>}
      {template.style === "comparison" && <div className={styles.comparisonLine}><span>Antes</span><i /><span>Depois</span></div>}
    </div>

    <footer className={styles.footer}>
      <span className={styles.cta}>{content.cta || "Saiba mais"}<b aria-hidden="true">↗</b></span>
      {template.style === "steps" && <span className={styles.stepNumber}>{page + 1}</span>}
      {template.style === "stat" && <span className={styles.statDot} />}
    </footer>
    <span className={styles.accent} aria-hidden="true" />
  </article>;
}
