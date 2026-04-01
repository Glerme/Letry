import Link from 'next/link';
import Image from 'next/image';

export const Watermark = () => (
  <div className="pointer-events-none rounded-2xl border border-white/20 bg-black/35 px-8 py-4 text-center backdrop-blur-sm">
    <p className="text-4xl font-black uppercase tracking-[0.28em] text-white/70 sm:text-6xl">LETRY</p>
    <p className="mt-2 text-sm text-zinc-200/90">Crie o seu letreiro em letry.app</p>
  </div>
);

interface DisplayQrCodeProps {
  qrCodeDataUrl: string;
}

export const DisplayQrCode = ({ qrCodeDataUrl }: DisplayQrCodeProps) => (
  <div className="pointer-events-auto z-50 mt-4">
    <Link href="/" aria-label="Abrir landing do Letry">
      <Image
        src={qrCodeDataUrl}
        alt="QR Code para landing do Letry"
        width={112}
        height={112}
        className="rounded-md bg-white p-1 shadow-lg shadow-black/40"
      />
    </Link>
  </div>
);
