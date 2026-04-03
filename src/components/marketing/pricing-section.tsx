import Link from 'next/link';

const plans = [
  {
    id: 'free',
    name: 'Grátis',
    price: 'R$ 0',
    cadence: 'para sempre',
    eyebrow: 'Entrada',
    description: 'Para começar no Brasil com 1 letreiro ativo.',
    perks: ['1 letreiro ativo', 'Animação Scroll', "Marca d'água + QR para Letry"],
    cta: 'Começar grátis',
    href: '/create',
    highlighted: false,
    accentVar: '--cp-magenta',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19',
    cadence: '/mês',
    eyebrow: 'Mais popular',
    description: 'Para quem quer escalar sem limites.',
    perks: ['Letreiros ilimitados', 'Todas as animações', "Sem marca d'água no display"],
    cta: 'Fazer upgrade',
    href: '/dashboard',
    highlighted: true,
    accentVar: '--cp-cyan',
  },
  {
    id: 'pro-yearly',
    name: 'Pro Anual Pix',
    price: 'R$ 190',
    cadence: '/ano',
    eyebrow: 'Economia',
    description: 'Melhor custo-benefício para pagar com Pix.',
    perks: ['Tudo do Pro', 'Pagamento via Pix', 'R$ 15,80/mês equivalente'],
    cta: 'Assinar com Pix',
    href: '/dashboard',
    highlighted: false,
    accentVar: '--cp-lime',
  },
] as const;

export const PricingSection = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="cp-heading text-2xl sm:text-3xl">Planos para cada fase</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Comece no grátis e evolua para Pro com checkout via Abacate Pay.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`cp-panel relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
              plan.highlighted
                ? 'border-[var(--cp-cyan)] shadow-[0_0_48px_rgba(70,246,255,0.18)] hover:shadow-[0_0_64px_rgba(70,246,255,0.28)]'
                : 'border-[var(--cp-border)] hover:border-white/20'
            }`}
          >
            {/* Eyebrow */}
            <span
              className="mb-4 inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: `color-mix(in srgb, var(${plan.accentVar}) 45%, transparent)`,
                backgroundColor: `color-mix(in srgb, var(${plan.accentVar}) 12%, transparent)`,
                color: `var(${plan.accentVar})`,
              }}
            >
              {plan.eyebrow}
            </span>

            {/* Price */}
            <div className="mb-1">
              <span
                className="[font-family:var(--font-orbitron)] text-4xl font-black leading-none"
                style={{ color: `var(${plan.accentVar})` }}
              >
                {plan.price}
              </span>
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-zinc-500">{plan.cadence}</p>

            {/* Name + description */}
            <h3 className="mb-1 [font-family:var(--font-orbitron)] text-lg font-bold uppercase text-white">
              {plan.name}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">{plan.description}</p>

            {/* Perks */}
            <ul className="mb-8 flex-1 space-y-2.5">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <span
                    className="mt-[5px] block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(${plan.accentVar})` }}
                  />
                  {perk}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={plan.href}
              className={`inline-flex w-full justify-center ${
                plan.highlighted ? 'cp-button-primary' : 'cp-button-secondary'
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
