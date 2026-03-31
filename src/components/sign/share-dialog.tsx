'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShareDialogProps {
  slug: string | null;
  onClose: () => void;
}

export const ShareDialog = ({ slug, onClose }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = slug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${slug}`
    : '';

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={Boolean(slug)}
      onClose={onClose}
      title="Seu letreiro está pronto!"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-400">
          Compartilhe este link para exibir seu letreiro:
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
          <span className="flex-1 truncate text-sm text-zinc-200 font-mono">
            {shareUrl}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
            className="flex-1"
          >
            {copied ? '✓ Copiado!' : 'Copiar link'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.open(shareUrl, '_blank')}
          >
            Abrir
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
