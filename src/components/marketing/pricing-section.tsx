import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Grátis',
    price: 'R$ 0',
    cadence: 'para sempre',
    eyebrow: 'Entrada',
    description: 'Para começar no Brasil com 1 letreiro ativo.',
    perks: ['1 letreiro ativo', 'Animação Scroll', 'Marca d’água + QR para Letry'],
    cta: 'Começar grátis',
    href: '/create',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19',
    cadence: '/mês',
    eyebrow: 'Mais popular',
    description: 'Para quem quer escalar sem limites.',
    perks: ['Letreiros ilimitados', 'Todas as animações', 'Sem marca d’água no display'],
    cta: 'Fazer upgrade',
    href: '/dashboard',
    highlighted: true,
  },
  {
    id: 'pro-yearly',
    name: 'Pro Anual Pix',
    price: 'R$ 190',
    cadence: '/ano',
    eyebrow: 'Economia',
    description: 'Melhor custo-benefício para pagar com Pix.',
    perks: ['Tudo do Pro', 'Pagamento via Pix', 'R$ 15,80/mês no equivalente anual'],
    cta: 'Assinar com Pix',
    href: '/dashboard',
    highlighted: false,
  },
] as const;

export const PricingSection = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="cp-heading text-2xl sm:text-3xl">Planos para cada fase</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Comece no grátis e evolua para Pro com checkout via Abacate Pay.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--cp-border)] bg-[radial-gradient(circle_at_top,rgba(70,246,255,0.13),rgba(7,10,20,0.95)_42%)] p-4 sm:p-6">
        <div className="mb-4 grid gap-3 rounded-2xl border border-white/8 bg-black/20 p-2 text-center text-xs uppercase tracking-[0.16em] text-zinc-300 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--cp-border)] bg-black/35 px-3 py-2">Comece no grátis</div>
          <div className="rounded-xl border border-[var(--cp-cyan)] bg-[var(--cp-cyan)]/10 px-3 py-2 text-[var(--cp-cyan)]">
            Escale no Pro
          </div>
          <div className="rounded-xl border border-[var(--cp-lime)]/40 bg-[var(--cp-lime)]/10 px-3 py-2 text-[var(--cp-lime)]">
            Economize no anual
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`cp-panel relative rounded-2xl border p-6 lg:min-h-[430px] ${
                plan.highlighted
                  ? 'order-1 border-[var(--cp-cyan)] lg:order-2 lg:col-span-6 lg:-translate-y-2 lg:shadow-[0_0_55px_rgba(70,246,255,0.24)]'
                  : plan.id === 'free'
                    ? 'order-2 border-[var(--cp-border)] lg:order-1 lg:col-span-3'
                    : 'order-3 border-[var(--cp-border)] lg:col-span-3'
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
                      plan.highlighted
                        ? 'border-[var(--cp-cyan)]/70 bg-[var(--cp-cyan)]/10 text-[var(--cp-cyan)]'
                        : plan.id === 'pro-yearly'
                          ? 'border-[var(--cp-lime)]/45 bg-[var(--cp-lime)]/10 text-[var(--cp-lime)]'
                          : 'border-[var(--cp-border)] bg-white/5 text-zinc-300'
                    }`}
                  >
                    {plan.eyebrow}
                  </span>
                  <h3 className="mt-3 [font-family:var(--font-orbitron)] text-xl font-bold uppercase text-white sm:text-2xl">
                    {plan.name}
                  </h3>
                  <p className="mt-2 max-w-sm text-zinc-300">{plan.description}</p>
                </div>

                <div className="text-right">
                  <p className="[font-family:var(--font-orbitron)] text-3xl font-black leading-none text-[var(--cp-lime)] sm:text-4xl">
                    {plan.price}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-zinc-300">{plan.cadence}</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-zinc-100">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 block h-1.5 w-1.5 rounded-full ${
                        plan.highlighted ? 'bg-[var(--cp-cyan)]' : 'bg-[var(--cp-magenta)]'
                      }`}
                    />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/8 pt-5">
                <Link
                  href={plan.href}
                  className={`inline-flex w-full justify-center ${
                    plan.highlighted ? 'cp-button-primary' : 'cp-button-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
