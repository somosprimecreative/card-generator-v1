import { CardComposition, Content, PagePlan, PageRole, PageSlots, Template } from "./pixel-data";

export type RenderIssue = {
  code: "content-overflow" | "unsafe-contrast" | "missing-image";
  message: string;
};

export type StructuredPage = Content & {
  pageRole: PageRole;
  composition: CardComposition;
  slots: PageSlots;
};

export const contentLimits = {
  title: 104,
  subtitle: 150,
  body: 420,
  cta: 44,
} as const;

export function sanitizeContent(content: Content): Content {
  return {
    ...content,
    title: content.title.trim().slice(0, contentLimits.title),
    subtitle: content.subtitle.trim().slice(0, contentLimits.subtitle),
    body: content.body.trim().slice(0, contentLimits.body),
    cta: content.cta.trim().slice(0, contentLimits.cta),
  };
}

export function validateContent(content: Content, template: Template): RenderIssue[] {
  const normalized = sanitizeContent(content);
  const issues: RenderIssue[] = [];
  if (!normalized.title) issues.push({ code: "content-overflow", message: "Inclua um título para gerar a criação." });
  if (content.title.trim().length > contentLimits.title || content.body.trim().length > contentLimits.body) {
    issues.push({ code: "content-overflow", message: "O texto foi reduzido para preservar a leitura no formato escolhido." });
  }
  if ((template.pageBlueprint.includes("photo-caption") || template.pageBlueprint.includes("editorial-cover") || template.pageBlueprint.includes("editorial-image")) && !normalized.imageName) {
    issues.push({ code: "missing-image", message: "Este template funciona melhor com uma imagem, mas pode ser gerado sem ela." });
  }
  return issues;
}

const editorialPlans: PagePlan[] = [
  { role: "cover", composition: "editorial-cover", slots: ["identity", "kicker", "title", "cta"] },
  { role: "content", composition: "editorial-content", slots: ["identity", "kicker", "title", "body"] },
  { role: "closing", composition: "editorial-closing", slots: ["identity", "kicker", "title", "cta"] },
];

function listFrom(content: Content) {
  const explicit = content.slots?.list?.filter(Boolean) ?? [];
  if (explicit.length) return explicit.slice(0, 4);
  const parts = content.body.split(/\n+|(?<=[.!?])\s+/).map((item) => item.replace(/^[-•\d.\s]+/, "").trim()).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 4);
  return [content.title, content.subtitle || "Uma decisão por vez", content.cta || "Próximo passo"].filter(Boolean).slice(0, 3);
}

function semanticSlots(content: Content, plan: PagePlan, index: number): PageSlots {
  const list = listFrom(content);
  const inherited = content.slots ?? {};
  const statistic = inherited.statistic ?? { value: String(list.length).padStart(2, "0"), label: "pontos para guardar" };
  return {
    identity: inherited.identity,
    kicker: inherited.kicker || (plan.role === "cover" ? content.subtitle : ["", "Na prática", "Agora"][index]),
    title: inherited.title || content.title,
    body: inherited.body || content.body,
    image: inherited.image || { src: content.imageData, name: content.imageName, position: content.imagePosition },
    highlight: inherited.highlight || content.title,
    statistic,
    list,
    cta: inherited.cta || content.cta,
  };
}

/**
 * Composes a semantic page contract before selecting its DOM composition. Existing
 * legacy templates continue to use their stored compositions and therefore remain renderable.
 */
export function composePages(content: Content, template: Template, pageContent?: Content[]): StructuredPage[] {
  const safe = sanitizeContent(content);
  const plans = template.family === "editorial"
    ? (template.pagePlan?.length ? template.pagePlan : editorialPlans)
    : null;
  const blueprints = template.pages === "multiple" ? template.pageBlueprint : [template.style];
  const labels = ["Contexto", "A ideia", "Em perspectiva", "Para guardar", "Próximo passo"];
  const bodyTitle = safe.body || safe.title;

  if (plans) return plans.map((plan, index) => {
    const source = sanitizeContent({ ...safe, ...(pageContent?.[index] ?? {}) });
    const slots = semanticSlots(source, plan, index);
    const title = plan.role === "highlight" ? slots.highlight || source.title : slots.title || source.title;
    return { ...source, title, subtitle: slots.kicker || source.subtitle, composition: plan.composition, pageRole: plan.role, slots };
  });

  return blueprints.map((composition, index) => {
    const source = sanitizeContent({ ...safe, ...(pageContent?.[index] ?? {}) });
    const pageRole: PageRole = index === 0 ? "cover" : index === blueprints.length - 1 ? "closing" : "content";
    const slots = semanticSlots(source, { role: pageRole, composition, slots: ["title"] }, index);
    if (composition === "photo-caption") return { ...source, pageRole, slots, composition, subtitle: source.subtitle || labels[index], body: index === 0 ? source.body : "" };
    if (composition === "minimal-cover") return { ...source, pageRole, slots, composition, subtitle: source.subtitle || labels[index], body: "" };
    if (composition === "minimal-copy" || composition === "dark-copy") return { ...source, pageRole, slots, composition, subtitle: labels[index] || source.subtitle, title: bodyTitle, body: index % 2 ? source.body : "", cta: "Continuar" };
    if (composition === "prompt") return { ...source, pageRole, slots, composition, subtitle: source.subtitle || "Uma pergunta", title: source.title, body: "", cta: source.cta || "Continuar" };
    if (composition === "poster") return { ...source, pageRole, slots, composition, subtitle: source.subtitle || labels[index], title: source.title, body: "", cta: source.cta || "Guardar ideia" };
    return { ...source, pageRole, slots, composition, subtitle: source.subtitle || "Próximo passo", title: source.cta || source.title, body: "", cta: source.cta || "Saiba mais" };
  });
}

export function inspectRenderedCard(node: HTMLElement): RenderIssue[] {
  const frame = node.getBoundingClientRect();
  const textNodes = Array.from(node.querySelectorAll<HTMLElement>("h1, h2, h3, p, span"));
  const hasOverflow = textNodes.some((item) => {
    const rect = item.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && (rect.left < frame.left - 1 || rect.right > frame.right + 1 || rect.top < frame.top - 1 || rect.bottom > frame.bottom + 1);
  });
  return hasOverflow ? [{ code: "content-overflow", message: "Encontramos excesso de conteúdo. Revise o texto antes de exportar." }] : [];
}
