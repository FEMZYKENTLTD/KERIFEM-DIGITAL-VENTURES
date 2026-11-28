'use server';
import { requireOwner } from '@/lib/admin-auth';
import { discoverCompanies, hunterQuery, HunterError, type HunterCompany } from '@/lib/growth/hunter';

export type DiscoveryState = { message: string; companies: HunterCompany[] };
export async function searchHunter(_previous: DiscoveryState, fields: FormData): Promise<DiscoveryState> {
  const db = await requireOwner();
  const empty = (message: string) => ({ message, companies: [] });
  const query = hunterQuery.safeParse(fields.get('query'));
  if (!query.success || fields.get('confirm') !== 'yes') return empty('Enter a search and confirm the conditions below.');
  if (!process.env.HUNTER_API_KEY || process.env.HUNTER_FREE_DISCOVERY_ENABLED !== 'true')
    return empty('Hunter discovery is not configured and enabled on the server.');
  // Fail closed if the audited, database-backed limiter is unavailable. Never call
  // Hunter unless a request slot was durably recorded first.
  const start = await db.rpc('growth_begin_discovery');
  if (start.error || start.data !== true) return empty('Discovery is unavailable or rate limited. Check setup or try later.');
  try {
    const companies = await discoverCompanies(query.data, process.env.HUNTER_API_KEY);
    return { message: companies.length ? 'Provider results need independent review. No contacts were verified or saved.' : 'No companies returned. Try a different search.', companies };
  } catch (error) {
    const code = error instanceof HunterError ? error.code : 'unavailable';
    return empty(code === 'denied' ? 'Hunter rejected access or the plan does not support discovery.' : code === 'limited' ? 'Hunter usage limit reached.' : 'Hunter discovery failed; no results were saved.');
  }
}
