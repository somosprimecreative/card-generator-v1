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

export type Template = {
  id: string;
  name: string;
  category: string;
  formats: Exclude<FormatId, "custom">[];
  pages: "single" | "multiple" | "both";
  description: string;
  fields: string[];
  style: "statement" | "editorial" | "image";
};

export type Content = {
  brief: string;
  title: string;
  subtitle: string;
  body: string;
  cta: string;
  imageName?: string;
  imageData?: string;
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

export const templates: Template[] = [
  {
    id: "message",
    name: "Mensagem central",
    category: "Institucional",
    formats: ["square", "portrait", "vertical", "story"],
    pages: "both",
    description: "Uma ideia principal com leitura imediata e CTA discreto.",
    fields: ["Título", "Texto", "CTA"],
    style: "statement",
  },
  {
    id: "sequence",
    name: "Sequência editorial",
    category: "Conteúdo",
    formats: ["square", "portrait", "vertical"],
    pages: "multiple",
    description: "Estrutura progressiva para explicar uma ideia em várias páginas.",
    fields: ["Título", "Subtítulo", "Texto", "CTA"],
    style: "editorial",
  },
  {
    id: "visual",
    name: "Imagem em foco",
    category: "Campanha",
    formats: ["square", "portrait", "vertical", "story"],
    pages: "both",
    description: "Imagem como protagonista, combinada a uma mensagem curta.",
    fields: ["Imagem", "Título", "Subtítulo", "CTA"],
    style: "image",
  },
];

export const seedBrands: BrandProfile[] = [
  {
    id: "aurora",
    name: "Aurora Studio",
    initials: "AS",
    colors: ["#2647D7", "#F1DC9A"],
    fonts: "Geist + Instrument Serif",
    slogan: "Clareza para marcas em movimento.",
    voice: "Direto, acolhedor e preciso.",
    guidelines: "Priorizar espaço, contraste e mensagens com uma ideia por vez.",
    assets: "Logo principal, símbolo e banco de imagens",
  },
  {
    id: "nativa",
    name: "Nativa Café",
    initials: "NC",
    colors: ["#4B352B", "#D9A85B"],
    fonts: "Geist + Geist Mono",
    slogan: "Pausa boa, café honesto.",
    voice: "Quente, simples e sensorial.",
    guidelines: "Usar fotografia tátil e tons terrosos com bastante respiro.",
    assets: "Logo, selo e fotografias de produto",
  },
];

export const emptyContent: Content = {
  brief: "",
  title: "Uma mensagem que merece atenção",
  subtitle: "Uma linha de contexto para tornar a ideia mais clara.",
  body: "Desenvolva sua mensagem de forma simples, com uma ideia por criação.",
  cta: "Saiba mais",
};
