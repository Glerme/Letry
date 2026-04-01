'use client';

import { useEffect, useRef, useState } from 'react';
import type { LoopModeType, SpeedType } from '@/lib/utils/constants';
import { FLIP_SCRAMBLE_STEPS, FLIP_TIMINGS, getFlipCycleDurationMs } from './loop-utils';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-';

interface FlipTileProps {
  targetChar: string;
  ledColor: string;
  bgColor: string;
  charIndex: number;
  speed: SpeedType;
}

const FlipTile = ({ targetChar, ledColor, bgColor, charIndex, speed }: FlipTileProps) => {
  const [displayChar, setDisplayChar] = useState('\u00A0');
  const [animClass, setAnimClass] = useState('');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const timings = FLIP_TIMINGS[speed];
    const delay = charIndex * timings.stagger;
    const totalSteps = FLIP_SCRAMBLE_STEPS + Math.floor(Math.random() * 4);
    let step = 0;
    let cancelled = false;

    const addTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(() => { if (!cancelled) fn(); }, ms);
      timeoutsRef.current.push(id);
    };

    const flip = (nextChar: string, onDone?: () => void) => {
      setAnimClass(`flip-tile-out-${speed}`);
      addTimeout(() => {
        setDisplayChar(nextChar === ' ' ? '\u00A0' : nextChar);
        setAnimClass(`flip-tile-in-${speed}`);
        addTimeout(() => {
          setAnimClass('');
          onDone?.();
        }, timings.half);
      }, timings.half);
    };

    const runStep = () => {
      if (step < totalSteps) {
        const randChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        flip(randChar, () => {
          step++;
          addTimeout(runStep, timings.stepGap);
        });
      } else {
        flip(targetChar);
      }
    };

    addTimeout(runStep, delay);

    return () => {
      cancelled = true;
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [targetChar, charIndex, speed]);

  return (
    <div
      style={{
        width: 'clamp(26px, 2.8vw, 46px)',
        height: 'clamp(34px, 3.8vw, 60px)',
        perspective: '400px',
        backgroundColor: '#0a0a0a',
        borderRadius: '3px',
        flexShrink: 0,
      }}
    >
      <div
        className={animClass}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
          borderRadius: '2px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          transformOrigin: 'center',
        }}
      >
        <span
          style={{
            fontSize: 'clamp(13px, 1.6vw, 26px)',
            fontWeight: 700,
            color: ledColor,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            lineHeight: 1,
            textShadow: `0 0 8px ${ledColor}`,
          }}
        >
          {displayChar}
        </span>
        {/* Horizontal mechanical seam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

interface FlipDisplayProps {
  text: string;
  ledColor: string;
  bgColor: string;
  speed: SpeedType;
  loopMode: LoopModeType;
  restartSeconds: number | null;
}

export const FlipDisplay = ({
  text,
  ledColor,
  bgColor,
  speed,
  loopMode,
  restartSeconds,
}: FlipDisplayProps) => {
  const chars = (text || ' ').toUpperCase().split('');
  const [cycleKey, setCycleKey] = useState(0);
  const restartRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (restartRef.current) {
      clearInterval(restartRef.current);
      restartRef.current = null;
    }

    if (loopMode === 'once') return;

    if (loopMode === 'restart' && restartSeconds !== null) {
      restartRef.current = setInterval(() => {
        setCycleKey((prev) => prev + 1);
      }, restartSeconds * 1000);
      return () => {
        if (restartRef.current) clearInterval(restartRef.current);
      };
    }

    const durationMs = getFlipCycleDurationMs(text, speed);
    restartRef.current = setInterval(() => {
      setCycleKey((prev) => prev + 1);
    }, durationMs);

    return () => {
      if (restartRef.current) clearInterval(restartRef.current);
    };
  }, [loopMode, restartSeconds, text, speed]);

  return (
    <div
      className="flex items-center justify-center p-4 rounded-lg min-h-[120px]"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div style={{ display: 'flex', gap: 'clamp(2px, 0.3vw, 4px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {chars.map((char, i) => (
          <FlipTile
            key={`${cycleKey}-${i}`}
            targetChar={char}
            ledColor={ledColor}
            bgColor={bgColor}
            charIndex={i}
            speed={speed}
          />
        ))}
      </div>
    </div>
  );
};
