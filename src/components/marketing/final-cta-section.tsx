import Link from 'next/link';

export const FinalCTASection = () => {
  return (
    <section className="cp-panel relative overflow-hidden rounded-3xl border border-[var(--cp-border)] p-8 sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(70,246,255,0.2),transparent_50%),radial-gradient(circle_at_85%_100%,rgba(255,73,201,0.2),transparent_55%)]" />

      <div className="relative flex flex-col gap-6 text-center sm:items-center">
        <h2 className="cp-heading text-2xl sm:text-4xl">Pronto para acender sua mensagem?</h2>
        <p className="max-w-2xl text-zinc-200">
          Crie seu letreiro agora, sem cadastro obrigatório, e publique com um link em menos de um minuto.
        </p>
        <Link href="/create" className="cp-button-primary">
          Criar letreiro grátis
        </Link>
      </div>
    </section>
  );
};
