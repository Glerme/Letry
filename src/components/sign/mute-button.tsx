'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { isMuted, setMuted } from '@/components/led/flip-audio';

export const MuteButton = () => {
  const [muted, setMutedState] = useState(isMuted);

  const toggle = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') toggle();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [toggle]);

  return (
    <Button
      onClick={toggle}
      variant="ghost"
      size="sm"
      className="fixed top-4 right-28 z-50 opacity-30 hover:opacity-100"
    >
      {muted ? 'Som (M)' : 'Mudo (M)'}
    </Button>
  );
};
