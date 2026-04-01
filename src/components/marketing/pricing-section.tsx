import Link from 'next/link';

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    description: 'Para criar e compartilhar agora.',
    perks: ['Criação sem cadastro', '3 animações LED', 'Link público instantâneo'],
    cta: 'Começar grátis',
    href: '/create',
    highlighted: true,
  },
  {
    name: 'Pro (em breve)',
    price: 'Em breve',
    description: 'Para times, campanhas e escala.',
    perks: ['Biblioteca de presets', 'Organização avançada', 'Recursos premium em lançamento'],
    cta: 'Criar no grátis',
    href: '/create',
    highlighted: false,
  },
] as const;

export const PricingSection = () => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="cp-heading text-2xl sm:text-3xl">Planos para cada fase</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Comece no plano grátis e evolua quando o Pro estiver disponível. Sem cartão nesta etapa.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`cp-panel rounded-2xl border p-6 ${
              plan.highlighted
                ? 'border-[var(--cp-cyan)] shadow-[0_0_36px_rgba(70,246,255,0.25)]'
                : 'border-[var(--cp-border)]'
            }`}
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h3 className="[font-family:var(--font-orbitron)] text-xl font-bold uppercase text-white">{plan.name}</h3>
                <p className="mt-1 text-zinc-300">{plan.description}</p>
              </div>
              <span className="[font-family:var(--font-orbitron)] text-2xl font-black text-[var(--cp-lime)]">
                {plan.price}
              </span>
            </div>

            <ul className="space-y-2 text-zinc-200">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-[var(--cp-magenta)]" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <Link href={plan.href} className="cp-button-secondary mt-6 inline-flex w-full justify-center">
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
