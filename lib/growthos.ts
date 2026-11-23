import { z } from 'zod';

export const stages = [
  ['new', 'New'],
  ['researching', 'Researching'],
  ['qualified', 'Qualified'],
  ['contact_identified', 'Contact identified'],
  ['draft_ready', 'Draft ready'],
  ['awaiting_approval', 'Awaiting approval'],
  ['contacted', 'Contacted'],
  ['replied', 'Replied'],
  ['meeting_booked', 'Meeting booked'],
  ['proposal_sent', 'Proposal sent'],
  ['negotiation', 'Negotiation'],
  ['won', 'Won'],
  ['lost', 'Lost'],
  ['not_a_fit', 'Not a fit'],
  ['suppressed', 'Suppressed'],
] as const;
export const stageLabel = (stage: string) => stages.find(([key]) => key === stage)?.[1] || stage;
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (s) => !s || (/^https?:\/\//i.test(s) && z.string().url().safeParse(s).success),
    'Use a complete http or https URL',
  );
export const prospectSchema = z.object({
  name: z.string().trim().min(1).max(160),
  website: optionalUrl,
  industry: z.string().trim().max(120),
  location: z.string().trim().max(160),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((s) => !s || z.string().email().safeParse(s).success),
  email_source: optionalUrl,
  notes: z.string().trim().max(5000),
});
export type Prospect = z.infer<typeof prospectSchema> & {
  id: string;
  stage: string;
  created_at: string;
  updated_at: string;
};
export type Activity = {
  id: number;
  prospect_id: string;
  event: string;
  detail: string;
  created_at: string;
  growth_prospects: { name: string } | null;
};
