# Pixel · Brand & Product System

## Fonte de verdade

Este repositório implementa **Pixel by Prime Creative**, uma ferramenta de geração de cards e carrosséis orientada por marca, formato, template e conteúdo. Os arquivos em `public/brand/pixel/` são os assets finais e oficiais da marca; use-os diretamente, sem redesenhar, recolorir, rasterizar ou reconstruir símbolos, wordmarks, assinaturas ou app icons.

## Produto

Pixel reduz decisões de composição: a pessoa escolhe uma marca (ou segue sem marca), define formato e template, informa o conteúdo e recebe uma criação pronta. Um card e um carrossel são a mesma criação, com uma ou mais páginas. O produto não é um canvas, editor livre, biblioteca de arquivos ou ferramenta de posicionamento manual.

O fluxo funcional é: **Marca → Formato → Template → Conteúdo → Gerar → Resultado**. Templates são estruturas reutilizáveis; conteúdos podem ser editados e o template recompõe o resultado sem drag, layers, handles ou resize manual.

## Identidade da interface

| Token | Valor | Uso |
| --- | --- | --- |
| Vermilion | `#F04B3E` | ação e produção |
| Ice Blue | `#A9DCE8` | destaque editorial |
| Light background | `#F1F0EB` | fundo principal claro |
| Light surface | `#FFFFFF` | superfície clara |
| Dark background | `#121212` | fundo principal escuro |
| Dark surface | `#1B1B1B` | superfície escura |

Vermilion representa ação e produção. Ice Blue é um acento editorial. Neutros devem dominar superfícies, leitura e áreas de trabalho. Os estados semânticos de sucesso, erro e aviso permanecem distintos das cores de marca.

Light e dark possuem tokens próprios; dark não é uma inversão automática.

## Assets oficiais

Os 30 SVGs oficiais são preservados em famílias sem modificação:

- `symbol/`: símbolo para aplicações compactas;
- `app-icon/`: ícones de instalação e superfícies de sistema;
- `wordmark/`: identificação principal quando há espaço;
- `signature/`: lockups e assinaturas oficiais, incluindo variantes cromáticas.

Escolha a variante oficial adequada para contraste. Se uma aplicação exigir uma variante inexistente, solicite o asset; não crie uma nova versão da marca.

## Limites técnicos atuais

O histórico e a retenção rodam no armazenamento local do navegador. Google Drive, autenticação, persistência compartilhada e exportação server-side dependem de credenciais e infraestrutura externas; não fazem parte desta base local.
