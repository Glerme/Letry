import Link from 'next/link';

export const Watermark = () => (
  <div className="fixed bottom-4 right-4 z-40">
    <Link
      href="/"
      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-mono"
    >
      letry.app
    </Link>
  </div>
);
