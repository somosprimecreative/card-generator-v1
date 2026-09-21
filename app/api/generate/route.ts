import { generateObject } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";

const requestSchema = z.object({
  topic: z.string().trim().min(8).max(1_500),
  audience: z.string().trim().max(180).optional(),
  slideCount: z.number().int().min(1).max(10).default(1),
  template: z.string().trim().max(60).optional(),
});

const carouselSchema = z.object({
  slides: z.array(z.object({
    kicker: z.string().max(48),
    title: z.string().max(120),
    text: z.string().max(180),
    cta: z.string().max(36),
  })).min(1).max(10),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Informe um tema com pelo menos 8 caracteres." }, { status: 400 });
  }

  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json({
      error: "A interpretação de briefing por IA ainda não foi configurada. Adicione AI_GATEWAY_API_KEY nas variáveis da Vercel para habilitá-la.",
    }, { status: 503 });
  }

  const { topic, audience, slideCount, template } = parsed.data;

  try {
    const { object } = await generateObject({
      model: gateway("anthropic/claude-sonnet-4.6"),
      schema: carouselSchema,
      system: "Você é estrategista de conteúdo e redator brasileiro para o Prisma, um gerador de cards baseado em templates. Retorne conteúdo estruturado, não instruções de layout. Escreva em português do Brasil, com clareza, densidade informativa e leitura rápida. Não invente fatos, estatísticas ou promessas. Evite hashtags, emojis e frases genéricas. Título: no máximo 12 palavras. Texto: no máximo 34 palavras. CTA: no máximo 5 palavras. Para múltiplas páginas, entregue uma narrativa progressiva: capa, desenvolvimento e fechamento.",
      prompt: `Crie exatamente ${slideCount} ${slideCount === 1 ? "peça" : "páginas"}. Briefing: ${topic}. Contexto de marca/público: ${audience || "pessoas interessadas no tema"}. Template selecionado: ${template || "Mensagem central"}. Cada item deve conter kicker, title, text e cta.`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("carousel_generation_failed", error);
    return Response.json({ error: "Não foi possível gerar o roteiro agora. Tente novamente em alguns instantes." }, { status: 502 });
  }
}
