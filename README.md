# Prisma · Prime Creative

Prisma é um produto de geração criativa: transforma contexto de marca,
formato, template e conteúdo em uma criação pronta. Não é um editor gráfico
livre. Um card individual e um carrossel são a mesma entidade, com uma ou mais
páginas.

## Arquitetura atual

- **Início**: atalho para gerar, criações recentes, templates e marcas.
- **Gerar**: fluxo Marca → Formato → Template → Conteúdo → Resultado.
- **Criações**: histórico temporário com autosave local, download, duplicação,
  variações e exclusão individual ou em lote.
- **Templates**: estruturas visuais compatíveis com formato e quantidade de
  páginas; não abrem editor livre.
- **Marcas**: contexto visual e verbal reutilizável para a geração.
- **Configurações**: tema, retenção e o ponto de integração do Google Drive.

O Brand & Product System está em
[`docs/prisma-brand-product-system.md`](./docs/prisma-brand-product-system.md).
Ele e os assets oficiais em `public/brand/prisma/` são a fonte de verdade para
qualquer alteração de produto ou identidade.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Para habilitar interpretação de briefing por IA fora da Vercel, copie
`.env.example` para `.env.local` e informe `AI_GATEWAY_API_KEY`. Sem essa
credencial, o fluxo continua funcional com conteúdo estruturado preenchido pelo
usuário; a interpretação automática de briefing informa que está indisponível.

## Publicação na Vercel

Importe este repositório na equipe **Prime Creative** na Vercel e inclua a
variável de ambiente `AI_GATEWAY_API_KEY` (caso o projeto não use OIDC). O
framework é detectado automaticamente como Next.js.

## Limites desta base

Autenticação, persistência compartilhada, storage de arquivos, Google Drive
OAuth e limpeza programada ainda dependem de serviços e credenciais externos.
Enquanto eles não forem configurados, as criações e a retenção funcionam no
armazenamento local do navegador, por dispositivo.
