# Letry — Plano de Monetização (B2C + PME)

**Data:** 2026-04-01  
**Objetivo:** definir, de forma executável, plataforma de pagamento, preços, estratégia por fase e plano de experimentos para os próximos 90 dias.

---

## 1. Resumo Executivo

Decisão recomendada para o lançamento:

1. **Modelo comercial V1:** `freemium + assinatura` com upsell transacional.
2. **Plataforma de pagamento V1 (Brasil):** `Abacate Pay Assinaturas` (Pix/cartão/boleto) para maximizar conversão local.
3. **Plataforma V1.5 (internacional):** `Stripe Billing` para clientes fora do Brasil e cartões globais.
4. **Plataforma V2 (escala internacional):** avaliar `Lemon Squeezy` ou `Paddle` como Merchant of Record (MoR) para reduzir esforço de compliance tributário global.

Motivação principal:

- O Letry atende **misto B2C + PME**, com maioria inicial no Brasil.
- Pix e boleto reduzem fricção para pagamento local.
- No curto prazo, a prioridade é equilíbrio entre crescimento e receita; no médio prazo, simplificar expansão internacional.

---

## 2. Comparativo de Plataformas

### Stripe

**Quando usar:** internacionalização, cartões globais, stack técnica madura para SaaS.  
**Prós:**

- Billing robusto para recorrência, dunning e portal de cliente.
- Forte ecossistema de APIs/documentação.
- Suporta Pix na plataforma global de pagamentos.

**Limites:**

- Não resolve sozinho carga de MoR global por padrão.
- Para Brasil-first, tende a perder conversão se checkout local estiver pior que opções nativas.

### Abacate Pay

**Quando usar:** Brasil-first, necessidade de Pix/cartão/boleto no lançamento.  
**Prós:**

- Forte aderência local (Pix e boleto).
- Assinaturas disponíveis para BR.
- Boa confiança de marca para público local.

**Limites:**

- Menos conveniente para expansão internacional em escala.
- Taxas e condições variam por conta/prazo; exige governança de pricing por dashboard.

### Lemon Squeezy (MoR)

**Quando usar:** fase de expansão global com necessidade de simplificar imposto/VAT/sales tax.  
**Prós:**

- Modelo MoR reduz complexidade fiscal internacional.
- Estrutura pensada para produtos digitais e SaaS.

**Limites:**

- Fee de plataforma geralmente maior que gateway puro.
- Pode reduzir margem em tickets baixos no começo.

### Paddle (MoR)

**Quando usar:** cenário similar ao Lemon Squeezy, com foco em compliance global e operação SaaS.  
**Prós:**

- Posicionamento forte em MoR para SaaS.
- Checkout e billing com foco em expansão internacional.

**Limites:**

- Custo efetivo pode ser superior ao modelo gateway-only.
- Necessita validação de elegibilidade/comercial conforme estágio da empresa.

### Decisão por cenário

1. **Agora (Brasil e validação):** Abacate Pay.
2. **Curto prazo internacional:** Stripe Billing em trilha paralela.
3. **Escala internacional + compliance:** piloto com Lemon Squeezy ou Paddle.

---

## 3. Estratégia de Monetização por Fase

## V1 (0-3 meses)

**Objetivo:** converter base brasileira com menor fricção.

1. Lançar plano Free com watermark e limites funcionais.
2. Lançar assinatura `Creator Pro` e `Business`.
3. Adicionar paywall leve nos recursos premium (sem bloquear criação básica).
4. Medir conversão por método de pagamento (Pix vs cartão vs boleto).

## V1.5 (3-6 meses)

**Objetivo:** abrir trilha internacional e aumentar ticket anual.

1. Stripe Billing para usuários internacionais.
2. Plano anual com incentivo (desconto efetivo ~2 meses).
3. Portal de assinatura para troca/cancelamento (reduz carga manual).

## V2 (6+ meses, condicionado a tração)

**Objetivo:** simplificar operação fiscal global e ampliar margem de escala.

1. Avaliar MoR (Lemon Squeezy/Paddle) para novos mercados.
2. Definir estratégia híbrida BR local + internacional MoR, se necessário.
3. Revisar preços por região (PPP leve) sem quebrar simplicidade comercial.

---

## 4. Tabela de Planos e Preços (BRL/USD)

**Âncora comercial:** BRL  
**Referência cambial usada neste documento:** `US$1 = R$5,26` em 2026-04-01 (USD/BRL histórico de março/2026 como base operacional).

| Plano/Oferta                   |     Preço BRL | Referência USD | Público         | Justificativa                              |
| ------------------------------ | ------------: | -------------: | --------------- | ------------------------------------------ |
| Free                           |           R$0 |           US$0 | Aquisição       | Maximiza topo de funil e compartilhamento  |
| Creator Pro mensal             |  **R$19/mês** |       ~US$3.99 | Criadores       | Ticket acessível para conversão inicial    |
| Creator Pro anual              | **R$190/ano** |      ~US$36.12 | Criadores       | Melhora caixa e reduz churn                |
| Business (1 tela) mensal       |  **R$49/mês** |       ~US$9.99 | PME             | Abaixo de plataformas clássicas de signage |
| Business (1 tela) anual        | **R$490/ano** |      ~US$93.16 | PME             | Incentivo de permanência anual             |
| Tela adicional PME             |  **R$12/mês** |       ~US$2.49 | PME multi-tela  | Expansão simples de conta sem novo plano   |
| Upsell export básico           |    **R$9,90** |       ~US$1.99 | B2C/uso pontual | Monetização transacional de demanda social |
| Lifetime lançamento (limitado) |     **R$149** |      ~US$28.33 | Early adopters  | Caixa rápido e prova social inicial        |

### Benchmark de posicionamento

Plataformas de signage tradicionais frequentemente operam com ticket por tela superior ao plano inicial do Letry (ex.: ScreenCloud e Yodeck), o que abre espaço para posicionamento de entrada agressivo no Brasil.

---

## 5. Unit Economics Simples (estimativa)

Como taxas variam por método, prazo e negociação, usar três cenários para decisão:

- **Cenário A (eficiente):** 3,5% custo transacional total
- **Cenário B (base):** 5,0% custo transacional total
- **Cenário C (conservador):** 8,0% custo transacional total

Fórmula:

`Receita líquida estimada = Preço bruto × (1 - taxa transacional total)`

| Oferta             | Preço bruto | Líquido A (3,5%) | Líquido B (5,0%) | Líquido C (8,0%) |
| ------------------ | ----------: | ---------------: | ---------------: | ---------------: |
| Creator Pro mensal |     R$19,00 |          R$18,34 |          R$18,05 |          R$17,48 |
| Business mensal    |     R$49,00 |          R$47,29 |          R$46,55 |          R$45,08 |
| Tela adicional     |     R$12,00 |          R$11,58 |          R$11,40 |          R$11,04 |
| Upsell export      |      R$9,90 |           R$9,55 |           R$9,41 |           R$9,11 |
| Lifetime           |    R$149,00 |         R$143,79 |         R$141,55 |         R$137,08 |

**Leitura prática:** mesmo no cenário conservador, os preços recomendados sustentam margem para produto digital de baixo custo marginal.  
**Ação obrigatória:** validar taxa real por método de pagamento e prazo de recebimento no dashboard antes de publicar a página final de pricing.

---

## 6. Experimentos de Monetização (90 dias)

## Experimento 1 — Paywall de recursos premium

1. Hipótese: remover watermark e liberar recursos premium aumenta conversão sem matar aquisição.
2. Variação A: paywall após criação.
3. Variação B: paywall antes da criação final.
4. Métrica primária: `free → paid conversion`.
5. Guarda-corpo: queda de criação total < 10%.

## Experimento 2 — Incentivo anual

1. Hipótese: plano anual melhora receita e reduz churn involuntário.
2. Oferta: anual com desconto equivalente a ~2 meses.
3. Métricas: `% novas assinaturas anuais`, `MRR`, `churn mensal`.

## Experimento 3 — Upsell transacional de export

1. Hipótese: público de uso pontual aceita compra avulsa sem entrar em assinatura.
2. Oferta: pacote básico de export por R$9,90.
3. Métricas: `take rate do upsell`, `ARPU total`, `receita não recorrente`.

## Experimento 4 — Oferta de lançamento (lifetime limitado)

1. Hipótese: lifetime gera caixa inicial e prova social sem canibalizar recorrência.
2. Limite operacional: janela curta (ex.: 14 dias) ou lote de vagas.
3. Métricas: `cash-in`, `% canibalização de assinatura mensal`, `NPS inicial`.

### Métricas obrigatórias do painel de monetização

1. Conversão `free → paid` (geral e por segmento).
2. Churn mensal (logo e receita).
3. ARPU (por plano).
4. Receita por método de pagamento (Pix/cartão/boleto).
5. Participação de anual vs mensal.

---

## 7. Riscos e Gatilhos de Mudança de Plataforma

### Riscos principais

1. Dependência de uma única adquirência no Brasil.
2. Fricção internacional se expansão começar antes da trilha Stripe.
3. Margem pressionada em tickets baixos se custo transacional real subir.
4. Complexidade fiscal internacional ao crescer sem MoR.

### Gatilhos objetivos

Migrar/adicionar camada internacional quando ocorrer ao menos um:

1. > 20% da receita vindo de fora do Brasil por 2 meses consecutivos.
2. Time gastar >8h/semana com operação manual fiscal/cobrança internacional.
3. Queda de conversão internacional >25% vs Brasil por limitação de meios de pagamento.

---

## 8. Decisão Operacional para Engenharia (ordem de integração)

## Fase técnica V1 (Brasil)

1. Implementar integração de assinatura com Abacate Pay.
2. Instrumentar eventos de pagamento e assinatura (create, renew, cancel, fail).
3. Expor plano atual do usuário no app (gating de recursos premium).
4. Implementar tracking de receita por método de pagamento.

## Fase técnica V1.5 (internacional)

1. Implementar Stripe Billing para novo checkout internacional.
2. Separar rota/checkout por região ou moeda.
3. Garantir unificação de métricas no mesmo painel interno.

## Fase técnica V2 (escala global)

1. Rodar piloto MoR (Lemon Squeezy ou Paddle) com coorte limitada.
2. Comparar conversão, margem líquida e esforço operacional.
3. Definir arquitetura final (híbrida ou consolidada) com base em dados.

---

## 9. Fontes

1. Stripe Pricing: https://stripe.com/us/pricing
2. Stripe Billing: https://stripe.com/en-br/billing
3. Lemon Squeezy (Sales Tax/VAT): https://docs.lemonsqueezy.com/help/payments/sales-tax-vat
4. Paddle SaaS Billing (MoR): https://www.paddle.com/solutions/saas-billing
5. Abacate Pay Checkout: https://docs.abacatepay.com/pages/payment/create
6. Abacate Pay Webhooks: https://docs.abacatepay.com/pages/webhooks
7. ScreenCloud Pricing: https://screencloud.com/pricing
8. Yodeck pricing docs: https://www.yodeck.com/docs/user-manual/how-is-yodeck-priced/
9. Referência cambial USD/BRL (histórico): https://www.investing.com/currencies/usd-brl-historical-data?cid=965081
