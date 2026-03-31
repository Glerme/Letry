// TEMPORARY PLACEHOLDER — will be replaced by real LED renderer in Task 6/8
'use client';

interface LEDDisplayProps {
  text: string;
  animation: string;
  ledColor: string;
  bgColor: string;
  speed: string;
}

export const LEDDisplay = ({ text, ledColor, bgColor, animation: _animation, speed: _speed }: LEDDisplayProps) => (
  <div
    className="flex items-center justify-center overflow-hidden p-8 rounded-lg min-h-[200px]"
    style={{ backgroundColor: bgColor }}
  >
    <span
      className="text-4xl font-bold tracking-widest font-mono"
      style={{
        color: ledColor,
        textShadow: `0 0 10px ${ledColor}, 0 0 20px ${ledColor}`,
      }}
    >
      {text || 'LETRY'}
    </span>
  </div>
);
