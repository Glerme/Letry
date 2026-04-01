const features = [
  {
    title: 'Animações prontas para palco',
    description: 'Escolha entre Scroll, Split-Flap e Fade com velocidade ajustável para qualquer distância.',
  },
  {
    title: 'Cores com impacto real',
    description: 'Combine fundo e LED com precisão para vitrine, evento, estúdio ou streaming.',
  },
  {
    title: 'Compartilhamento instantâneo',
    description: 'Gerou, copiou e publicou. Cada letreiro recebe um link único em segundos.',
  },
  {
    title: 'Funciona sem cadastro',
    description: 'Crie e teste livremente. Quando quiser, faça login para organizar seus letreiros.',
  },
] as const;

export const FeaturesSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="cp-heading text-2xl sm:text-3xl">Recursos para dominar o palco</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="cp-panel rounded-2xl border border-[var(--cp-border)] p-6">
            <h3 className="[font-family:var(--font-orbitron)] text-lg font-bold uppercase text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-zinc-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
