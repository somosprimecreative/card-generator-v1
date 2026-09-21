# Catálogo de referência visual para templates Prisma

## Escopo e método

Este catálogo registra a análise visual do arquivo de referência `Templates CarrosseIA.zip`, inspecionado integralmente em 21 de setembro de 2026. O ZIP contém 49 imagens JPEG, todas em 1080 × 1350 px (4:5), além de arquivos de metadados do macOS.

As imagens foram usadas somente para estudar hierarquia, ritmo, recorte, contraste e sequência editorial. Nenhuma imagem, marca, arquivo, código ou asset do ZIP foi copiado para este repositório ou para o produto Prisma.

## Constatações recorrentes

- O sistema é editorial e deliberadamente contido: poucas decisões por página e uma ideia dominante.
- Há duas linguagens recorrentes: papel/minimalismo tipográfico e fotografia integral com legenda escura.
- O rodapé compacto organiza paginação, identificação e ritmo; não há widgets ou decoração genérica.
- Tipos muito grandes aparecem em capas e perguntas; páginas de apoio usam leitura curta e alinhamento firme.
- A fotografia recebe crop forte e texto em painel escuro para manter contraste previsível.
- Sequências alternam capa, contexto, pergunta, impacto e fechamento em vez de repetir o mesmo layout.

## Catálogo observável do ZIP

| Arquivos de referência | Estrutura observada | Papel na sequência | Template Prisma equivalente |
| --- | --- | --- | --- |
| `Unknown.jpeg`–`Unknown-3.jpeg` | Fundo claro, texto editorial, avatar/identificação compacta, paginação mínima | Capa e páginas de leitura | Editorial mínimo |
| `Unknown-4.jpeg`–`Unknown-10.jpeg` | Foto escura, páginas pretas de contexto/pergunta e pôsteres cromáticos | Narrativa de contraste | Narrativa noturna |
| `Unknown-11.jpeg`–`Unknown-20.jpeg` | Intercalação entre papel, pergunta colorida e foto com legenda | Carrossel de argumento | Editorial mínimo e Pergunta direta |
| `Unknown-21.jpeg`–`Unknown-30.jpeg` | Perguntas em cor, imagens de pessoas/produtos com painel inferior | Conteúdo e campanha | Pergunta direta, Legenda fotográfica e Produto em cena |
| `Unknown-31.jpeg`–`Unknown-40.jpeg` | Páginas brancas informativas, pôsteres cromáticos e fotografia | Explicação + chamada | Prova editorial e Pôster tipográfico |
| `Unknown-41.jpeg`–`Unknown-49.jpeg` | Fotografia temática, página de conteúdo e CTA cromático | Fechamento de série | Retrato de autoridade e Fechamento CTA |

## Biblioteca implementada

Cada item abaixo tem um renderer próprio e, quando é sequência, um `pageBlueprint` com composições distintas. As miniaturas da galeria usam esse mesmo renderer, com conteúdo demonstrativo e fotografia licenciável de demonstração; não são wireframes.

| Template | Composição | Variações/páginas |
| --- | --- | --- |
| Editorial mínimo | papel, título editorial e rodapé de paginação | capa, leitura, pergunta, leitura, fechamento |
| Pergunta direta | fundo cromático, pergunta dominante e CTA | card ou página de sequência |
| Legenda fotográfica | imagem integral, tag e painel de legenda | card ou página de sequência |
| Pôster tipográfico | tipografia em escala e regra editorial | card de impacto |
| Narrativa noturna | fotografia, contexto escuro, pergunta, pôster e CTA | sequência de 5 páginas |
| Retrato de autoridade | retrato com legenda, leitura e CTA | card ou sequência curta |
| Prova editorial | leitura, pergunta, contexto escuro, pôster e decisão | sequência de 5 páginas |
| Produto em cena | foto de produto, pergunta e fechamento | card ou sequência curta |
| Fechamento CTA | chamada final de alto contraste | card de encerramento |

## Regras técnicas derivadas

1. Thumbnail, preview, resultado e exportação utilizam o mesmo `CardRenderer`.
2. Composição pertence ao template e à página; não existem controles de arrastar, camadas ou posição manual.
3. Textos longos recebem redução de escala por densidade e validação de limites antes da geração.
4. Fotografias usam `object-fit: cover`, `object-position` editável e painel/overlay de contraste para o layout fotográfico.
5. O resultado do card usa a paleta da marca escolhida; a paleta Prisma é reservada à interface do produto.
