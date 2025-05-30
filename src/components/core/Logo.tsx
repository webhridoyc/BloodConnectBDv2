import { Droplet } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 24, textSize = "text-2xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold ${className}`}>
      <Droplet color="hsl(var(--primary))" size={iconSize} />
      <span className={`${textSize} text-primary`}>BloodLink BD</span>
    </Link>
  );
}
