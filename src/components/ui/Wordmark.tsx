import { cn } from '@/lib/cn';
import Image from 'next/image';

export function Wordmark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/fnx-logo.svg"
      alt="FNX"
      width={580}
      height={220}
      className={cn('h-6 w-auto', className)}
    />
  );
}
