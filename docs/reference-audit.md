# Auditoria de referências externas — Prisma Engine

Data da auditoria: 21 de setembro de 2026.

Esta auditoria serve para orientar decisões de engenharia. O Brand & Product
System do Prisma continua sendo a fonte de verdade de produto, interface e
identidade. Nenhum logotipo, template, copy, screenshot, imagem ou interface
de terceiros foi incorporado.

## Repositórios inspecionados

| Repositório | Licença confirmada | Código inspecionado | Decisão para o Prisma |
| --- | --- | --- | --- |
| `TonyciencIA/claude-carruseles` | MIT, 2026 Open Carrusel Contributors | `slide-html.ts`, `export-slides.ts`, `carousels.ts` | Adotar o princípio de um contrato de render único e espera de fontes/imagens. Não copiar editor, chat, código, templates ou assets. |
| `Hainrixz/open-carrusel` | MIT, 2026 Open Carrusel Contributors | renderer, dados, prompts e exportação | Referência arquitetural complementar. Rejeitar o editor livre, reorder e chat como fluxo central. |
| `wasimjalali/swipekit` | MIT, 2026 Wasim Jalali | tipos, prompt estruturado e exportação | Adotar o princípio de conteúdo tipado por página, safe zones e pipeline linear. Não copiar layout, temas ou código. |
| `ahoydig/carrossel-instagram` | MIT, 2026 | `SKILL.md` e referências de templates | Adotar gates de conteúdo e a regra de variedade entre páginas. Não importar paletas, templates, copy ou efeitos. |
| `crealwork/carousel-cards` | MIT, 2026 crealwork | CSS de componentes e guia de PNG | Adotar validação de overflow, espera de fontes/imagens e exportação no tamanho final. Não copiar CSS ou layouts. |

## Decisões de incorporação

O Prisma Engine é único e segue:

```text
briefing / texto / imagem
  → content engine estruturado
  → marca + template + formato
  → renderer HTML/CSS determinístico
  → mesmo DOM no preview e na exportação PNG
  → inspeção de overflow antes de baixar
```

O renderer é deliberadamente controlado por template. Ele não aceita HTML ou
CSS gerado pelo usuário/IA, nem drag-and-drop, layers, handles ou canvas livre.
Isso preserva o escopo oficial do Prisma.

## Implementação atual

- `app/prisma-engine.ts`: normalização de conteúdo, composição de páginas e
  validação de excesso de conteúdo.
- `app/CardRenderer.tsx`: DOM determinístico, compartilhado por preview,
  miniaturas e exportação.
- `app/card-export.ts`: aguarda fontes/imagens e transforma esse DOM em PNG;
  o ZIP em lote está preparado para o próximo passo de interface.

## Limites e próximos passos técnicos

O exportador atual roda no navegador com `html-to-image`, para manter o preview
e PNG no mesmo DOM sem exigir Chromium no runtime Vercel. Para exportação
assíncrona server-side em escala, o próximo passo é uma função de fila com
Chromium compatível com Vercel, validação dos bytes finais e storage de saída.
Essa mudança não deve criar um renderer paralelo: deve consumir o mesmo contrato
de página e tokens do Prisma Engine.
