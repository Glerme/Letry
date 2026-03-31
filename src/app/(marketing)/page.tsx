import Link from 'next/link';

const examples = [
  { text: 'OPEN', color: '#00ff88' },
  { text: 'SALE', color: '#ff6600' },
  { text: 'COFFEE', color: '#ffcc00' },
];

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-12">
      {/* Hero */}
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold text-white leading-tight">
          Letreiros digitais{' '}
          <span className="text-orange-500">animados</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-xl">
          Crie um letreiro LED personalizado, escolha a animação e compartilhe com um link único.
        </p>
        <Link
          href="/create"
          className="rounded-lg bg-orange-500 px-8 py-3 text-lg font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          Criar letreiro grátis
        </Link>
      </div>

      {/* Example signs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {examples.map(({ text, color }) => (
          <div
            key={text}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 flex items-center justify-center"
          >
            <span
              className="text-3xl font-bold tracking-widest font-mono"
              style={{
                color,
                textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full text-left">
        {[
          {
            title: 'Animações',
            desc: 'Scroll, Split-Flap e Fade — escolha o efeito que mais combina.',
          },
          {
            title: 'Cores livres',
            desc: 'Personalize cor do LED e do fundo com qualquer cor hexadecimal.',
          },
          {
            title: 'Link compartilhável',
            desc: 'Cada letreiro tem um URL único. Sem cadastro obrigatório.',
          },
        ].map(({ title, desc }) => (
          <div key={title} className="flex flex-col gap-2">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
