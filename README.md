# Prime Creative Generator

Ferramenta para criar cards e carrosséis com identidade visual própria, pronta para publicação em redes sociais.

## Recursos atuais

- Roteiro estruturado com Claude, via Vercel AI Gateway
- Edição de texto por página, cores, fonte, logo e imagem
- Templates editoriais próprios
- Formatos 1:1, 3:4 e 9:16
- Saída em 1080p, 2K, 4K ou dimensão personalizada
- Exportação dos cards em PNG ou JPG
- Tema claro em cinza suave e tema noturno em grafite

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Para habilitar a geração por IA fora da Vercel, copie `.env.example` para `.env.local` e informe `AI_GATEWAY_API_KEY`.

## Publicação na Vercel

Importe este repositório na equipe **Prime Creative** na Vercel e inclua a variável de ambiente `AI_GATEWAY_API_KEY` (caso o projeto não use OIDC). O framework é detectado automaticamente como Next.js.

> A tela de login e a biblioteca de projetos já estão desenhadas. Antes de abrir o produto ao público, conecte um provedor de autenticação e um banco de dados/armazenamento para cumprir a retenção configurável de 30 dias.
