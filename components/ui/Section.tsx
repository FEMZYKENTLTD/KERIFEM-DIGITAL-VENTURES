import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** When true the section gets a hairline top rule to separate dark blocks. */
  divided?: boolean;
  /** Optional aria-labelledby target — defaults to `${id}-title`. */
  labelledBy?: string | false;
};

/**
 * Canonical section wrapper: semantic <section>, stable anchor id,
 * scroll offset for the sticky nav, and the shared horizontal gutter.
 */
export default function Section({
  id,
  children,
  className,
  divided = false,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy === false ? undefined : (labelledBy ?? `${id}-title`)}
      className={cn(
        'relative isolate scroll-mt-24',
        divided && 'border-t border-white/[0.06]',
        className,
      )}
    >
      {divided ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
        />
      ) : null}
      <div className="container-shell section-shell">{children}</div>
    </section>
  );
}
