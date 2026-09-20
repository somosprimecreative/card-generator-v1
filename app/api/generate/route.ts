import { generateObject } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";

const requestSchema = z.object({
  topic: z.string().trim().min(8).max(1_500),
  audience: z.string().trim().max(180).optional(),
  slideCount: z.number().int().min(3).max(10).default(6),
  template: z.string().trim().max(60).optional(),
});

const carouselSchema = z.object({
  slides: z.array(z.object({
    kicker: z.string().max(48),
    title: z.string().max(120),
    text: z.string().max(180),
  })).min(3).max(10),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Informe um tema com pelo menos 8 caracteres." }, { status: 400 });
  }

  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json({
      error: "A geração com IA ainda não foi configurada. Adicione AI_GATEWAY_API_KEY nas variáveis da Vercel para habilitá-la.",
    }, { status: 503 });
  }

  const { topic, audience, slideCount, template } = parsed.data;

  try {
    const { object } = await generateObject({
      model: gateway("anthropic/claude-sonnet-4.6"),
      schema: carouselSchema,
      system: "Você é estrategista de conteúdo e redator brasileiro. Escreva carrosséis claros, originais, úteis e prontos para design. Não invente fatos, estatísticas ou promessas. Evite jargão, hashtags e emojis. A primeira página deve ser uma capa forte; a última deve ser um CTA elegante. Cada título deve caber confortavelmente em até três linhas.",
      prompt: `Crie exatamente ${slideCount} páginas para um carrossel em português do Brasil. Tema: ${topic}. Público: ${audience || "pessoas interessadas no tema"}. Direção visual: ${template || "editorial"}. Retorne uma narrativa progressiva com capa, desenvolvimento e CTA.`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("carousel_generation_failed", error);
    return Response.json({ error: "Não foi possível gerar o roteiro agora. Tente novamente em alguns instantes." }, { status: 502 });
  }
}
