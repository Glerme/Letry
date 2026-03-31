'use client';

import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const FullscreenButton = () => {
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [toggleFullscreen]);

  return (
    <Button
      onClick={toggleFullscreen}
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 opacity-30 hover:opacity-100"
    >
      Tela cheia (F)
    </Button>
  );
};
