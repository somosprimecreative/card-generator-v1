# Prisma · matriz de qualidade do engine

Esta matriz orienta a evolução do engine antes de integrações, autenticação ou persistência compartilhada. O foco é a peça pronta: legibilidade, hierarquia, variedade e exportação.

## Cenários essenciais

| Cenário | O que pressionar | Resultado esperado |
| --- | --- | --- |
| Mensagem curta | título de até 35 caracteres | leitura imediata, espaço dominante e CTA discreto |
| Título longo | 80–104 caracteres | redução tipográfica sem corte, colisão ou perda de hierarquia |
| Corpo denso | até 420 caracteres | conteúdo distribuído em sequência quando o template for multipágina |
| Marca quente | paleta terrosa e contraste reduzido | cor da marca sem comprometer legibilidade |
| Marca fria | azul de alto contraste | cor aplicada sem transformar a peça na UI do Prisma |
| Fotografia horizontal | crop em 1:1, 4:5 e 9:16 | foco preservado com `object-fit: cover` e recorte intencional |
| Fotografia vertical | imagem em foco e imagem/argumento | assunto reconhecível e texto separado da imagem |
| Carrossel | capa, desenvolvimento e fechamento | páginas relacionadas, mas não repetidas visualmente |
| Exportação | PNG, JPG e ZIP | nomes previsíveis, uma imagem por página e nenhum elemento fora do quadro |

## Bateria inicial implementada

- Nove estruturas: Mensagem central, Sequência editorial, Imagem em foco, Citação em foco, Dado em foco, Imagem e argumento, Guia em passos, Lista essencial e Antes e depois.
- Autoajuste em três densidades de texto e limites de conteúdo para evitar composições ilegíveis.
- Preparação local de imagens: aceita até 12 MB, preserva PNG quando necessário e reduz imagens grandes para uma borda máxima de 2200 px antes do render.
- Carrosséis com três páginas sem repetir a mesma função em cada página: capa, desenvolvimento e fechamento.
- Validação no browser da geração, navegação entre páginas, temas claro/noturno, tela móvel e ZIP multipágina.

## Critério de bloqueio

Não considerar uma variação pronta quando ocorrer qualquer um destes casos:

- texto fora do frame;
- contraste insuficiente entre texto e fundo/forma;
- imagem sem papel visual claro;
- páginas de carrossel visualmente repetidas;
- exportação diferente do preview final;
- composição que exija posicionamento manual para ser corrigida.
