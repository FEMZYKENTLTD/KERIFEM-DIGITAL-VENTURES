import { Intro } from '@/components/Corporate';
import ContactForm from '@/components/ContactForm';
import { pageMetadata } from '@/lib/metadata';
import { CONTACT } from '@/lib/site';
import { services } from '@/lib/services';
export const metadata = pageMetadata(
  'Request a Quote',
  'Tell KERIFEM DIGITAL VENTURES about your software, web or automation project.',
  '/contact',
);
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const selected = services.find(([id]) => id === service)?.[1];
  return (
    <div className="kv-wrap">
      <Intro
        label="PROJECT ENQUIRIES"
        title="Request a Quote"
        copy="Share the problem you want to solve, who will use the solution and any timeline you have in mind."
      />
      <div className="kv-contact kv-bottom">
        <ContactForm key={selected} initialService={selected} />
        <aside className="kv-card">
          <h2>Contact us directly</h2>
          <p>Email</p>
          {Object.entries(CONTACT.email).map(([role, email]) => (
            <a key={email} href={`mailto:${email}`}>
              {role === 'primary' ? 'Primary' : 'Alternative'}: {email}
            </a>
          ))}
          <p>WhatsApp</p>
          {Object.entries(CONTACT.whatsapp).map(([role, line]) => (
            <a key={line.href} href={line.href}>
              {role === 'primary' ? 'Primary' : 'Alternative'}: {line.display}
            </a>
          ))}
        </aside>
      </div>
    </div>
  );
}
