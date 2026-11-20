import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
};

/** Section title block: gold eyebrow, serif heading, optional lead paragraph. */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'center',
  className,
}: Props) {
  const centered = align === 'center';

  return (
    <Reveal className={cn('relative', className)}>
      <div className={cn('flex flex-col gap-4', centered && 'items-center text-center')}>
        {eyebrow ? (
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
            {eyebrow}
            {centered ? <span aria-hidden="true" className="h-px w-8 bg-gold/60" /> : null}
          </p>
        ) : null}

        <h2 id={id} className="max-w-3xl text-balance text-display font-semibold text-white">
          {title}
        </h2>

        {lead ? <p className="max-w-2xl text-pretty text-lede text-fog">{lead}</p> : null}
      </div>
    </Reveal>
  );
}
