const faqItems = [
  {
    question: 'Preciso criar conta para usar?',
    answer: 'Não. Você pode criar letreiros sem login e compartilhar o link na hora.',
  },
  {
    question: 'Os letreiros expiram?',
    answer: 'Não. Os links públicos continuam disponíveis para uso contínuo.',
  },
  {
    question: 'Posso usar no celular e na TV?',
    answer: 'Sim. O link abre em qualquer tela moderna com navegador.',
  },
  {
    question: 'O plano Pro já está ativo?',
    answer: 'Ainda não. Nesta fase, o foco é liberar criação gratuita com ótima experiência.',
  },
] as const;

export const FAQSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="cp-heading text-2xl sm:text-3xl">Perguntas frequentes</h2>
      <div className="grid gap-4">
        {faqItems.map((item) => (
          <article key={item.question} className="cp-panel rounded-2xl border border-[var(--cp-border)] p-5">
            <h3 className="[font-family:var(--font-orbitron)] text-base font-bold uppercase text-white">
              {item.question}
            </h3>
            <p className="mt-2 text-zinc-300">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
