"use client";
/* eslint-disable @next/next/no-img-element -- Data URLs and declared demo photography share the same deterministic export DOM. */

import { BrandProfile, CardComposition, Content, Creation, templates } from "./pixel-data";
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

const usesImage = (composition: CardComposition) => composition === "photo-caption" || composition === "editorial-image";
const isEditorial = (composition: CardComposition) => composition.startsWith("editorial-");

function EditorialContent({ composition, content }: { composition: CardComposition; content: Content }) {
  const slots = content.slots ?? {};
  const kicker = slots.kicker || content.subtitle;
  const title = slots.title || content.title;
  const body = slots.body || content.body;
  const list = slots.list ?? [];
  const statistic = slots.statistic;

  if (composition === "editorial-data-list") return <div className={`${styles.content} ${styles.editorialContent}`}>
    <div className={styles.editorialStat}><strong>{statistic?.value || String(list.length).padStart(2, "0")}</strong><span>{statistic?.label || "pontos para guardar"}</span></div>
    <ol className={styles.editorialList}>{list.slice(0, 4).map((item, index) => <li key={`${item}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>
  </div>;

  if (composition === "editorial-highlight") return <div className={`${styles.content} ${styles.editorialContent}`}>
    <span className={styles.editorialKicker}>{kicker}</span>
    <span className={styles.editorialQuoteMark} aria-hidden="true">“</span>
    <h3>{slots.highlight || title}</h3>
    {body && <p className={styles.body}>{body}</p>}
  </div>;

  return <div className={`${styles.content} ${styles.editorialContent}`}>
    {kicker && <span className={styles.editorialKicker}>{kicker}</span>}
    <h3>{title}</h3>
    {(composition === "editorial-content" || composition === "editorial-image") && body && <p className={styles.body}>{body}</p>}
  </div>;
}

export function CardRenderer({ creation, brand, page = 0, compact = false, exportMode = false }: { creation: Creation; brand?: BrandProfile; page?: number; compact?: boolean; exportMode?: boolean }) {
  const template = templates.find((item) => item.id === creation.templateId) ?? templates[0];
  const content = creation.pages[page] ?? creation.content;
  const composition = content.composition ?? template.pageBlueprint[Math.min(page, template.pageBlueprint.length - 1)] ?? template.style;
  const colors = brand?.colors ?? ["#F04B3E", "#A9DCE8"];
  const density = densityFor(content.slots?.title || content.slots?.highlight || content.title, content.slots?.body || content.body);
  const style = {
    aspectRatio: `${creation.dimensions.width} / ${creation.dimensions.height}`,
    "--brand-primary": colors[0],
    "--brand-secondary": colors[1],
    ...(exportMode ? { width: `${creation.dimensions.width}px`, height: `${creation.dimensions.height}px`, minHeight: `${creation.dimensions.height}px` } : {}),
  } as React.CSSProperties;
  const pageLabel = String(page + 1).padStart(2, "0");
  const countLabel = String(creation.pages.length).padStart(2, "0");
  const tag = content.slots?.kicker || content.subtitle || template.category;
  const image = content.slots?.image;
  const editorial = isEditorial(composition);

  return <article
    data-pixel-card="true"
    data-template={composition}
    data-family={editorial ? "editorial" : "legacy"}
    data-page-role={content.pageRole || (page === 0 ? "cover" : page === creation.pages.length - 1 ? "closing" : "content")}
    data-density={density}
    className={`${styles.card} ${styles[composition]} ${compact ? styles.compact : ""} ${exportMode ? styles.exportCard : ""}`}
    style={style}
  >
    {usesImage(composition) && <div className={styles.photo}>
      {image?.src || content.imageData
        ? <img src={image?.src || content.imageData} crossOrigin="anonymous" alt={image?.name || content.imageName ? `Imagem: ${image?.name || content.imageName}` : "Imagem da criação"} style={{ objectPosition: image?.position || content.imagePosition || "50% 50%" }}/>
        : <div className={styles.photoFallback}><b>{initials(brand?.name)}</b><span>{image?.name || content.imageName || "Adicione uma imagem"}</span></div>}
    </div>}

    <header className={styles.header}>
      <span className={styles.identity}>{content.slots?.identity || brand?.name || "Sem marca"}</span>
      <span className={styles.counter}>{pageLabel}<i />{countLabel}</span>
    </header>

    {editorial ? <EditorialContent composition={composition} content={content}/> : <div className={styles.content}>
      {(composition === "photo-caption" || composition === "dark-copy") && <span className={styles.tag}>{tag}</span>}
      {composition === "minimal-cover" && <div className={styles.profile}><b>{initials(brand?.name)}</b><span>{tag}</span></div>}
      {composition === "minimal-copy" && <span className={styles.sectionLabel}>{tag}</span>}
      {composition === "prompt" && <span className={styles.promptIndex}>01</span>}
      {composition === "poster" && <span className={styles.posterKicker}>{tag}</span>}
      <h3>{content.title}</h3>
      {!compact && content.body && <p className={styles.body}>{content.body}</p>}
    </div>}

    <footer className={styles.footer}>
      <span className={styles.dots}><i /><i /><i /></span>
      <span className={styles.action}>{content.slots?.cta || content.cta || "Saiba mais"}<b aria-hidden="true">↗</b></span>
    </footer>
  </article>;
}
