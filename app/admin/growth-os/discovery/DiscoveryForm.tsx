'use client';
import { useActionState } from 'react';
import { searchHunter, type DiscoveryState } from '../discovery-actions';

const initial: DiscoveryState = { message: '', companies: [] };
export function DiscoveryForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(searchHunter, initial);
  return <>
    <form action={action} className="profile-form">
      <label>Company search
        <input name="query" minLength={4} maxLength={200} required placeholder="For example: independent retailers in Lagos" />
      </label>
      <p className="field-hint">Your search is sent to Hunter. Do not include sensitive or unnecessary personal information. Hunter says Discover is free, but access and account terms must be verified first.</p>
      <label className="discovery-consent"><input type="checkbox" name="confirm" value="yes" required /> I am authorised to use this information and want to search Hunter.</label>
      <button className="gold-button" disabled={!configured || pending}>{pending ? 'Searching…' : 'Search Hunter companies'}</button>
    </form>
    {state.message && <p role="status" className="muted">{state.message}</p>}
    {state.companies.length > 0 && <div className="timeline">{state.companies.map((company, index) => <div key={`${company.domain}-${index}`}><span className="timeline-dot" /><p><b>{company.name}</b><br />{company.domain}<small>Hunter-supplied company · review independently</small></p></div>)}</div>}
  </>;
}
