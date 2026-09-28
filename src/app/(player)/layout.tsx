import type { ReactNode } from 'react';

/** The player is not a marketing page: no header, no footer, nothing else loads. */
export default function PlayerLayout({ children }: { children: ReactNode }) {
  return <main className="h-dvh overflow-hidden bg-black">{children}</main>;
}
