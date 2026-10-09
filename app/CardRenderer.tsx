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

const usesImage = (composition: CardComposition) => composition === "photo-caption" || composition === "editorial-cover" || composition === "editorial-image";
const isEditorial = (composition: CardComposition) => composition.startsWith("editorial-");

function editorialHandle(identity: string) {
  const normalized = identity.trim();
  if (!normalized) return "@sua-marca";
  if (normalized.startsWith("@")) return normalized;
  return `@${normalized.toLocaleLowerCase("pt-BR").replace(/[^\p{L}\p{N}]+/gu, "").slice(0, 22)}`;
}

const softBreakWords = new Set(["a", "à", "as", "com", "da", "das", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "um", "uma"]);

/**
 * Headline composition is intentionally content-led. It chooses 2–4 balanced
 * lines at word boundaries, avoiding stranded connectives and rewarding clause
 * endings. This is used only by the editorial family; legacy templates keep
 * their original wrapping behaviour.
 */
function editorialLines(value: string): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) return [value.trim()];

  const characterCount = value.trim().length;
  const targetLines = characterCount <= 28 ? 2 : characterCount <= 56 ? 3 : 4;
  const lineCount = Math.min(targetLines, words.length);
  const total = words.reduce((sum, word) => sum + word.length, 0);
  const targetLength = total / lineCount;
  let best: { lines: string[]; score: number } | null = null;

  const visit = (start: number, remaining: number, lines: string[], semanticScore = 0) => {
    if (remaining === 1) {
      const finalLine = words.slice(start).join(" ");
      if (!finalLine) return;
      const candidate = [...lines, finalLine];
      const lengths = candidate.map((line) => line.replace(/\s/g, "").length);
      const variance = lengths.reduce((sum, length) => sum + Math.abs(length - targetLength), 0);
      const orphanPenalty = lengths.some((length) => length < Math.max(5, targetLength * .34)) ? 18 : 0;
      const score = variance + orphanPenalty + semanticScore;
      if (!best || score < best.score) best = { lines: candidate, score };
      return;
    }

    for (let end = start + 1; end <= words.length - remaining; end += 1) {
      const line = words.slice(start, end).join(" ");
      const next = words[end]?.toLocaleLowerCase("pt-BR").replace(/^[^\p{L}]+/u, "");
      const last = words[end - 1].toLocaleLowerCase("pt-BR").replace(/[^\p{L}]+$/u, "");
      const semanticBonus = /[,;:—–-]$/.test(words[end - 1]) ? -5 : 0;
      const connectivePenalty = softBreakWords.has(last) || softBreakWords.has(next) ? 12 : 0;
      const lengthPenalty = Math.abs(line.replace(/\s/g, "").length - targetLength);
      visit(end, remaining - 1, [...lines, line], semanticScore + lengthPenalty * .18 + connectivePenalty + semanticBonus);
    }
  };

  visit(0, lineCount, []);
  return (best as { lines: string[]; score: number } | null)?.lines ?? [value.trim()];
}

function EditorialHeadline({ children }: { children: string }) {
  const lines = editorialLines(children);
  return <span className={styles.headline} data-lines={lines.length}>{lines.map((line, index) => <span className={styles.headlineLine} key={`${line}-${index}`}>{line}</span>)}</span>;
}

function EditorialContent({ composition, content, identity }: { composition: CardComposition; content: Content; identity: string }) {
  const slots = content.slots ?? {};
  const kicker = slots.kicker || content.subtitle;
  const title = slots.title || content.title;
  const body = slots.body || content.body;
  const list = slots.list ?? [];
  const statistic = slots.statistic;

  const posterTitle = content.coverVariant === "highlight"
    ? title.split(/(\s+)/).map((part, index, words) => {
      const terms = words.filter((word) => word.trim());
      const longest = terms.reduce((current, word) => word.length > current.length ? word : current, "");
      return part.trim() && part === longest ? <mark key={`${part}-${index}`}>{part}</mark> : part;
    })
    : title;

  if (composition === "editorial-cover") return <div className={`${styles.content} ${styles.editorialContent} ${styles.editorialCoverContent}`}>
    <span className={styles.editorialSeal}><b>{initials(slots.identity || identity)}</b><span>{slots.identity || identity}</span><i aria-label="Perfil verificado">✓</i></span>
    <span className={styles.editorialKicker}>{kicker}</span>
    <h3>{typeof posterTitle === "string" ? <EditorialHeadline>{posterTitle}</EditorialHeadline> : posterTitle}</h3>
    {body && <p className={`${styles.body} ${styles.editorialDeck}`}>{body}</p>}
    <span className={styles.editorialCoverCta}>{slots.cta || content.cta || "Continuar"}<b aria-hidden="true">→</b></span>
  </div>;

  if (composition === "editorial-data-list") return <div className={`${styles.content} ${styles.editorialContent}`}>
    <div className={styles.editorialStat}><strong>{statistic?.value || String(list.length).padStart(2, "0")}</strong><span>{statistic?.label || "pontos para guardar"}</span></div>
    <ol className={styles.editorialList}>{list.slice(0, 4).map((item, index) => <li key={`${item}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>
  </div>;

  if (composition === "editorial-highlight") return <div className={`${styles.content} ${styles.editorialContent}`}>
    <span className={styles.editorialKicker}>{kicker}</span>
    <span className={styles.editorialQuoteMark} aria-hidden="true">“</span>
    <h3><EditorialHeadline>{slots.highlight || title}</EditorialHeadline></h3>
    {body && <p className={styles.body}>{body}</p>}
  </div>;

  if (composition === "editorial-closing") return <div className={`${styles.content} ${styles.editorialContent} ${styles.editorialClosingContent}`}>
    <h3>{title}</h3>
    {body && <p className={styles.body}>{body}</p>}
    <span className={styles.editorialSaveCta}><b aria-hidden="true">▮</b>{slots.cta || content.cta || "Salvar este post"}</span>
  </div>;

  return <div className={`${styles.content} ${styles.editorialContent}`}>
    <h3><EditorialHeadline>{title}</EditorialHeadline></h3>
    {composition === "editorial-content" && body && <p className={styles.body}>{body}</p>}
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
  const identity = content.slots?.identity || brand?.name || "Sem marca";
  const coverVariantClass = composition === "editorial-cover" ? ({
    signature: styles.editorialCoverSignature,
    poster: styles.editorialCoverPoster,
    editorial: styles.editorialCoverEditorial,
    highlight: styles.editorialCoverHighlight,
    split: styles.editorialCoverSplit,
  }[content.coverVariant ?? "signature"]) : "";

  return <article
    data-pixel-card="true"
    data-template={composition}
    data-family={editorial ? "editorial" : "legacy"}
    data-page-role={content.pageRole || (page === 0 ? "cover" : page === creation.pages.length - 1 ? "closing" : "content")}
    data-density={density}
    className={`${styles.card} ${styles[composition]} ${coverVariantClass} ${compact ? styles.compact : ""} ${exportMode ? styles.exportCard : ""}`}
    style={style}
  >
    {usesImage(composition) && <div className={styles.photo}>
      {image?.src || content.imageData
        ? <img src={image?.src || content.imageData} crossOrigin="anonymous" alt={image?.name || content.imageName ? `Imagem: ${image?.name || content.imageName}` : "Imagem da criação"} style={{ objectPosition: image?.position || content.imagePosition || "50% 50%" }}/>
        : <div className={styles.photoFallback}><b>{initials(brand?.name)}</b><span>{image?.name || content.imageName || "Adicione uma imagem"}</span></div>}
    </div>}

    <header className={`${styles.header} ${editorial ? styles.editorialChrome : ""}`}>
      {editorial
        ? <><span className={styles.editorialHandle}>{editorialHandle(identity)}</span><span className={styles.editorialBadge}>{composition === "editorial-cover" ? template.category : tag}</span></>
        : <><span className={styles.identity}>{identity}</span><span className={styles.counter}>{pageLabel}<i />{countLabel}</span></>}
    </header>

    {editorial ? <EditorialContent composition={composition} content={content} identity={identity}/> : <div className={styles.content}>
      {(composition === "photo-caption" || composition === "dark-copy") && <span className={styles.tag}>{tag}</span>}
      {composition === "minimal-cover" && <div className={styles.profile}><b>{initials(brand?.name)}</b><span>{tag}</span></div>}
      {composition === "minimal-copy" && <span className={styles.sectionLabel}>{tag}</span>}
      {composition === "prompt" && <span className={styles.promptIndex}>01</span>}
      {composition === "poster" && <span className={styles.posterKicker}>{tag}</span>}
      <h3>{content.title}</h3>
      {!compact && content.body && <p className={styles.body}>{content.body}</p>}
    </div>}

    <footer className={`${styles.footer} ${editorial ? `${styles.editorialChrome} ${styles.editorialFooter}` : ""}`}>
      {editorial && <span className={styles.editorialPageCount}>{pageLabel}/{countLabel}</span>}
      <span className={styles.dots}>{[0, 1, 2].map((dot) => <i key={dot} className={dot === (editorial ? page % 3 : 0) ? styles.dotActive : ""}/>)}</span>
      <span className={styles.action}>{editorial ? (page === creation.pages.length - 1 ? "Salvar" : "Arrasta") : content.slots?.cta || content.cta || "Saiba mais"}<b aria-hidden="true">{editorial ? "→" : "↗"}</b></span>
    </footer>
  </article>;
}
