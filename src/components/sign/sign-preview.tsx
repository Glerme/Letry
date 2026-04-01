'use client';

import { LEDDisplay } from '@/components/led/led-display';
import type { AnimationType, SpeedType } from '@/lib/utils/constants';

interface SignPreviewProps {
  text: string;
  animation: AnimationType;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
}

export const SignPreview = ({ text, animation, ledColor, bgColor, speed }: SignPreviewProps) => (
  <div className="rounded-xl overflow-hidden border border-zinc-700">
    <LEDDisplay
      text={text}
      animation={animation}
      ledColor={ledColor}
      bgColor={bgColor}
      speed={speed}
    />
  </div>
);
