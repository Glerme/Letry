'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { deleteSign } from '@/app/(app)/dashboard/actions';
import type { OwnedSign } from '@/lib/validations/sign';

interface SignCardProps {
  sign: OwnedSign;
}

export const SignCard = ({ sign }: SignCardProps) => {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteSign(sign.id);
    if (!result.success) {
      setDeleteError(result.error);
    }
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="cp-panel flex flex-col gap-3 rounded-xl border border-[var(--cp-border)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1 rounded-lg p-3 font-mono text-sm font-bold tracking-widest truncate"
          style={{
            backgroundColor: sign.bg_color,
            color: sign.led_color,
            textShadow: `0 0 8px ${sign.led_color}`,
          }}
        >
          {sign.text}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-300">
        <span>{sign.animation} · {sign.speed}</span>
        <span>{new Date(sign.created_at).toLocaleDateString('pt-BR')}</span>
      </div>
      {deleteError && (
        <p className="text-xs text-red-400">{deleteError}</p>
      )}
      <div className="flex gap-2">
        <Link
          href={`/s/${sign.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md border border-[var(--cp-border)] px-3 py-1.5 text-center text-xs text-zinc-200 transition-colors hover:border-[rgba(70,246,255,0.75)] hover:text-white"
        >
          Abrir
        </Link>
        {confirmDelete ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>
              Confirmar
            </Button>
          </>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            Deletar
          </Button>
        )}
      </div>
    </div>
  );
};
