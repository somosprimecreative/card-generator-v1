PRISMA
Brand and Product System v1.0



Documento oficial de referência para a identidade, interface, produto e experiência do Prisma. Consolida exclusivamente as decisões finais aprovadas para a primeira versão do sistema.
Prime Creative  •  Setembro de 2026

Prisma é o produto da Prime Creative que transforma conteúdo e identidade de marca em cards prontos, por meio de templates. Não é um editor visual livre.
Como usar este documento
Este é o ponto único de referência para decisões de marca e produto do Prisma. Ele orienta produto, design, conteúdo, engenharia e qualquer parceiro que crie ou implemente a experiência.
Parte
O que define
Brand System
Identidade, arquitetura de marca, cor, expressão visual e usos do símbolo.
Product System
Princípios do produto, interface, componentes e comportamento visual do Prisma.
Prime Product Foundations
Padrões compartilháveis com Órbita e futuros produtos da Prime.
Arquitetura funcional
Módulos, navegação, fluxo de geração e regras de cada área.
Regras de UX
Decisões de experiência que preservam foco, previsibilidade e controle.

Decisão central
Prisma é um gerador de cards orientado por templates e por identidade de marca. A pessoa escolhe o contexto, fornece o conteúdo e revisa o resultado; o sistema resolve a composição. O produto não deve evoluir para um canvas ou editor visual livre, como Canva ou Figma.
Fora de escopo
Projetos como unidade de trabalho, área de trabalho persistente ou fluxo de salvar projeto.
Biblioteca como módulo independente de navegação para ativos genéricos.
Canvas livre, drag and drop de elementos, bounding boxes, handles, toolbar de objetos ou ajuste manual de layout.
Uma lixeira com retenção adicional após uma exclusão confirmada.
Brand System
A marca Prisma combina precisão digital e expressão criativa. O território de prisma não é literal: aparece como intersecção, passagem, transformação, luz e contraste. O resultado deve parecer um produto próprio da Prime, com parentesco estrutural ao Órbita sem reproduzir sua aparência.
Arquitetura de marca
Elemento
Definição
Uso
Símbolo
Forma proprietária derivada do S do wordmark. Sugere planos que se atravessam, refração e transformação.
Favicon, avatar, loading, marca d’água e aplicações compactas.
App icon
Símbolo dentro de um container de cantos arredondados. Não substitui o símbolo oficial.
Ícone de produto, PWA e superfícies de sistema.
Wordmark
PRISMA em lettering proprietário. O S é o principal gesto distintivo do nome.
Identificação principal em aplicações com espaço suficiente.
Assinatura completa
Símbolo + wordmark Prisma + assinatura oficial da Prime.
Aplicações institucionais e de endosso do ecossistema.
Wordmark assinado
Wordmark Prisma + assinatura oficial da Prime, sem o símbolo quando ele for redundante.
Composições compactas ou contextos editoriais.

A assinatura da Prime é fixa no ecossistema. Prisma segue a mesma lógica de Órbita: o produto muda, o endosso Prime não. Não redesenhar, substituir ou reinterpretar a assinatura por produto; manter proporção, posição, área de respiro e relação hierárquica definidos pela Prime.
Uso e redução
O símbolo aprovado funciona sem versão micro específica. Não criar uma versão responsiva enquanto não houver uma falha real de leitura.
Manter tamanho mínimo de aplicação baseado nos testes reais de 16 px, 24 px e 32 px. A silhueta e o negativo central precisam permanecer legíveis.
O container arredondado pertence ao app icon; não deve ser incorporado ao símbolo em usos comuns.
Evitar ilustrações genéricas de prisma ou arco-íris. A metáfora deve permanecer abstrata e proprietária.
Paleta principal
Token
Hex
Papel
Prisma Blue
#2650F6
Cor proprietária para ações humanas, seleção, elementos ativos, CTAs e progresso determinístico.
Prisma Butter
#F3E19C
Acento de destaque para o que o Prisma faz: geração, automação, IA, superfícies especiais e contraste no dark.

Blue e Butter têm contraste proposital e podem coexistir em momentos de coautoria entre pessoa e produto. Não é necessário usar as duas em todos os componentes; neutros sustentam áreas de trabalho e leitura longa.
Regra cromática
Blue
Butter
Neutros e semântica
Ação humana: clicar, escolher, selecionar, editar, confirmar, avançar, foco e estados ativos.
Ação do Prisma: gerar, sugerir, automatizar, processar, informar uma capacidade generativa e destacar uma etapa especial.
Neutros sustentam a interface. Sucesso é verde, erro e ação destrutiva são vermelhos, warning é laranja. Branding não substitui significado semântico.

A regra deve aparecer no produto inteiro: Blue = ação humana; Butter = ação do Prisma. Quando ambos colaboram, Blue e Butter podem se intersectar, como no loading de geração.
Modos de cor
Light mode
O light mode não utiliza branco puro como fundo principal. A base levemente quente reduz o desconforto visual e deixa o Prisma Blue mais preciso, sem transformar a interface em uma aplicação azul e branca genérica.
Token
Valor
Aplicação
Background light
#EDECE6
Fundo principal da aplicação.
Surface light
#F7F6F1
Cards, inputs, menus e superfícies de leitura.
Secondary surface
#D9D6CC
Divisões, superfícies secundárias e contraste contido.
Text primary
#0F1115
Texto principal e ícones de alta ênfase.
Text muted
#5B5F66
Metadados, legendas e informação secundária.
Primary
#2650F6
CTA, seleção, foco e estado ativo.
Accent
#F3E19C
Destaques, geração, superfícies editoriais e sinais do Prisma.

Dark mode
Dark não é preto puro. Neutros de base levemente azulados mantêm continuidade com Prisma Blue, criam profundidade por superfície e borda e reduzem a necessidade de sombras.
Token
Valor
Aplicação
Background dark
#0E1116
Fundo principal.
Surface dark
#1B2129
Cards, inputs, painéis e menus.
Elevated and border
#2A313D
Bordas, elevação sutil e superfícies de segundo nível.
Text primary
#E6E8EB
Texto principal e ícones de alta ênfase.
Primary
#2650F6
Seleção, foco, progresso e ação humana.
Accent and primary CTA
#F3E19C
Ação principal em dark e momentos especiais do Prisma.

A manifestação do CTA principal muda com o ambiente: no light, botão principal Prisma Blue com texto claro; no dark, Prisma Butter com texto #0E1116. A semântica de ação humana continua coerente pela hierarquia, pelo contexto e pelos estados de interação.
Expressão gráfica e motion
O símbolo e seus planos podem sugerir intersecção, atravessamento e transformação em momentos de marca, especialmente loading e geração.
Blue + Butter são expressivos durante geração. Em superfícies de trabalho, a interface permanece predominantemente neutra.
Evitar gradientes permanentes, efeitos de arco-íris ou expressão cromática decorativa. O comportamento é mais importante que o ornamento.
A peça criada não recebe identidade visual do Prisma por padrão. Templates e conteúdo podem pertencer a qualquer marca; a identidade do produto fica na interface ao redor.
Brand Assets
Os arquivos abaixo são os Brand Assets oficiais do Prisma. Eles complementam a arquitetura de marca desta documentação e devem ser usados como fornecidos, sem redesenho, substituição tipográfica ou aproximação visual.
Símbolo

Favicon, avatar, loading e aplicações compactas.
App icon

PWA, instalação, favicon e superfícies de sistema.
Wordmark

Identificação principal quando houver área de respiro.
Assinatura horizontal

Símbolo + wordmark para navegação e cabeçalhos.
Assinatura completa

Símbolo + wordmark + endosso Prime em uso institucional.
Wordmark assinado

Wordmark + endosso Prime em composição editorial compacta.
Conjunto oficial e versões
O pacote contém as famílias oficiais: símbolo (Assets 1–5), wordmark assinado (Assets 6–10), assinatura completa (Assets 11–15), wordmark (Assets 16–20), assinatura horizontal símbolo + wordmark (Assets 21–25) e app icon (Assets 26–30). Cada família inclui as variações cromáticas fornecidas para fundos claros, fundos escuros e aplicações Blue ou Butter.
Na implementação, utilizar exclusivamente os SVG fornecidos no ZIP; PNG, PDF, EPS e JPG são formatos oficiais de apoio e exportação.
Escolher a versão positiva ou negativa de acordo com o contraste do fundo. Não recolorir, esticar, recortar, desmontar ou reconstruir qualquer asset.
Testar leitura do símbolo em 16 px, 24 px e 32 px. Quando um lockup ou endosso não for legível, aplicar uma versão oficial mais adequada ou não usar aquele lockup.
O container arredondado é exclusivo do app icon. Não adicioná-lo ao símbolo em usos comuns.
Fonte de verdade para implementação: Prisma logo.zip. Nenhuma marca, ícone, assinatura ou variação deve ser recriada, reinterpretada ou substituída por texto, CSS, desenho vetorial novo ou asset genérico.
Product System
O Product System define como o Prisma se apresenta e se comporta como ferramenta de trabalho. A sensação deve ser rápida, calma e capaz: a pessoa chega com uma intenção, o Prisma reduz decisões de composição e entrega uma criação pronta para uso.
Princípios de produto
Princípio
Decisão prática
Geração, não edição
O sistema monta cards a partir de templates e conteúdo. A pessoa ajusta conteúdo, imagem, formato ou variação; não move elementos no layout.
Marca como contexto
A marca carregada informa logo, cores, tipografias, tom de voz, slogan, diretrizes e ativos. O resultado começa contextualizado.
Poucas decisões, em ordem
A sequência é Marca, Formato, Template, Conteúdo, Gerar e Resultado. Cada escolha prepara a próxima.
A peça é protagonista
No resultado, o preview tem prioridade visual; as ações são objetivas e secundárias à peça.
Histórico temporário e útil
Criações ficam disponíveis, mas não transformam o Prisma em arquivo permanente. Drive é o destino de armazenamento duradouro.

Tipografia
Geist é a tipografia de interface. O lettering do wordmark não é usado como fonte funcional. A interface deve ser contemporânea, legível e neutra o suficiente para deixar a identidade aparecer pela cor, imagem e comportamento.
Uso
Tamanho
Peso
Observação
Display
40 px
600
Destaques e momentos de baixa densidade.
H1
32 px
600
Títulos de página e decisões principais.
H2
24 px
600
Seções importantes.
H3
20 px
600
Subseções e agrupamentos.
Title
16 px
600
Títulos de cards e controles.
Body
14 px
400
Corpo padrão de produto.
Body small
13 px
400
Apoio e metadados densos.
Label
12 px
500
Rótulos, navegação e controles.
Caption
11 px
500
Informação auxiliar curta.

Pesos 800 e 900 são evitados na interface. Use 400 para corpo, 500 para labels e controles, 600 para títulos e CTAs e 700 apenas para números grandes ou headings especiais.
Spacing e radius
Foundation
Escala
Aplicação
Spacing
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px
8 para proximidade, 16 como padrão de componente, 24 em cards, 32 entre blocos e 48 ou mais entre seções.
Radius
8 / 10 / 12 / 16 / 20 / 999 px
8 em controles pequenos; 10 em inputs e botões; 12 em cards; 16 em modais e superfícies grandes; 20 em elementos especiais de marca; 999 apenas em pills, avatars e status.

Componentes e padrões visuais
Botões
Nível
Tratamento
Uso
Primary
Light: Prisma Blue com texto claro. Dark: Prisma Butter com texto #0E1116.
Ação principal da tela, como Gerar card ou confirmar uma etapa.
Secondary
Surface neutra, borda e texto principal.
Ações importantes, porém não dominantes.
Ghost
Sem superfície; hover discreto em neutro.
Ações contextuais e de baixa ênfase.
Destructive
Vermelho semântico, separado da paleta de branding.
Exclusões ou ações irreversíveis.

Alturas: compacto 32 px; padrão 40 px; grande 48 px. O botão não deve ser uma cápsula por padrão; usar radius 10 px.
Inputs, cards e ícones
Elemento
Regra
Inputs
Altura padrão 40 px. Light: surface + border neutral. Dark: #1B2129 + border #2A313D. Focus sempre Prisma Blue.
Cards e superfícies
Construir hierarquia com contraste de superfície, bordas suaves e spacing. Usar pouquíssima sombra; evitar a aparência de cards flutuando.
Content card
Preview dominante, dados essenciais abaixo e ações reveladas somente quando necessárias. Usado em criações e templates.
Action card
Convite para iniciar uma ação, como usar um template ou criar a primeira peça. Pode usar Blue ou Butter com moderação.
Empty state
Geometria do símbolo + mensagem direta + ação. Não usar ilustrações SaaS genéricas.
Ícones
Outline de 1,5 a 1,75 px; tamanhos 16, 20 e 24 px. Não misturar filled e outline sem propósito.

Estados e feedback
Estado
Cor e comportamento
Ativo e selecionado
Prisma Blue. Seleção consistente: outline Blue de 2 px e pequeno indicador ou check Blue.
Sucesso
Verde semântico. Confirma conclusão sem confundir com Blue ou Butter.
Erro e destrutivo
Vermelho semântico. Explica o problema e oferece uma recuperação quando houver.
Warning
Laranja semântico. Reservado para atenção que não é erro.
Loading funcional
Spinner simples em Prisma Blue para operações pequenas, como salvar ou atualizar.
Prisma loading
Intersecção animada de formas derivadas do símbolo em Blue + Butter para geração ou processamento relevante.
Skeleton
Superfícies neutras animadas. Dados carregando são infraestrutura, não momento de branding.

Menus, modais, sheets, toasts e tooltips
Padrão
Regra
Modal
Decisões curtas e objetivas, como confirmação de exclusão ou renomear.
Sheet lateral
Fluxos com mais informação, como detalhes de marca, histórico ou configuração avançada.
Menu e dropdown
Compacto e contextual: radius 10 px, padding interno 8 px, itens de cerca de 36 px. Selecionado usa check + Prisma Blue.
Toast
Canto inferior direito no desktop. Desaparece sozinho quando não exige ação; não substituir feedback breve por modal.
Tooltip
Escuro em ambos os modos. Mostra nome de ícone e, quando aplicável, atalho de teclado.

Microinterações
A interface é criativa, mas continua sendo uma ferramenta de trabalho. Hover: 120–160 ms. Dropdown: 160–200 ms. Sheet e modal: 200–240 ms. Mudança de painel: 160–200 ms. A geração pode ter movimentos mais lentos e expressivos. Evitar movimentos excessivamente flutuantes ou decorativos.
Prime Product Foundations
Prime Product Foundations é a camada que pode ser compartilhada por Prisma, Órbita e produtos futuros. Ela mantém o ecossistema reconhecível pela qualidade de interação e estrutura, sem remover a personalidade de cada produto.
Compartilhar entre produtos
Específico do Prisma
Geist para UI e hierarquia tipográfica funcional.
Prisma Blue e Prisma Butter, incluindo a regra Human Action e Prisma Action.
Grid de 4 px, escala de spacing e lógica de radius.
Loading de intersecção e linguagem de transformação.
Iconografia outline, acessibilidade e estados semânticos.
Fluxo de geração orientado por templates, formatos e contexto de marca.
Padrões de navegação, modais, sheets, dropdowns, tooltips, toasts e feedback.
Content cards de criação, templates, resultado e adaptação de formato.
Arquitetura limpa, pouca sombra, foco em superfícies, bordas e spacing.
Sinalização Blue para manipulação e Butter para geração/automação.
Assinatura Prime como elemento fixo de endosso do ecossistema.
Símbolo derivado do S e wordmark proprietário do Prisma.

Princípios de consistência
Produtos diferentes devem parecer irmãos pelo sistema, não cópias por cor ou logotipo.
A assinatura Prime é constante. A personalidade de cada produto aparece na marca, na paleta, no conteúdo e em comportamentos específicos.
Estados semânticos, acessibilidade, hierarquia de ação e padrões de feedback não devem ser reinventados por produto.
A interface prefere clareza, tipografia, espaço e superfícies a efeitos decorativos e excesso de componentes em destaque.
Arquitetura funcional
A navegação é deliberadamente curta. Uma função entra na navegação somente se houver motivo recorrente para a pessoa visitá-la. O restante pertence ao fluxo onde faz mais sentido.
Área
Responsabilidade
Conteúdo e ações
Início
Ajudar a retomar e iniciar trabalho.
Visão geral, criações recentes, atalhos, templates sugeridos, marcas disponíveis e CTA + Gerar.
Criações
Histórico temporário das peças produzidas.
Galeria com thumbnail, marca, template, formato e data. Filtros por formato, marca e data; baixar, gerar variação, salvar no Drive e excluir.
Templates
Disponibilizar estruturas visuais para geração.
Modelos organizados por formato, categoria e/ou marca. Não são telas para edição livre.
Marcas
Concentrar o contexto de identidade de cada marca.
Logo e variações, cores, tipografias, tom de voz, slogan, diretrizes, ativos e templates aprovados.
Configurações
Conta, preferências e integrações.
Conta e preferências; Integrações com Google Drive; Retenção de criações.
+ Gerar
Iniciar a ação principal do produto.
CTA em destaque, não uma área de navegação comum. Abre o fluxo guiado de geração.

Regra de assets
Não existe Biblioteca como módulo. Ativos de marca pertencem a Marcas. Imagens específicas entram por upload no fluxo de geração. Uploads recentes podem ser reaproveitados internamente sem ganhar uma área de gestão independente.
Fluxo principal
Marca → Formato → Template → Conteúdo → Gerar → Resultado
Etapa
Experiência aprovada
1. Marca
Pergunta: Para qual marca vamos criar? Cards compactos com logo e nome. A última usada pode aparecer primeiro, mas nunca é pré-selecionada. Ao escolher, o Prisma carrega logo, cores, tipografias, tom de voz, slogan, regras e informações cadastradas.
2. Formato
A pessoa escolhe proporção e dimensão antes do template, pois o formato determina compatibilidade. Cards visuais mostram proporção e pixels. A interface chama a etapa de Formato, não Resolução.
3. Template
Grid com previews reais. Prioridade visual, filtros simples e recomendações para a marca selecionada. Template é estrutura, não canvas editável.
4. Conteúdo
Entrada principal: O que você quer comunicar? Permite briefing livre, adicionar imagem, adicionar informações e usar texto pronto. Se o template pedir campos, o Prisma interpreta e preenche título, subtítulo, CTA e informação complementar para revisão.
5. Gerar
CTA Gerar card. O clique começa um loading proprietário Blue + Butter. Exibir mensagens reais quando disponíveis, como Interpretando conteúdo, Aplicando identidade da marca, Montando composição e Finalizando card. Não inventar percentuais para IA.
6. Resultado
Preview da peça em destaque. Ações diretas: Baixar, Gerar variação, Editar conteúdo, Trocar imagem e Adaptar formato; menu para ações secundárias, incluindo Salvar no Google Drive e Excluir.

Formatos
Os formatos são tratados como proporção e dimensão em pixels. Os nomes podem orientar, mas Prisma não os associa rigidamente a uma plataforma: um formato vertical pode servir a múltiplos contextos.
Formato
Dimensão
Orientação de interface
1:1
1080 × 1080 px
Quadrado
4:5
1080 × 1350 px
Retrato
3:4
1080 × 1440 px
Retrato alto
9:16
1080 × 1920 px
Vertical
Personalizado
Largura × altura em px
Campos para largura e altura, opção de manter proporção e limites técnicos para evitar dimensões impraticáveis.

O Prisma pode lembrar formatos personalizados recentes de forma discreta. Ao adaptar formato, não executar apenas resize: o template precisa ter comportamento responsivo ou variante compatível. Sem versão compatível, o sistema não promete uma adaptação ruim.
Resultado e iterações
Ação
Comportamento
Baixar
Exporta a criação para o dispositivo.
Gerar variação
Permite variar Layout, Texto, Imagem ou Tudo e aceitar uma orientação opcional. Não exige recomeçar o fluxo.
Editar conteúdo
Abre campos como título, subtítulo, CTA e informação complementar. Ao atualizar, o template recalcula a composição. A pessoa altera conteúdo, não layout.
Trocar imagem
Substitui ou regenera a imagem associada à peça sem abrir editor visual livre.
Adaptar formato
Cria uma versão em formato compatível quando existir comportamento ou variante adequada de template.
Autosave
Tudo é salvo automaticamente. Ao gerar, já entra em Criações; alterações atualizam automaticamente. Não existe botão Salvar projeto.

Carrosséis
Carrossel é uma única Criação com múltiplas páginas. O resultado apresenta navegação por páginas, por exemplo 01, 02, 03, 04 e 05. O conteúdo pode ser ajustado individualmente por página, mas o conjunto continua sendo uma só criação no histórico e para fins de retenção.
Google Drive e retenção
Integração com Google Drive
Google Drive é uma integração, não um módulo do Prisma. A configuração vive em Configurações → Integrações → Google Drive.
Capacidade
Regra
Conectar
A pessoa conecta a conta Google Drive em Configurações.
Salvar ou exportar
Uma criação pode ser enviada ao Drive diretamente do resultado ou das ações de Criações, sem download local obrigatório.
Pasta padrão
A pessoa pode escolher uma pasta padrão de destino.
Organização por marca
Pode ser oferecida como opção de organização; a estrutura de pastas é configurável.
Escopo inicial
Não transformar Prisma em navegador de arquivos do Drive na primeira versão.

Retenção de criações
Retenção é configurada em Configurações → Retenção de criações. A pessoa define por quanto tempo suas criações ficam armazenadas no Prisma.
Opção
Regra
15 dias
Exclusão automática 15 dias após a geração.
30 dias
Padrão. Exclusão automática 30 dias após a geração.
90 dias
Exclusão automática 90 dias após a geração.
Personalizado
A pessoa informa a quantidade de dias.

Cada criação mostra claramente a data prevista de exclusão, por exemplo: Será excluída em 18 out. 2026. Arquivos baixados ou salvos no Google Drive não são afetados pela retenção. Uma mudança de retenção vale para novas criações, para evitar que reduzir o prazo elimine silenciosamente um histórico existente.
Exclusão manual imediata
A exclusão manual é sempre disponível e definitiva. Ela é uma ferramenta natural de Criações, independente da retenção automática, para impedir que a plataforma acumule conteúdo que deixou de ser útil.
Contexto
Regra
Card em Criações
Menu de ações com Baixar, Gerar variação, Salvar no Drive e Excluir agora.
Visualização individual
Excluir disponível no menu de ações da criação.
Seleção múltipla
Permitir selecionar várias criações e excluir em lote.
Confirmação
Título: Excluir esta criação? Texto: Ela será removida do Prisma e não poderá ser recuperada. Arquivos já baixados ou salvos no Google Drive não serão afetados. Ações: Cancelar e Excluir.
Após confirmação
Remoção definitiva, sem lixeira e sem período adicional de recuperação.

Regras de UX
Regra
Aplicação
Preservar foco
Cada módulo existe por necessidade recorrente. Não criar áreas novas para funções que cabem em um fluxo existente.
Reduzir decisões
Escolhas seguem uma ordem que constrói contexto. Nunca pedir para escolher layout antes de saber formato ou marca.
Nunca confundir geração com edição
Ajustes são de conteúdo, imagem, variação e formato. Não oferecer manipulação manual de posição, tamanho, layer ou grid.
Dar controle sem excesso
Revisão do conteúdo antes de gerar; ações diretas no resultado; variações sem reiniciar; seleção explícita de marca, sem pré-seleção arriscada.
Mostrar consequências
Retenção exibe a data prevista de exclusão. Adaptação só é oferecida quando houver uma variante compatível. Exclusão deixa claro que é definitiva.
Evitar promessas falsas
Não exibir percentuais inventados em processos generativos. Usar mensagens reais do processo quando disponíveis e loading indeterminado quando não houver estimativa confiável.
Manter o ambiente calmo
Neutros dominam telas de trabalho; cor intensa marca ação, seleção, geração e destaque. Sombras são discretas.
Feedback proporcional
Toast para confirmações breves; modal para decisões irreversíveis; sheet para contextos mais extensos.
Acessibilidade por padrão
Foco visível, contraste suficiente, labels claros, ícones acompanhados de tooltip quando necessário e estados que não dependem apenas de cor.

Critério para decisões futuras
Uma funcionalidade é aceita somente se reduzir as decisões necessárias para chegar a uma peça pronta, aprofundar o contexto de marca ou melhorar exportação e reutilização. Se aproximar o Prisma de um editor gráfico geral, ela contraria o produto e deve ser recusada ou redesenhada.
