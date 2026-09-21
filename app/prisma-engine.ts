import { Content, Template } from "./prisma-data";

export type RenderIssue = {
  code: "content-overflow" | "unsafe-contrast" | "missing-image";
  message: string;
};

export type StructuredPage = Content & {
  role: "cover" | "body" | "closing";
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
  if (["image", "split"].includes(template.style) && !normalized.imageName) {
    issues.push({ code: "missing-image", message: "Este template funciona melhor com uma imagem, mas pode ser gerado sem ela." });
  }
  return issues;
}

const roleCopy = {
  editorial: ["Contexto", "A ideia", "Próximo passo"],
  steps: ["Comece por aqui", "Passo seguinte", "Coloque em prática"],
  list: ["O essencial", "O que importa", "Para lembrar"],
  comparison: ["Antes", "Depois", "A escolha"],
} as const;

export function composePages(content: Content, template: Template): StructuredPage[] {
  const safe = sanitizeContent(content);
  if (template.pages !== "multiple") return [{ ...safe, role: "cover" }];

  const labels = roleCopy[template.style as keyof typeof roleCopy] ?? roleCopy.editorial;
  const bodyTitle = safe.body || safe.title;

  return [
    { ...safe, role: "cover", subtitle: safe.subtitle || labels[0], body: "" },
    { ...safe, role: "body", subtitle: labels[1], title: bodyTitle, body: "", cta: "Continue" },
    { ...safe, role: "closing", subtitle: labels[2], title: safe.cta || "Leve esta ideia adiante", body: safe.body, cta: safe.cta || "Saiba mais" },
  ];
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
