# Google Drive opcional

O Drive é uma extensão opcional por pessoa. As criações continuam no IndexedDB e a exportação local PNG/JPG/ZIP continua disponível mesmo sem conexão ou configuração do Google.

## Escopo e dados

- OAuth de servidor para servidor com `https://www.googleapis.com/auth/drive.file` apenas no momento em que a pessoa escolhe conectar;
- uma pasta `Pixel` criada pela aplicação no Meu Drive de cada pessoa conectada;
- exportações PNG/JPG e, para carrosséis, as imagens individuais e o ZIP são enviados para essa pasta;
- somente o refresh token é persistido, cifrado com AES-256-GCM. Access tokens são obtidos sob demanda e nunca são enviados ao browser;
- estado de OAuth é temporário, assinado e guardado em cookie `HttpOnly`, `SameSite=Lax`, por no máximo dez minutos. Não contém tokens.

Não há sincronização bidirecional, importação de biblioteca, listagem geral de arquivos nem escopo `drive` amplo.

## Pré-requisitos a configurar

1. No Google Cloud, crie ou escolha o projeto do Pixel e habilite a Google Drive API.
2. Configure a tela de consentimento OAuth e declare somente o escopo `drive.file`.
3. Crie uma credencial OAuth 2.0 de **Web application** e cadastre exatamente a URL de callback do ambiente, por exemplo `https://pixel.primecreative.com.br/api/integrations/google-drive/callback`.
4. Configure no ambiente local seguro e na Vercel, sem prefixo `NEXT_PUBLIC_`:
   - `GOOGLE_DRIVE_CLIENT_ID`;
   - `GOOGLE_DRIVE_CLIENT_SECRET`;
   - `GOOGLE_DRIVE_REDIRECT_URI` (igual à URL cadastrada no Google Cloud);
   - `GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY` (Base64 de 32 bytes aleatórios, exclusivo do Drive);
   - `GOOGLE_DRIVE_OAUTH_STATE_SECRET` (segredo aleatório de ao menos 32 caracteres).
5. Aplique a migration abaixo no **Supabase central do ecossistema Prime**, com RLS. Ela não pertence a este repositório e não deve ser simulada no browser. O service role do backend do Pixel é o único processo que lê ou grava a tabela.

```sql
create table public.google_drive_connections (
  team_member_id uuid primary key references public.team_members(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  refresh_token_ciphertext text not null,
  refresh_token_iv text not null,
  folder_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.google_drive_connections enable row level security;

create policy "No direct client access to Google Drive connections"
  on public.google_drive_connections
  for all
  using (false)
  with check (false);
```

O banco central deve manter uma trigger ou rotina equivalente para atualizar `updated_at`, se esse for o padrão do projeto. Não exponha essa tabela via uma policy de cliente; as rotas do Pixel validam a sessão Supabase e o vínculo ativo de `team_members` antes de usar o service role.

## Operação e erros

- O botão **Conectar Google Drive** só fica ativo quando os cinco valores de ambiente existem.
- A desconexão tenta revogar o refresh token no Google e apaga sempre a conexão cifrada local. Se a revogação externa falhar, o Pixel informa isso e a pessoa pode removê-la também na página de apps de terceiros da conta Google.
- Os arquivos são enviados pelo servidor para o Drive; o navegador recebe apenas status e nomes dos arquivos concluídos. A interface mostra preparação, transferência e conclusão, e preserva erros recuperáveis.
