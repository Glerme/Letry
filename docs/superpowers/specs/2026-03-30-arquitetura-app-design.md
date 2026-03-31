# Letry — Design de Arquitetura do Aplicativo

## Contexto

O Letry é um gerador de letreiros digitais animados (estilo LED) onde o usuário digita uma frase, customiza aparência/animação, e recebe uma URL curta compartilhável que exibe o letreiro. Funciona em desktop, mobile e Smart TVs.

Este documento define a arquitetura técnica do MVP, derivado das decisões tomadas durante o brainstorming.

---

## Decisões Arquiteturais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js 14+ (App Router, TypeScript, Tailwind CSS) | SSR nativo, route groups, Server Actions |
| Database + Auth | Supabase (PostgreSQL + Auth) via `@supabase/supabase-js` | Free tier, auth integrado, RLS |
| ORM | Nenhum — Supabase client direto | Aproveita RLS, Realtime e Auth nativos |
| Validação | Zod (schemas compartilhados client/server) | Fonte única de verdade, inferência de tipos |
| URL slugs | nanoid (7 chars, alfabeto sem ambiguidade) | Curto, colisão desprezível |
| Deploy | Vercel (domínio `.vercel.app` no MVP, domínio próprio depois) | Zero config com Next.js |
| Auth | Desde o início (Supabase Auth) | Dashboard de signs salvos no MVP |

---

## Estrutura de Diretórios

```
src/
  app/
    (marketing)/                ← Landing page pública
      page.tsx                  ← Home / hero
      layout.tsx                ← Layout com nav + footer
    (app)/                      ← Área autenticada
      create/
        page.tsx                ← Form de criação + preview ao vivo
      dashboard/
        page.tsx                ← Signs salvos do usuário
      layout.tsx                ← Layout com auth check + nav do app
    (auth)/                     ← Páginas de login/registro
      login/page.tsx
      register/page.tsx
      layout.tsx
    (display)/                  ← Exibição pública do sign (sem auth)
      s/[slug]/
        page.tsx                ← SSR do sign animado
      layout.tsx                ← Layout mínimo (sem nav, sem footer)
    api/
      og/[slug]/route.ts        ← OG image dinâmica (ImageResponse)
    layout.tsx                  ← Root layout (fonts, metadata global)
    globals.css
  components/
    ui/                         ← Primitivos reutilizáveis
      button.tsx
      input.tsx
      dialog.tsx
      select.tsx
    led/                        ← Core do renderer LED (isolado)
      led-display.tsx           ← Componente principal — orquestra grid + animação
      led-grid.tsx              ← CSS Grid de dots LED
      led-dot.tsx               ← Dot individual (circle div)
      font-bitmap.ts            ← Font 5x7 — cada char = array de 7 números de 5 bits
      animations/
        types.ts                ← Interface Animation (start, stop, update)
        scroll.ts               ← Marquee direita → esquerda (requestAnimationFrame)
        split-flap.ts           ← Scramble 70ms + settle rotateX + stagger 25ms
        fade.ts                 ← Chars aparecem com opacity + stagger delay
        index.ts                ← Registry: nome → implementação
    sign/                       ← Feature components do sign
      sign-form.tsx             ← Form de criação (Client Component)
      sign-preview.tsx          ← Wrapper do preview ao vivo
      share-dialog.tsx          ← Dialog com URL + botões de compartilhamento
      sign-card.tsx             ← Card no dashboard
      watermark.tsx             ← "Crie o seu em Letry" (viral loop)
  lib/
    supabase/
      server.ts                 ← createServerClient (1 por request, lê cookies)
      client.ts                 ← createBrowserClient (singleton)
      middleware.ts             ← Refresh de sessão automático
    validations/
      sign.ts                   ← Zod schemas + tipos inferidos
    utils/
      slug.ts                   ← Gerador nanoid com alfabeto customizado
      constants.ts              ← Enums de animação, presets de cor, mapa de velocidade
  middleware.ts                 ← Next.js middleware (chama lib/supabase/middleware.ts)
```

---

## Data Fetching Strategy

### Leituras — Server Components direto no Supabase

A página de display (`/s/[slug]`) e o dashboard são Server Components que leem direto do Supabase via `createServerClient`. Sem intermediário, sem API Route.

### Mutations — Server Actions

Criar, editar e deletar signs usam Server Actions (`'use server'`). O fluxo:

1. Client Component (form) chama Server Action
2. Server Action valida com Zod (`signSchema.parse()`)
3. Gera slug via nanoid (server-side only)
4. Insere/atualiza no Supabase via server client
5. Retorna slug ou erro
6. Client redireciona ou exibe erro

### OG Image — Única API Route

`/api/og/[slug]` usa `ImageResponse` do `next/og` para gerar preview dinâmico para WhatsApp, Twitter, etc.

---

## Supabase Client Pattern

### 3 Clientes Separados

| Cliente | Onde | Ciclo de vida | Uso |
|---|---|---|---|
| `server.ts` | Server Components, Server Actions, Route Handlers | 1 instância por request | Leitura, mutations, auth check |
| `client.ts` | Client Components | Singleton (browser) | Leitura reativa, auth listener |
| `middleware.ts` | Next.js Middleware | 1 por request | Refresh de sessão |

### Middleware de Auth

O middleware roda apenas nas rotas `/(app)/*`:
- Verifica se há sessão válida
- Refresh automático de token expirado
- Redireciona para `/login` se não autenticado
- **Não roda** em `/(display)/*` nem `/(marketing)/*` — essas rotas são 100% públicas

---

## Data Model

```sql
-- Gerenciado pelo Supabase Auth
-- Tabela auth.users criada automaticamente

CREATE TABLE public.signs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        VARCHAR(12) UNIQUE NOT NULL,
  text        VARCHAR(200) NOT NULL,
  animation   VARCHAR(20) NOT NULL DEFAULT 'scroll',
  led_color   VARCHAR(7) NOT NULL DEFAULT '#ff6600',
  bg_color    VARCHAR(7) NOT NULL DEFAULT '#111111',
  speed       VARCHAR(10) NOT NULL DEFAULT 'normal',
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Índice para busca por slug (display page)
CREATE UNIQUE INDEX idx_signs_slug ON signs(slug);

-- Índice para dashboard do usuário
CREATE INDEX idx_signs_user_id ON signs(user_id) WHERE user_id IS NOT NULL;

-- RLS: qualquer um lê, só o dono modifica
ALTER TABLE signs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signs são públicos para leitura"
  ON signs FOR SELECT
  USING (true);

CREATE POLICY "Usuário cria signs"
  ON signs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Usuário edita seus signs"
  ON signs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário deleta seus signs"
  ON signs FOR DELETE
  USING (auth.uid() = user_id);
```

---

## LED Renderer

### Princípios
- **Componente puro**: recebe `{ text, animation, ledColor, bgColor, speed }` via props, não faz fetch
- **Reutilizável**: mesmo componente no preview (criação) e no display (página pública)
- **CSS Grid de divs circulares** — GPU-accelerated, responsivo, funciona em Smart TVs
- **Font bitmap 5x7**: cada char ASCII = array de 7 números de 5 bits
- `will-change` só durante animação ativa (remove após terminar)
- Scroll virtualizado: renderiza apenas colunas visíveis (~250 DOM nodes máx)

### Strategy Pattern para Animações

Cada animação implementa uma interface comum:

```typescript
interface Animation {
  name: string;
  start(grid: LEDGrid, text: string, speed: Speed): void;
  stop(): void;
}
```

Registry em `animations/index.ts` mapeia nome → implementação:
```typescript
const animations: Record<string, Animation> = {
  scroll: new ScrollAnimation(),
  'split-flap': new SplitFlapAnimation(),
  fade: new FadeAnimation(),
};
```

Adicionar uma nova animação na Fase 2 = criar arquivo + registrar no mapa.

---

## Validação (Zod)

### Schema compartilhado

```typescript
// lib/validations/sign.ts
const signSchema = z.object({
  text: z.string().min(1).max(200),
  animation: z.enum(['scroll', 'split-flap', 'fade']),
  led_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  speed: z.enum(['slow', 'normal', 'fast']),
});

type SignInput = z.infer<typeof signSchema>;
```

- **Client**: react-hook-form + `@hookform/resolvers/zod` para validação instantânea
- **Server Action**: `signSchema.parse(data)` — re-valida sempre, nunca confia no client
- **Tipos**: `SignInput` inferido do schema, zero duplicação

---

## Fluxo Principal (MVP)

### Criação de Sign

```
Usuário visita letry.app
  → (marketing) landing page com CTA "Criar Sign"
  → Redireciona para /create
  → Se não logado: pode criar sem conta (user_id = null)
  → Se logado: sign vinculado ao user_id
  → Form: texto + animação + cores + velocidade
  → Preview ao vivo renderiza LEDDisplay com props do form
  → Submit → Server Action:
      1. Zod valida input
      2. nanoid gera slug (7 chars, server-side)
      3. Insere no Supabase
      4. Retorna slug
  → ShareDialog abre com URL para copiar/compartilhar
```

### Exibição de Sign (Display)

```
Destinatário visita letry.app/s/xK9mQ2p
  → (display) Server Component busca sign por slug
  → generateMetadata retorna OG tags dinâmicas
  → OG image via /api/og/xK9mQ2p
  → LEDDisplay renderiza com animação
  → Watermark: "Crie o seu em Letry" (link para home)
  → Botão fullscreen / tecla F para modo kiosk
  → Sem auth, sem nav, layout mínimo
```

### Dashboard

```
Usuário visita letry.app/dashboard
  → Middleware verifica sessão
  → Se não logado → redirect /login
  → Server Component busca signs WHERE user_id = auth.uid()
  → Lista de SignCards com preview, slug, data, ações (editar/deletar)
```

---

## Auth Flow (Supabase Auth)

### Métodos de Login
- Email + senha (MVP)
- OAuth (Google) — opcional, fácil de adicionar depois

### Fluxo
1. Usuário acessa `/login` ou `/register`
2. Supabase Auth gerencia sessão via cookies
3. Middleware em `/(app)/*` verifica sessão e faz refresh
4. Server Components leem `auth.uid()` do server client
5. RLS garante que queries retornam apenas dados do usuário logado

---

## Compartilhamento

- **Copiar URL**: `navigator.clipboard.writeText()`
- **Web Share API**: `navigator.share()` para mobile (fallback para copiar)
- **Links diretos**: botões para WhatsApp (`wa.me/?text=`), Twitter (`twitter.com/intent/tweet?url=`)
- **OG Preview**: título = texto do sign (truncado), imagem = render estático via `/api/og/[slug]`

---

## Performance

- Display page: zero JS desnecessário (Server Component), LED renderer é o único Client Component
- Fullscreen via Fullscreen API nativa
- Font bitmap carregado como constante (sem fetch)
- Scroll virtualizado limita DOM nodes
- `will-change: transform` só durante animação
- CSS custom properties para responsividade (sem media queries complexas)

---

## Dependências do MVP

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "zod": "^3",
    "nanoid": "^5",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "tailwindcss": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^18",
    "@types/node": "^20"
  }
}
```

---

## Escopo Fora do MVP

Itens planejados para Fase 2 (não incluir na implementação inicial):
- Custom slugs (feature premium)
- Export GIF/vídeo
- Mais animações (blink, neon glow, matrix rain, typewriter)
- Som de flap (Web Audio API)
- Analytics de views por sign
- Embed mode (iframe)
- Templates prontos
- Stripe/pagamentos
- OAuth providers além de email
