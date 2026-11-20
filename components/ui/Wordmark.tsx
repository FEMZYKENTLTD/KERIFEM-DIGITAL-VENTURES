import { BRAND } from '@/lib/site';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Show the "ENTERPRISES" caption beneath FEMZYK. */
  withCaption?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const SIZES = {
  sm: { mark: 'text-lg tracking-[0.2em]', caption: 'text-[0.5rem] tracking-[0.34em]' },
  md: { mark: 'text-2xl tracking-[0.22em]', caption: 'text-[0.55rem] tracking-[0.38em]' },
  lg: { mark: 'text-[2.6rem] tracking-[0.2em]', caption: 'text-[0.65rem] tracking-[0.42em]' },
} as const;

/**
 * FEMZYK wordmark. Gold capital "F" + thin gold rule — deliberately minimal.
 * The brand name is never rendered with a corporate suffix.
 */
export default function Wordmark({ className, withCaption = true, size = 'md' }: Props) {
  const s = SIZES[size];

  return (
    // role="img" + aria-label keeps assistive tech reading the brand name as one
    // word ("FEMZYK ENTERPRISES") instead of "F" + "EMZYK" from the gold initial.
    <span
      role="img"
      aria-label={withCaption ? BRAND.name : BRAND.wordmark}
      className={cn('group/wordmark inline-flex flex-col leading-none', className)}
    >
      <span className={cn('font-display font-semibold text-white', s.mark)}>
        <span className="text-gold transition-colors duration-500 group-hover/wordmark:text-gold-light">
          F
        </span>
        EMZYK
      </span>
      {withCaption ? (
        <span className="relative mt-2 inline-flex flex-col gap-1.5">
          <span
            aria-hidden="true"
            className="h-px w-8 bg-gold/70 transition-all duration-500 ease-luxury group-hover/wordmark:w-14"
          />
          <span className={cn('font-sans font-medium uppercase text-white/55', s.caption)}>
            Enterprises
          </span>
        </span>
      ) : null}
    </span>
  );
}
