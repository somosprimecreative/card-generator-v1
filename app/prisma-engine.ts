import { CardComposition, Content, Template } from "./prisma-data";

export type RenderIssue = {
  code: "content-overflow" | "unsafe-contrast" | "missing-image";
  message: string;
};

export type StructuredPage = Content & {
  role: "cover" | "body" | "closing";
  composition: CardComposition;
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
  if (template.pageBlueprint.includes("photo-caption") && !normalized.imageName) {
    issues.push({ code: "missing-image", message: "Este template funciona melhor com uma imagem, mas pode ser gerado sem ela." });
  }
  return issues;
}

export function composePages(content: Content, template: Template): StructuredPage[] {
  const safe = sanitizeContent(content);
  const blueprints = template.pages === "multiple" ? template.pageBlueprint : [template.style];
  const labels = ["Contexto", "A ideia", "Em perspectiva", "Para guardar", "Próximo passo"];
  const bodyTitle = safe.body || safe.title;

  return blueprints.map((composition, index) => {
    const role = index === 0 ? "cover" : index === blueprints.length - 1 ? "closing" : "body";
    if (composition === "photo-caption") return { ...safe, role, composition, subtitle: safe.subtitle || labels[index], body: index === 0 ? safe.body : "" };
    if (composition === "minimal-cover") return { ...safe, role, composition, subtitle: safe.subtitle || labels[index], body: "" };
    if (composition === "minimal-copy" || composition === "dark-copy") return { ...safe, role, composition, subtitle: labels[index] || safe.subtitle, title: bodyTitle, body: index % 2 ? safe.body : "", cta: "Continuar" };
    if (composition === "prompt") return { ...safe, role, composition, subtitle: safe.subtitle || "Uma pergunta", title: safe.title, body: "", cta: safe.cta || "Continuar" };
    if (composition === "poster") return { ...safe, role, composition, subtitle: safe.subtitle || labels[index], title: safe.title, body: "", cta: safe.cta || "Guardar ideia" };
    return { ...safe, role, composition, subtitle: safe.subtitle || "Próximo passo", title: safe.cta || safe.title, body: "", cta: safe.cta || "Saiba mais" };
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
