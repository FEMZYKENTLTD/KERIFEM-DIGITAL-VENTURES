import { Intro } from '@/components/Corporate';
import ContactForm from '@/components/ContactForm';
import { pageMetadata } from '@/lib/metadata';
import { CONTACT } from '@/lib/site';
export const metadata = pageMetadata(
  'Request a Quote',
  'Tell KERIFEM DIGITAL VENTURES about your software, web or automation project.',
  '/contact',
);
export default function ContactPage() {
  return (
    <div className="kv-wrap">
      <Intro
        label="PROJECT ENQUIRIES"
        title="Request a Quote"
        copy="Share the problem you want to solve, who will use the solution and any timeline you have in mind."
      />
      <div className="kv-contact kv-bottom">
        <ContactForm />
        <aside className="kv-card">
          <h2>Contact us directly</h2>
          <p>Email</p>
          {Object.values(CONTACT.email).map((email) => (
            <a key={email} href={`mailto:${email}`}>
              {email}
            </a>
          ))}
          <p>WhatsApp</p>
          {Object.values(CONTACT.whatsapp).map((line) => (
            <a key={line.href} href={line.href}>
              {line.display}
            </a>
          ))}
        </aside>
      </div>
    </div>
  );
}
