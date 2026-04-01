const previews = [
  { text: 'OPEN 24H', led: '#46f6ff', bg: '#06101e', animation: 'Scroll suave' },
  { text: 'PROMO 70%', led: '#ff49c9', bg: '#18071a', animation: 'Split-Flap' },
  { text: 'COFFEE LAB', led: '#c7ff4f', bg: '#0f1605', animation: 'Fade pulsante' },
] as const;

export const PreviewSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="cp-heading text-2xl sm:text-3xl">Preview neon em tempo real</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {previews.map((item) => (
          <article
            key={item.text}
            className="cp-panel group relative overflow-hidden rounded-2xl border border-[var(--cp-border)] p-6 transition-transform duration-300 hover:-translate-y-1"
            style={{ backgroundColor: item.bg }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.13),transparent_48%)]" />
            <div className="relative flex flex-col gap-5">
              <span
                className="[font-family:var(--font-orbitron)] text-3xl font-black uppercase tracking-[0.24em]"
                style={{
                  color: item.led,
                  textShadow: `0 0 8px ${item.led}, 0 0 18px ${item.led}, 0 0 34px ${item.led}`,
                }}
              >
                {item.text}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-300/90">{item.animation}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
