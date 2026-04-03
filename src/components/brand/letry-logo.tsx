import Image from 'next/image';

interface LetryLogoProps {
  className?: string;
  priority?: boolean;
}

export const LetryLogo = ({ className = '', priority = false }: LetryLogoProps) => (
  <Image
    src="/Letry-L.jpg"
    alt="Logo do Letry"
    width={128}
    height={128}
    priority={priority}
    className={className}
  />
);
