import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cases } from '@/lib/cases';
import { work } from '@/lib/corporate';
import { Intro, Quote } from '@/components/Corporate';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ project: string }> };
export const generateStaticParams = () => cases.map(({ id }) => ({ project: id }));
function load(id: string) {
  const index = cases.findIndex((item) => item.id === id);
  if (index < 0) notFound();
  return { study: cases[index], project: work[index] };
}
export async function generateMetadata({ params }: Props) {
  const { project, study } = load((await params).project);
  return pageMetadata(project.title, project.copy, `/portfolio/${study.id}`);
}
export default async function CasePage({ params }: Props) {
  const { project, study } = load((await params).project);
  return (
    <div className="kv-wrap kv-bottom">
      <Intro label={project.category} title={project.title} copy={project.copy} />
      <p className="kv-label">{study.status}</p>
      <div className="kv-story">
        <section>
          <h2>The problem</h2>
          <p>{study.problem}</p>
        </section>
        <section>
          <h2>The implementation</h2>
          <p>{study.solution}</p>
          <p>{study.contribution}</p>
          <p>{project.stack}</p>
          <ul className="list-disc pl-5">
            {study.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className="kv-shot-grid">
        {project.shots.map(([src, caption]) => (
          <figure key={src}>
            <a href={src} className="kv-project-image">
              <Image
                src={src}
                alt={caption}
                fill
                sizes="(max-width: 760px) 90vw, 400px"
                style={{ objectFit: 'contain' }}
              />
            </a>
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="kv-links">
        <a href={project.repo}>Source repository</a>
        {'live' in study && <a href={study.live}>Visit the Fleet web edition</a>}
        <Link href="/portfolio">All projects</Link>
        <Quote />
      </div>
    </div>
  );
}
