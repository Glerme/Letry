import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--cp-border)] bg-[var(--cp-surface)]/70 p-8 shadow-[var(--cp-shadow)] backdrop-blur-xl sm:p-12">
      <div className="cp-scanline pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative flex flex-col gap-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--cp-border)] bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--cp-cyan)]">
          Letry // Neon Clean
        </div>

        <div className="max-w-3xl space-y-5">
          <h1 className="[font-family:var(--font-orbitron)] text-4xl font-black uppercase leading-[1.02] text-white sm:text-6xl">
            Seu letreiro LED com estética cyberpunk
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 sm:text-xl">
            Crie uma mensagem animada em segundos, ajuste cores, velocidade e compartilhe um link pronto
            para tela, vitrine ou evento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/create" className="cp-button-primary">
            Criar letreiro grátis
          </Link>
          <Link href="/login" className="cp-button-secondary">
            Entrar
          </Link>
        </div>
      </div>
    </section>
  );
};
