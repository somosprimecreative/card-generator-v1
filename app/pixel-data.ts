export type FormatId = "square" | "portrait" | "vertical" | "story" | "custom";

export type BrandProfile = {
  id: string;
  name: string;
  initials: string;
  colors: [string, string];
  fonts: string;
  slogan: string;
  voice: string;
  guidelines: string;
  assets: string;
};

export type CardComposition =
  | "minimal-cover"
  | "minimal-copy"
  | "prompt"
  | "photo-caption"
  | "poster"
  | "dark-copy"
  | "closing"
  | "editorial-cover"
  | "editorial-content"
  | "editorial-image"
  | "editorial-highlight"
  | "editorial-data-list"
  | "editorial-closing";

/** Cover choices stay within Brand Editorial; they are not separate templates. */
export type EditorialCoverVariant = "signature" | "poster" | "editorial" | "highlight" | "split";
export const editorialCoverVariants: { id: EditorialCoverVariant; name: string; description: string }[] = [
  { id: "signature", name: "Assinatura", description: "Selo de marca, manchete-pôster e CTA." },
  { id: "poster", name: "Pôster", description: "Fotografia integral e chamada de alto impacto." },
  { id: "editorial", name: "Editorial", description: "Manchete serifada, leitura mais sóbria." },
  { id: "highlight", name: "Destaque", description: "Palavras-chave em blocos cromáticos." },
  { id: "split", name: "Split", description: "Imagem superior e painel editorial escuro." },
];

/**
 * Pages keep their editorial purpose separate from their visual composition.
 * This lets a future family reuse the same roles without inheriting Editorial's layout.
 */
export type PageRole = "cover" | "content" | "image" | "highlight" | "data-list" | "closing";
export type PageSlotName = "identity" | "kicker" | "title" | "body" | "image" | "highlight" | "statistic" | "list" | "cta";

export type PageSlots = {
  identity?: string;
  kicker?: string;
  title?: string;
  body?: string;
  image?: { src?: string; name?: string; position?: string };
  highlight?: string;
  statistic?: { value: string; label: string };
  list?: string[];
  cta?: string;
};

export type PagePlan = {
  role: PageRole;
  composition: CardComposition;
  slots: PageSlotName[];
};

export type Template = {
  id: string;
  name: string;
  category: string;
  formats: Exclude<FormatId, "custom">[];
  pages: "single" | "multiple" | "both";
  description: string;
  fields: string[];
  style: CardComposition;
  pageBlueprint: CardComposition[];
  /** Legacy templates omit this. New families declare semantic page intent here. */
  family?: "legacy" | "editorial";
  coverVariants?: EditorialCoverVariant[];
  pagePlan?: PagePlan[];
  demo: Pick<Content, "title" | "subtitle" | "body" | "cta" | "imageData">;
};

export type Content = {
  brief: string;
  title: string;
  subtitle: string;
  body: string;
  cta: string;
  imageName?: string;
  imageData?: string;
  imagePosition?: string;
  composition?: CardComposition;
  pageRole?: PageRole;
  slots?: PageSlots;
  coverVariant?: EditorialCoverVariant;
};

export type Creation = {
  id: string;
  name: string;
  brandId: string | null;
  templateId: string;
  format: FormatId;
  dimensions: { width: number; height: number };
  content: Content;
  pages: Content[];
  createdAt: string;
  expiresAt: string;
  parentId?: string;
};

export const formats: { id: FormatId; name: string; pixels: string; width: number; height: number }[] = [
  { id: "square", name: "1:1", pixels: "1080 × 1080 px", width: 1080, height: 1080 },
  { id: "portrait", name: "4:5", pixels: "1080 × 1350 px", width: 1080, height: 1350 },
  { id: "vertical", name: "3:4", pixels: "1080 × 1440 px", width: 1080, height: 1440 },
  { id: "story", name: "9:16", pixels: "1080 × 1920 px", width: 1080, height: 1920 },
  { id: "custom", name: "Personalizado", pixels: "largura × altura", width: 1200, height: 1200 },
];

const photo = {
  portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
  studio: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  product: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
  architecture: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
} as const;

const demo = (title: string, subtitle: string, body: string, cta: string, imageData?: string) => ({ title, subtitle, body, cta, imageData });

/** Each template declares real page compositions; none exposes a free layout. */
export const templates: Template[] = [
  {
    id: "minimal-editorial", name: "Brand Editorial", category: "Editorial", formats: ["square", "portrait", "vertical", "story"], pages: "multiple", family: "editorial",
    description: "Seis páginas com ritmo de capa, leitura, imagem, destaque, dados e encerramento.", fields: ["Título", "Subtítulo", "Texto", "CTA", "Imagem"], style: "editorial-cover",
    pageBlueprint: ["editorial-cover", "editorial-content", "editorial-image", "editorial-highlight", "editorial-data-list", "editorial-closing"], coverVariants: ["signature", "poster", "editorial", "highlight", "split"],
    pagePlan: [
      { role: "cover", composition: "editorial-cover", slots: ["identity", "kicker", "title", "cta"] },
      { role: "content", composition: "editorial-content", slots: ["identity", "kicker", "title", "body"] },
      { role: "image", composition: "editorial-image", slots: ["identity", "kicker", "title", "image", "cta"] },
      { role: "highlight", composition: "editorial-highlight", slots: ["identity", "kicker", "highlight", "body"] },
      { role: "data-list", composition: "editorial-data-list", slots: ["identity", "statistic", "list", "cta"] },
      { role: "closing", composition: "editorial-closing", slots: ["identity", "kicker", "title", "cta"] },
    ],
    demo: demo("A marca começa antes da primeira frase.", "Edição 01 · Direção de marca", "Uma sequência feita para ser lida sem pressa — e lembrada depois. Clareza nasce quando cada página cumpre uma função.", "Continuar", "/demo/brand-editorial-studio-v1.png"),
  },
  { id: "pergunta-direta", name: "Pergunta direta", category: "Conversão", formats: ["square", "portrait", "vertical", "story"], pages: "both", description: "Uma pergunta em primeiro plano, com CTA de leitura imediata.", fields: ["Título", "Subtítulo", "CTA"], style: "prompt", pageBlueprint: ["prompt"], demo: demo("Sua marca está sendo entendida em poucos segundos?", "Ponto de partida", "", "Ver a resposta") },
  { id: "legenda-fotografica", name: "Legenda fotográfica", category: "Imagem", formats: ["square", "portrait", "vertical", "story"], pages: "both", description: "Imagem integral, identificação compacta e legenda de alto contraste.", fields: ["Imagem", "Título", "Texto", "CTA"], style: "photo-caption", pageBlueprint: ["photo-caption"], demo: demo("O detalhe muda a percepção.", "Direção de arte", "Fotografia com presença, texto curto e uma hierarquia que respeita a imagem.", "Conhecer", photo.portrait) },
  { id: "poster-tipografico", name: "Pôster tipográfico", category: "Impacto", formats: ["square", "portrait", "vertical"], pages: "single", description: "Tipografia em escala para uma ideia que precisa ser vista primeiro.", fields: ["Título", "Subtítulo", "CTA"], style: "poster", pageBlueprint: ["poster"], demo: demo("CLAREZA É UMA FORMA DE PRESENÇA.", "Para ler devagar", "", "Guardar ideia") },
  { id: "narrativa-noturna", name: "Narrativa noturna", category: "Narrativa", formats: ["portrait", "vertical", "story"], pages: "multiple", description: "Ritmo de capa, contexto, pergunta, impacto e encerramento.", fields: ["Imagem", "Título", "Subtítulo", "Texto", "CTA"], style: "photo-caption", pageBlueprint: ["photo-caption", "dark-copy", "prompt", "poster", "closing"], demo: demo("Nem toda mensagem precisa gritar.", "Uma narrativa em cinco atos", "A estrutura alterna silêncio, informação e contraste para sustentar uma ideia.", "Ver sequência", photo.architecture) },
  { id: "retrato-autoridade", name: "Retrato de autoridade", category: "Autoridade", formats: ["square", "portrait", "vertical", "story"], pages: "both", description: "Um rosto, uma perspectiva e contexto sem competir com a fotografia.", fields: ["Imagem", "Título", "Subtítulo", "Texto", "CTA"], style: "photo-caption", pageBlueprint: ["photo-caption", "minimal-copy", "closing"], demo: demo("A confiança começa antes da primeira frase.", "Ponto de vista", "O retrato abre espaço para uma leitura direta, com informação na medida.", "Ler mais", photo.studio) },
  { id: "prova-editorial", name: "Prova editorial", category: "Estratégia", formats: ["square", "portrait", "vertical"], pages: "multiple", description: "Uma sequência para evidência, argumento, destaque e decisão.", fields: ["Título", "Subtítulo", "Texto", "CTA"], style: "minimal-copy", pageBlueprint: ["minimal-copy", "prompt", "dark-copy", "poster", "closing"], demo: demo("O que torna uma peça memorável?", "Uma leitura prática", "Contraste, uma ideia por tela e uma hierarquia que não pede esforço ao olhar.", "Aplicar agora") },
  { id: "produto-em-cena", name: "Produto em cena", category: "Campanha", formats: ["square", "portrait", "vertical", "story"], pages: "both", description: "Produto protagonista, legenda inferior e argumento de campanha.", fields: ["Imagem", "Título", "Texto", "CTA"], style: "photo-caption", pageBlueprint: ["photo-caption", "prompt", "closing"], demo: demo("Uma pausa que fica na memória.", "Edição limitada", "A imagem sustenta o desejo; o texto só precisa dar o próximo passo.", "Experimentar", photo.product) },
  { id: "fechamento-cta", name: "Fechamento CTA", category: "Fechamento", formats: ["square", "portrait", "vertical", "story"], pages: "single", description: "Fechamento limpo para transformar atenção em próximo passo.", fields: ["Título", "Subtítulo", "CTA"], style: "closing", pageBlueprint: ["closing"], demo: demo("Agora transforme a ideia em movimento.", "Próximo passo", "", "Falar com a gente") },
];

export const seedBrands: BrandProfile[] = [
  { id: "aurora", name: "Aurora Studio", initials: "AS", colors: ["#F04B3E", "#A9DCE8"], fonts: "Geist + Instrument Serif", slogan: "Clareza para marcas em movimento.", voice: "Direto, acolhedor e preciso.", guidelines: "Priorizar espaço, contraste e mensagens com uma ideia por vez.", assets: "Logo principal, símbolo e banco de imagens" },
  { id: "nativa", name: "Nativa Café", initials: "NC", colors: ["#4B352B", "#D9A85B"], fonts: "Geist + Geist Mono", slogan: "Pausa boa, café honesto.", voice: "Quente, simples e sensorial.", guidelines: "Usar fotografia tátil e tons terrosos com bastante respiro.", assets: "Logo, selo e fotografias de produto" },
];

export const emptyContent: Content = { brief: "", title: "Uma mensagem que merece atenção", subtitle: "Uma linha de contexto para tornar a ideia mais clara.", body: "Desenvolva sua mensagem de forma simples, com uma ideia por criação.", cta: "Saiba mais" };

export function templatePreviewCreation(template: Template): Creation {
  const content: Content = { brief: "", ...template.demo, composition: template.style, pageRole: template.pagePlan?.[0]?.role, ...(template.id === "minimal-editorial" ? { coverVariant: "editorial" as const } : {}) };
  return { id: `template-preview-${template.id}`, name: template.name, brandId: "aurora", templateId: template.id, format: "portrait", dimensions: { width: 1080, height: 1350 }, content, pages: [content], createdAt: "2026-09-21T00:00:00.000Z", expiresAt: "2026-10-21T00:00:00.000Z" };
}
