# Prime Product Foundations

Este documento registra os fundamentos reutilizáveis entre produtos Prime sem substituir suas identidades de produto.

## Escopo compartilhado

- sessão SSR do Supabase, usuário e vínculo ativo ao workspace;
- hierarquia de login, campos, feedback de erro e logout;
- provider de tema, persistência antes/depois de autenticar e redução de movimento;
- tipografia Geist, escala, grid, espaços, raio, superfícies e estados de foco;
- botões, inputs, menus de conta, dropdowns, modais, sheets, tooltips, toasts, skeletons, empty/error states e comportamento responsivo.

O design system fundador da Prime é a referência desta camada. Ele separa Shared Core (semântica, estrutura e acessibilidade) de Product Skin (marca e expressão). Pixel mapeia a escala de espaço de 4 px, raio, superfícies e estados para tokens semânticos, preservando a sua própria pele.

## Limite de identidade

Cada produto mantém seus próprios tokens, assets e linguagem. Pixel usa Vermilion `#F04B3E`, Ice Blue `#A9DCE8`, fundos `#F1F0EB`/`#121212` e os assets oficiais em `public/brand/pixel/`. Este documento não autoriza importar a paleta, ativos ou linguagem do Prisma.

## Autorização

A fundação atual do Órbita resolve sessão, membro ativo, workspace, perfis, papéis e permissões no lado do servidor. O modelo desejado do ecossistema inclui `product_access`, mas ele não existe no schema auditado; Pixel não o simula. Até uma migration compartilhada e RLS compatível adicionarem esse acesso, Pixel reutiliza a sessão e exige vínculo ativo no workspace. Qualquer ACL `pixel.*` deve nascer primeiro nessa fundação, e só então ser consumida pelo Pixel.
