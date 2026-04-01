'use client';

import { LEDDisplay } from '@/components/led/led-display';
import type { AnimationType, LoopModeType, SpeedType } from '@/lib/utils/constants';

interface SignPreviewProps {
  text: string;
  animation: AnimationType;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
  loopMode: LoopModeType;
  restartSeconds: number | null;
}

export const SignPreview = ({
  text,
  animation,
  ledColor,
  bgColor,
  speed,
  loopMode,
  restartSeconds,
}: SignPreviewProps) => (
  <div className="rounded-xl overflow-hidden border border-zinc-700">
    <LEDDisplay
      text={text}
      animation={animation}
      ledColor={ledColor}
      bgColor={bgColor}
      speed={speed}
      loopMode={loopMode}
      restartSeconds={restartSeconds}
    />
  </div>
);
