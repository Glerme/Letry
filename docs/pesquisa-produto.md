# Letry — Pesquisa de Produto e Monetização

## Contexto

Produto digital MVP: usuário digita uma frase e recebe uma URL curta e compartilhável que exibe essa frase como um letreiro digital animado (estilo LED). Funciona em desktop, mobile e Smart TVs.

**Referência analisada:** [flipoff](https://github.com/magnum6actual/flipoff) — emulador split-flap vanilla JS (HTML/CSS/JS puro, sem framework). Pontos relevantes:
- Renderização via CSS Grid de tiles DOM (não Canvas) — GPU-accelerated, funciona bem em TVs
- Animação split-flap: scramble de chars aleatórios a 70ms + settle com `rotateX` + stagger de 25ms/tile
- Sem URL dinâmica, sem input do usuário, mensagens hardcoded — **gap de produto a explorar**
- Fullscreen mode nativo (tecla F), responsivo com CSS custom properties

---

## 5 Ideias de Produto

### 1. Gerador de Signs para Redes Sociais
**Ideia:** Criar letreiros LED animados otimizados para compartilhar em Instagram Stories, TikTok e Twitter/X como GIF ou vídeo.

**Por que pode funcionar:** Conteúdo animado e personalizado é viral por natureza. O loop de compartilhamento é embutido — cada sign visto gera curiosidade para criar outro. Plataformas como Linktree e Canva provaram esse modelo.

**Principal obstáculo:** Exportação como GIF/vídeo requer renderização server-side (puppeteer ou canvas), adicionando custo e complexidade.

**Próximo passo MVP:** Lançar só com URL compartilhável (sem export). Se o click-through for alto, a demanda por export está confirmada — adicionar depois.

---

### 2. Sinalização Digital para Eventos e Comércios
**Ideia:** Modo fullscreen "kiosk" para restaurantes, bares, igrejas e eventos exibirem mensagens em Smart TVs ou projetores.

**Por que pode funcionar:** Soluções de digital signage custam $20+/mês por tela (ex: ScreenCloud). Uma alternativa gratuita/barata com UI bonita atende PMEs que não querem pagar caro. Usuários comerciais têm maior willingness to pay.

**Principal obstáculo:** TVs têm browsers fracos — performance precisa ser excepcional. Concorrência com plataformas estabelecidas de signage.

**Próximo passo MVP:** Implementar fullscreen mode com "URL Kiosk" (auto-refresh, sem chrome de navegador). Testar em 3 Smart TVs diferentes. Divulgar em fóruns de pequenos negócios e grupos de restaurantes.

---

### 3. Countdown e Signs ao Vivo
**Ideia:** Signs com contagem regressiva (Ano Novo, lançamentos de produto, eventos) ou playlist de mensagens rotativas.

**Por que pode funcionar:** Páginas de countdown geram tráfego massivo antes de eventos. Playlists resolvem a necessidade de múltiplas mensagens para comércios (ex: cardápio rotativo, promoções).

**Principal obstáculo:** Countdowns precisam de lógica de timezone no client. Playlists aumentam a complexidade do data model e da UI de criação.

**Próximo passo MVP:** Adicionar um tipo de animação "countdown" que aceita uma data-alvo. Compartilhar links de countdown antes de um evento popular e medir o tráfego gerado.

---

### 4. Mural Digital Colaborativo
**Ideia:** Múltiplas pessoas enviam mensagens para um sign compartilhado — mural de casamento, Q&A ao vivo em conferência, parabéns coletivo de aniversário.

**Por que pode funcionar:** Experiências interativas geram engajamento alto. Cada participante vira um potencial novo usuário ao ver o produto em uso. Wedding tech e event tech são nichos com boa monetização.

**Principal obstáculo:** Requer atualizações em real-time (WebSockets ou polling), moderação de conteúdo e prevenção de abuso. Complexidade significativamente maior que um sign estático.

**Próximo passo MVP:** Construir fila de mensagens simples (form de submissão + rotação no display). Testar ao vivo em um evento real e coletar feedback.

---

### 5. Templates Prontos para Marketing
**Ideia:** Templates pré-desenhados (PROMOÇÃO, ABERTO/FECHADO, Feliz Aniversário, Bem-vindo) que negócios customizam com suas cores e texto.

**Por que pode funcionar:** Templates reduzem a barreira de criação. SEO captura buscas de alta intenção como "letreiro digital grátis", "painel de promoção para loja", "display LED online". Templates podem ser monetizados como packs.

**Principal obstáculo:** Design dos templates requer esforço inicial; customização com logo/fontes adiciona complexidade de UI.

**Próximo passo MVP:** Criar 5-10 templates para os casos mais comuns. Rastrear via analytics quais templates têm mais uso para priorizar expansão.

---

## Estratégia de Monetização

### Modelos Analisados

| Prioridade | Estratégia | Esforço de Implementação | Potencial de Receita |
|---|---|---|---|
| 1 | **Viral loop** — todo sign exibe "Crie o seu em Letry" com link | Muito baixo | Motor de crescimento (não receita direta) |
| 2 | **Freemium** — free com watermark; premium remove watermark + features | Baixo | Média-Alta |
| 3 | **Ads na página de criação** (nunca no display do sign) | Baixo | Baixa-Média |
| 4 | **Export GIF/vídeo** como feature paga ($1-3 por export ou incluso no premium) | Médio | Média |
| 5 | **Packs de temas/animações** via one-time purchase | Médio | Baixa-Média |

### Recomendações

**Não negociável — viral loop:**
Todo sign compartilhado deve exibir "Crie o seu em letry.app" — discreta mas visível. É o equivalente da assinatura do Hotmail. Custo zero, impacto alto.

**Modelo freemium como base:**
- **Free:** sign com watermark, 3 animações básicas, cores padrão
- **Premium ($5-10/mês ou lifetime $15-25):** remove watermark, animações extras, cores customizadas, slugs personalizados, export GIF/vídeo, analytics de views

Taxa de conversão esperada: 2-5% dos usuários ativos (padrão do mercado para ferramentas simples tipo Linktree, Bitly, Remove.bg).

**Ads: suplementar, não principal:**
Colocar ads apenas na página de criação, nunca na página de display do sign. Ads no display matam a viralidade (usuário não vai querer compartilhar um link com banner).

**Export GIF/vídeo: upsell forte:**
Usuários querem compartilhar no Instagram, TikTok, WhatsApp onde URLs são menos eficazes. Cobrar $1-3 por export ou incluir no plano premium é um padrão comprovado.

**Lifetime deal no lançamento:**
Oferecer acesso vitalício por $15-25 durante o lançamento para construir base de usuários e coletar testimonials.

### Referências de Mercado

Produtos similares para estudo: imgflip (ad-supported), Remove.bg (freemium), Bitly (freemium), cooltext.com, marquee text generators. Mercado de digital signage: $20B+, crescimento de 8-10% ao ano.

---

## Arquitetura Técnica Proposta (MVP)

### Stack
- **Framework:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Database:** Supabase (PostgreSQL) — free tier, auth integrado para fases futuras
- **Deploy:** Vercel
- **Validação:** Zod
- **URL slugs:** nanoid (7 chars, alfabeto sem ambiguidade: `abcdefghjkmnpqrstuvwxyz23456789`)

### URL Strategy
```
letry.app/s/xK9mQ2p     ← MVP (nanoid 7 chars)
letry.app/s/promo-hoje  ← Fase 2 (custom slug, feature premium)
```

### Data Model

```sql
CREATE TABLE signs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        VARCHAR(12) UNIQUE NOT NULL,
  text        VARCHAR(200) NOT NULL,
  animation   VARCHAR(20) NOT NULL DEFAULT 'scroll',  -- scroll | split-flap | fade
  led_color   VARCHAR(7) NOT NULL DEFAULT '#ff6600',
  bg_color    VARCHAR(7) NOT NULL DEFAULT '#111111',
  speed       VARCHAR(10) NOT NULL DEFAULT 'normal',  -- slow | normal | fast
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Renderização LED
- CSS Grid de `<div>` circulares (não Canvas) — GPU-accelerated, responsivo nativo
- Font bitmap 5x7: cada char ASCII = array de 7 números binários de 5 bits
- `will-change` apenas durante animação (remove após terminar)
- Scroll virtualizado: só renderiza colunas visíveis (~250 DOM nodes max)

### 3 Animações MVP
1. **Scroll** — marquee da direita para esquerda, `requestAnimationFrame`
2. **Split-flap** — scramble (chars aleatórios a 70ms) → settle (`rotateX` com `perspective`)
3. **Fade-in** — chars aparecem um a um com `opacity` transition + stagger delay

### Fluxo Principal
```
Usuário visita letry.app
  → Digita texto, escolhe animação/cores/velocidade
  → Preview ao vivo mostra o sign animado
  → Clica "Criar Sign"
  → POST /api/signs → valida (Zod), gera slug (nanoid), insere no Supabase
  → ShareDialog abre com URL para copiar/compartilhar

Destinatário visita letry.app/s/xK9mQ2p
  → SSR busca config do Supabase
  → OG image dinâmica (Next.js ImageResponse) para preview no WhatsApp/Twitter
  → Sign anima automaticamente
  → Watermark: "Crie o seu em Letry" (viral loop)
  → Botão fullscreen / tecla F para modo kiosk
```

---

## Escopo MVP vs Fases Futuras

### MVP (Fase 1)
- Form de criação: texto, animação, cores, velocidade
- Preview ao vivo durante criação
- 3 animações: scroll, split-flap, fade
- Geração de URL curta (nanoid)
- Página de exibição SSR com SEO/OG tags
- Fullscreen mode (botão + tecla F)
- Compartilhamento (copiar URL, Web Share API, links diretos Twitter/WhatsApp)
- Watermark com viral loop
- Responsivo mobile-first + performance em Smart TVs

### Fase 2 (pós-MVP)
- Contas de usuário (Supabase Auth)
- Slugs customizados (feature premium)
- Export GIF/vídeo (feature premium)
- Mais animações: blink, neon glow, matrix rain, typewriter
- Som de flap (Web Audio API, opt-in)
- Analytics de views por sign
- Embed mode (iframe)
- Templates prontos por categoria
- Integração Stripe para pagamentos

---

## Personas

### Persona 1 — O Criador de Conteúdo (usuário primário do MVP)
- **Quem:** 18-30 anos, ativo em redes sociais (Instagram, TikTok, Twitter/X)
- **Contexto:** Quer conteúdo visual diferente para Stories e posts sem precisar de Canva ou Premiere
- **Job to be done:** "Quero chamar atenção com uma mensagem animada que pareça cool e diferente"
- **Comportamento:** Usa o produto, compartilha o link ou print, abandona se demorar mais de 60s para criar
- **Disposição a pagar:** Baixa — prefere free com watermark; pode converter para premium se viralizar

### Persona 2 — O Dono de Negócio Local
- **Quem:** Dono de bar, restaurante, loja, barbearia, 25-45 anos
- **Contexto:** Quer exibir promoções ou mensagens em TV sem pagar por software caro de signage
- **Job to be done:** "Quero colocar uma mensagem bonita na TV da minha loja hoje, sem complicação"
- **Comportamento:** Chega via busca orgânica ("letreiro digital grátis"), testa no celular, abre na TV
- **Disposição a pagar:** Média-alta — se funcionar bem na TV, paga $5-10/mês sem pensar muito

### Persona 3 — O Organizador de Eventos
- **Quem:** Organiza casamentos, festas, conferências, cultos. Pode ser profissional ou voluntário
- **Contexto:** Precisa de display temático para uma ocasião específica — uso pontual, não recorrente
- **Job to be done:** "Quero algo visualmente impactante para o evento sem contratar designer"
- **Comportamento:** Busca solução 1-2 dias antes do evento, usa uma vez, compartilha se ficou bom
- **Disposição a pagar:** Média — pagaria pelo evento, relutante com assinatura mensal; lifetime deal atrai

---

## Métricas de Sucesso do MVP

### Meta do MVP
Validar que usuários criam signs **e** os compartilham ativamente (loop viral funcionando).

### KPIs Primários

| Métrica | Meta Semana 4 | Meta Mês 3 | Fonte |
|---|---|---|---|
| Signs criados | 500 | 5.000 | Supabase |
| Taxa de compartilhamento | ≥ 30% dos signs criados | ≥ 35% | Web Share API + copy events |
| Visitantes via link compartilhado | ≥ 40% do tráfego total | ≥ 50% | Analytics |
| Retorno (mesmo usuário cria 2+ signs) | ≥ 15% | ≥ 25% | Cookie/localStorage |

### KPIs Secundários
- **Tempo até primeiro sign criado:** meta < 90 segundos (mede fricção do onboarding)
- **Bounce rate na página de display:** meta < 40% (mede se o sign prende quem recebe o link)
- **Cliques no watermark "Crie o seu":** meta ≥ 8% dos visitantes de display (valida o viral loop)

### Critério de Pivot
Se após 60 dias a taxa de compartilhamento for < 15%, o produto não tem loop viral e precisa de reposicionamento antes de investir em monetização.

---

## Go-to-Market (Primeiros 1.000 Usuários)

### Canais por Ordem de Prioridade

**1. Lançamento em comunidades (Semana 1)**
- Product Hunt — post no lançamento com GIF demonstrando as 3 animações
- Reddit: r/InternetIsBeautiful, r/web_design, r/entrepreneur, r/smallbusiness
- Hacker News: Show HN
- Twitter/X: thread mostrando o produto em uso, pedindo para a rede testar

**2. SEO de cauda longa (Mês 1-3)**
Páginas otimizadas para buscas de alta intenção:
- "letreiro digital grátis para TV"
- "letreiro LED online"
- "criar marquee animado"
- "digital signage gratuito para restaurante"
- Cada template da Fase 2 vira uma landing page indexável

**3. Conteúdo nativo nas redes (contínuo)**
- Criar signs com mensagens virais/trending e postar como conteúdo orgânico
- O próprio produto é o anúncio — cada sign postado é uma impressão com watermark
- Incentivar UGC: "Mostre seu sign" com hashtag #letry

**4. Comunidades de negócios locais (Mês 2)**
- Grupos de Facebook de donos de restaurantes, lojistas, igrejas
- Grupos de WhatsApp de empreendedores locais
- Oferecer conta premium grátis por 3 meses para primeiros 50 negócios (coleta de testimonials)

### Métrica de Validação do Canal
Rastrear UTM por canal desde o dia 1 para identificar qual fonte converte melhor antes de investir.

---

## Análise Competitiva

| Produto | Proposta | Preço | Fraqueza a explorar |
|---|---|---|---|
| **cooltext.com** | Gerador de texto animado/GIF | Gratuito (ads) | UI datada dos anos 2000; não é responsivo; sem URL compartilhável |
| **Marquee Text Generators** (vários) | Texto rolante simples | Gratuito | Visual genérico, sem estética LED/retro; sem persistência |
| **ScreenCloud** | Digital signage profissional | $20+/tela/mês | Caro demais para PME/uso casual; curva de aprendizado alta |
| **Canva (animações)** | Design geral animado | Free/Pro $15/mês | Não é fullscreen/TV-first; não gera URL de display; genérico demais |
| **Flipoff (open source)** | Emulador split-flap | Gratuito (self-host) | Sem input do usuário; sem URL; requer conhecimento técnico |
| **Neon Signs generators** | Efeito neon estático | Gratuito (ads) | Estático, sem animação; sem URL compartilhável |

### Posicionamento do Letry
> "O jeito mais rápido de criar um letreiro animado e compartilhar como link — funciona no celular, no navegador e na TV."

Vantagem competitiva defensável: combinação de **estética premium + URL compartilhável + fullscreen TV-ready** que nenhum concorrente direto oferece hoje.

---

## Validação de Preço

### Hipótese Atual
- Free com watermark sustenta o viral loop
- Premium $5-10/mês ou lifetime $15-25 converte 2-5% dos ativos

### Como Validar Antes de Construir o Paywall
1. **Smoke test no lançamento:** Adicionar botão "Remover watermark — $9/mês" mesmo sem Stripe integrado. Medir cliques. Se CTR > 3%, demanda confirmada.
2. **Pergunta direta a usuários recorrentes (semana 2-3):** Email/popup para quem criou 3+ signs: "O que te faria pagar $5/mês pelo Letry?" — coletar respostas abertas.
3. **Referência de mercado:**
   - Remove.bg: conversão ~3% free→paid, ARPU ~$9/mês
   - Bitly: plano pago $8-35/mês, conversão ~2%
   - Linktree: plano Pro $9/mês, ~5% conversão
   - Benchmark conservador para Letry: **2% conversão, $8 ARPU** → 1.000 usuários ativos = $160 MRR

### Preço por Feature (Hierarquia de Valor Percebido)
Com base em produtos similares, ordem de willingness to pay esperada:
1. Remover watermark — alto (afeta toda vez que compartilha)
2. Slug personalizado — médio-alto (para negócios com marca)
3. Export GIF/vídeo — médio (uso pontual, pode ser pay-per-use)
4. Animações extras — médio (desejo, não necessidade)
5. Analytics de views — baixo (nice to have para maioria)
