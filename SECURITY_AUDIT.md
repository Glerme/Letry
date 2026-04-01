# Security Audit — Letry

**Data:** 2026-04-01
**Escopo:** Aplicacao completa (Next.js 16 + Supabase)

---

## Vulnerabilidades Encontradas

### VULN-01: Open Redirect no Auth Callback [HIGH]

**Arquivo:** `src/app/auth/callback/route.ts:7`

**Problema:** O parametro `next` da query string e usado diretamente no `NextResponse.redirect()` sem validacao. Um atacante pode criar uma URL como `/auth/callback?code=VALID&next=//evil.com` que redireciona para `evil.com` apos autenticacao (browsers interpretam `//evil.com` como URL protocol-relative).

**Impacto:** Ataques de phishing — uma URL de auth com aparencia legitima redireciona usuarios para um site malicioso apos login, potencialmente roubando credenciais.

**Nota:** O outro callback em `src/app/(auth)/callback/route.ts` ja esta protegido com `rawNext.startsWith('/') && !rawNext.startsWith('//')`.

**Como resolver:** Validar o parametro `next` para aceitar apenas paths relativos que comecem com `/` e nao com `//`:
```typescript
const rawNext = searchParams.get('next') ?? '/dashboard';
const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';
```

---

### VULN-02: Exposicao de `user_id` na API Publica [MEDIUM]

**Arquivo:** `src/app/api/signs/[slug]/route.ts:13`

**Problema:** `select('*')` retorna TODAS as colunas incluindo `user_id` (UUID de auth do Supabase) em um endpoint **publico, sem autenticacao**. Qualquer pessoa acessando `/api/signs/{slug}` recebe o ID interno do criador do sign.

**Impacto:** Enumeracao de usuarios, ataques direcionados usando UUIDs conhecidos.

**Como resolver:** Usar `select()` explicito com apenas os campos necessarios, excluindo `user_id` e `id`:
```typescript
.select('slug, text, animation, led_color, bg_color, speed, created_at')
```

---

### VULN-03: `select('*')` na API Autenticada [LOW]

**Arquivo:** `src/app/api/signs/route.ts:14`

**Problema:** `select('*')` retorna todas as colunas incluindo campos internos potencialmente desnecessarios. Embora este endpoint seja autenticado, e boa pratica retornar apenas campos necessarios.

**Como resolver:** Usar select explicito:
```typescript
.select('id, slug, text, animation, led_color, bg_color, speed, created_at')
```

---

### VULN-04: Ausencia de Security Headers [MEDIUM]

**Arquivo:** `next.config.ts`

**Problema:** Nenhum header de seguranca configurado. A aplicacao esta vulneravel a:
- **Clickjacking** (sem X-Frame-Options / frame-ancestors)
- **MIME sniffing** (sem X-Content-Type-Options)
- **HSTS ausente** (sem Strict-Transport-Security)
- **Sem CSP** (sem Content-Security-Policy)
- **Sem Referrer-Policy**
- **Sem Permissions-Policy**

**Como resolver:** Adicionar `headers()` no `next.config.ts` com X-Frame-Options DENY, X-Content-Type-Options nosniff, Strict-Transport-Security, Referrer-Policy e Permissions-Policy.

---

### VULN-05: Enumeracao de Usuarios via Mensagens de Erro [MEDIUM]

**Arquivos:** `src/app/(auth)/login/page.tsx:23`, `src/app/(auth)/register/page.tsx:26`

**Problema:** Mensagens de erro do Supabase sao repassadas diretamente ao cliente via URL params. Alguns erros revelam se um email existe (ex: "User already registered" no signup, mensagem especifica no login). Isso permite enumeracao de usuarios.

**Como resolver:** Substituir por mensagens genericas fixas:
- Login: "Credenciais invalidas"
- Register: "Nao foi possivel criar a conta"

---

### VULN-06: Engenharia Social via Parametros de Erro na URL [LOW]

**Arquivos:** `src/app/(auth)/login/page.tsx:57`, `src/app/(auth)/register/page.tsx:75`

**Problema:** Mensagens de erro dos search params da URL sao renderizadas com `{decodeURIComponent(error)}`. Embora React JSX faca auto-escape (sem XSS), um atacante pode criar URLs de phishing como `/login?error=Sua%20conta%20foi%20bloqueada.%20Ligue%20555-1234` para exibir mensagens arbitrarias.

**Como resolver:** Usar um allowlist de codigos de erro mapeados para mensagens fixas, exibindo "Ocorreu um erro" para qualquer codigo desconhecido.

---

### VULN-07: Ausencia de Rate Limiting [MEDIUM]

**Arquivos:** Todas as API routes e Server Actions

**Problema:** Nenhum rate limiting existe em qualquer endpoint:
- Tentativas de brute-force no login (Supabase tem protecao propria, mas nao e garantida)
- Spam na criacao de signs (signs anonimos sao permitidos)
- Abuso de API / DoS

**Como resolver:** Implementar rate limiting com Upstash Redis (`@upstash/ratelimit`) ou solucao in-memory para dev. Aplicar nos endpoints de auth e criacao de signs.

---

### VULN-08: Sem Validacao de Input nos Forms de Auth (Server-side) [LOW]

**Arquivos:** `src/app/(auth)/login/page.tsx:9-10`, `src/app/(auth)/register/page.tsx:9-10`

**Problema:** Forms de auth apenas checam `!email || !password` mas nao validam formato de email ou forca de senha no server-side. Embora o Supabase valide por conta propria, defesa em profundidade sugere validar antes de enviar.

**Como resolver:** Adicionar schema Zod para validar email e senha minima de 6 caracteres antes de chamar o Supabase.

---

### VULN-09: Ausencia de Validacao de Formato UUID no Delete [LOW]

**Arquivo:** `src/app/(app)/dashboard/actions.ts:11`

**Problema:** `deleteSign(id)` apenas checa `!id` mas nao valida formato UUID. Embora Supabase rejeite UUIDs invalidos, validar o formato e defesa em profundidade.

**Como resolver:** Adicionar regex de validacao UUID antes de executar a query.

---

## O Que NAO Esta Vulneravel

| Area | Status | Detalhes |
|------|--------|----------|
| SQL Injection | **Seguro** | Sem SQL raw, usa Supabase query builder exclusivamente |
| XSS | **Seguro** | Sem `dangerouslySetInnerHTML`, sem `innerHTML`, React JSX auto-escapa |
| IDOR | **Seguro** | Delete checa `user_id` + RLS, listagem filtra por `user_id` |
| CSRF | **Seguro** | Next.js Server Actions tem verificacao de origin built-in |
| Exposicao de Secrets | **Seguro** | Sem secrets hardcoded, `.env.local` no gitignore, apenas chaves `NEXT_PUBLIC_` anon expostas (por design) |
| Armazenamento de Tokens Client-side | **Seguro** | Sem `localStorage`/`sessionStorage` para tokens, Supabase SSR gerencia cookies |
| SSRF | **Seguro** | Sem URLs controladas pelo usuario sendo fetchadas no server |
| Eval/Code Injection | **Seguro** | Sem `eval()`, `Function()`, ou execucao de codigo dinamico |
| Vazamento de Erros | **Seguro** | Mensagens genericas nas API responses, sem stack traces expostos |
| Middleware | **Ativo** | `src/proxy.ts` compila para `.next/server/middleware.js`, protecao de rotas funciona |

---

## Prioridade de Correcao

| Prioridade | Vulnerabilidade | Severidade | Esforco |
|------------|----------------|------------|---------|
| 1 | VULN-01: Open Redirect | HIGH | ~5 min |
| 2 | VULN-02: Leak de `user_id` publico | MEDIUM | ~5 min |
| 3 | VULN-04: Security headers | MEDIUM | ~10 min |
| 4 | VULN-05: Enumeracao de usuarios | MEDIUM | ~5 min |
| 5 | VULN-06: Engenharia social via erros | LOW | ~15 min |
| 6 | VULN-03: `select('*')` autenticado | LOW | ~5 min |
| 7 | VULN-07: Rate limiting | MEDIUM | ~30-60 min |
| 8 | VULN-08: Validacao de auth forms | LOW | ~10 min |
| 9 | VULN-09: Validacao UUID | LOW | ~2 min |

---

## Arquivos Afetados

1. `src/app/auth/callback/route.ts`
2. `src/app/api/signs/[slug]/route.ts`
3. `src/app/api/signs/route.ts`
4. `next.config.ts`
5. `src/app/(auth)/login/page.tsx`
6. `src/app/(auth)/register/page.tsx`
7. `src/app/(app)/dashboard/actions.ts`
