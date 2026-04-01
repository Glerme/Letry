# Abacate Pay + Plano Free/Pro (Brasil-first) Implementation Plan

## Summary
Implementar monetização inicial focada no Brasil com `Abacate Pay`, priorizando facilitação via `Pix` (anual) e recorrência mensal via cartão, com enforcement forte no backend/DB:
1. Free: 1 letreiro ativo por usuário + apenas animação `scroll`.
2. Pro: múltiplos letreiros + todas as animações.
3. Display Free: marca d’água grande + QR Code para landing.
4. Display Pro: sem marca d’água/QR.

Decisões fechadas:
- Criação apenas para usuário logado.
- Limite Free = 1 ativo por vez (pode deletar e criar outro).
- Cobrança Pro V1 = mensal cartão + anual Pix.

## Key Changes
### 1) Billing/Plano (Abacate Pay)
- Adicionar módulo de billing com integração Abacate Pay:
1. `POST /api/billing/checkout` cria checkout por plano (`pro_monthly_card`, `pro_annual_pix`).
2. `POST /api/webhooks/abacate-pay` processa eventos de pagamento/assinatura e sincroniza status local.
- Adicionar tabela de assinatura/plano (ex.: `user_subscriptions`) com:
1. `user_id`, `plan_tier` (`free|pro`), `status`, `provider`, `provider_reference`, `current_period_end`.
2. Índices por `user_id` e `provider_reference`.
- Definir função utilitária de domínio (`getEffectivePlan(userId)`) usada por backend e UI.
- Atualizar `.env.example` com variáveis do Abacate Pay (`ABACATEPAY_API_KEY`, `ABACATEPAY_WEBHOOK_SECRET`, `ABACATEPAY_PUBLIC_KEY`, `ABACATEPAY_APP_URL`).

### 2) Enforcement Backend + DB (não confiar no front)
- Em `createSign` (server action), validar plano e limite antes do insert:
1. Se `free` e já existe 1 sign ativo: bloquear.
2. Se `free` e animação != `scroll`: bloquear.
- Adicionar enforcement em nível de banco:
1. Trigger `BEFORE INSERT` em `signs` para repetir as regras acima.
2. Ajustar policy de INSERT para exigir usuário autenticado (`auth.uid() = user_id`), removendo inserção anônima.
- Mensagens de erro PT-BR claras para limites de plano.

### 3) UX de plano no app
- `Create`:
1. Exibir animações Pro como visíveis porém bloqueadas no Free.
2. Mostrar CTA de upgrade ao tentar selecionar animação Pro.
3. Exibir contador de limite Free (“1/1 usado”).
- `Dashboard`:
1. Badge de plano atual.
2. CTA de upgrade para Pro.
- Landing `PricingSection`:
1. Refletir oferta real (Free vs Pro mensal/anual Pix).

### 4) Display com marca d’água grande + QR (somente Free)
- Em `/s/[slug]`, resolver plano efetivo do dono do sign.
- Render condicional:
1. Free: overlay grande com nome do app + QR Code para landing (`/`).
2. Pro: sem overlay.
- Implementar QR code com geração local (biblioteca dedicada) para não depender de serviço externo.

### 5) Interfaces públicas/tipos
- Novos tipos de domínio:
1. `PlanTier = 'free' | 'pro'`
2. `SubscriptionStatus` (ex.: `active|past_due|canceled|pending`)
- Contratos novos:
1. `POST /api/billing/checkout` input: plano/return URLs.
2. `POST /api/webhooks/abacate-pay` input: payload assinado do provedor.
- Atualizar tipos de UI para consumir plano efetivo no create/dashboard/display.

## Test Plan
1. Unit (server/domain):
- `createSign` bloqueia Free com >1 sign.
- `createSign` bloqueia Free com animação não-scroll.
- `createSign` permite Pro com múltiplos signs e qualquer animação válida.
2. Unit/Integration (billing):
- Webhook válido ativa Pro.
- Webhook de cancelamento/expiração rebaixa para Free.
- Assinatura inválida/duplicada não corrompe estado.
3. Integration/UI:
- Form mostra animações Pro bloqueadas no Free.
- Display mostra watermark+QR no Free e oculta no Pro.
- Dashboard exibe badge/CTA correto por plano.
4. DB verification:
- Trigger impede inserts indevidos mesmo fora da server action.
- Policy impede criação anônima.
5. Regressão:
- Fluxo atual de criação/share/delete continua funcional para usuário Pro e Free dentro das regras.

## Assumptions
1. O plano do usuário é derivado de assinatura ativa local (`user_subscriptions`), default `free`.
2. Usuários antigos sem assinatura ativa permanecem `free`.
3. Regra do Free é por usuário autenticado e por quantidade de signs ativos (`1`), não por período.
4. QR aponta para a landing principal (`/`) no V1.
5. V1 não inclui downgrade parcial por recurso; apenas gate global de criação + animação + overlay no display.
