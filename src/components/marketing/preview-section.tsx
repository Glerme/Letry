import { LEDDisplay } from '@/components/led/led-display';
import type { AnimationType, LoopModeType, SpeedType } from '@/lib/utils/constants';

const previews: {
  animation: AnimationType;
  label: string;
  description: string;
  text: string;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
  loopMode: LoopModeType;
  accentColor: string;
}[] = [
  {
    animation: 'scroll',
    label: 'Scroll',
    description: 'Rola continuamente da direita para a esquerda.',
    text: 'OPEN 24H',
    ledColor: '#46f6ff',
    bgColor: '#06101e',
    speed: 'normal',
    loopMode: 'infinite',
    accentColor: '#46f6ff',
  },
  {
    animation: 'split-flap',
    label: 'Split-Flap',
    description: 'Revela coluna a coluna como painel de aeroporto.',
    text: 'PROMO 70%',
    ledColor: '#ff49c9',
    bgColor: '#18071a',
    speed: 'normal',
    loopMode: 'infinite',
    accentColor: '#ff49c9',
  },
  {
    animation: 'fade',
    label: 'Fade',
    description: 'Pixels surgem aleatoriamente até o texto aparecer.',
    text: 'COFFEE',
    ledColor: '#c7ff4f',
    bgColor: '#0f1605',
    speed: 'normal',
    loopMode: 'infinite',
    accentColor: '#c7ff4f',
  },
  {
    animation: 'flip',
    label: 'Flip',
    description: 'Embaralha letras individualmente até o resultado final.',
    text: 'SALE 50%',
    ledColor: '#ff6600',
    bgColor: '#1a0a00',
    speed: 'normal',
    loopMode: 'infinite',
    accentColor: '#ff6600',
  },
];

export const PreviewSection = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="cp-heading text-2xl sm:text-3xl">4 animações reais</h2>
        <p className="mt-3 max-w-xl text-zinc-400">
          Cada letreiro é renderizado ao vivo — sem GIFs, sem capturas de tela.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {previews.map((item) => (
          <article
            key={item.animation}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-zinc-950 transition-all duration-300 hover:border-white/16 hover:-translate-y-0.5"
          >
            {/* Preview area */}
            <div
              className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-t-2xl px-6 py-8"
              style={{ backgroundColor: item.bgColor }}
            >
              {/* Subtle vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
              <div className="relative w-full overflow-hidden">
                <LEDDisplay
                  text={item.text}
                  animation={item.animation}
                  ledColor={item.ledColor}
                  bgColor={item.bgColor}
                  speed={item.speed}
                  loopMode={item.loopMode}
                  restartSeconds={null}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start justify-between gap-3 px-5 py-4">
              <div>
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    borderColor: `${item.accentColor}40`,
                    backgroundColor: `${item.accentColor}12`,
                    color: item.accentColor,
                  }}
                >
                  {item.label}
                </span>
                <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
