import { z } from 'zod';
import { BUDGET_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS, TIMELINES } from './content';
export const MIN_MESSAGE = 20;
export const MAX_MESSAGE = 4000;

const oneOf = (options: readonly string[], message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => options.includes(value), message);

export const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter your full name.')
      .max(120, 'That name looks too long — please keep it under 120 characters.'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required.')
      .max(254)
      .email('Enter a valid email address, e.g. you@company.com.'),
    phone: z
      .string()
      .trim()
      .min(7, 'Add a phone or WhatsApp number we can reach you on.')
      .max(24, 'That number looks too long — include the country code only.')
      .regex(/^\+?[\d][\d\s\-()]*$/, 'Use digits, spaces, +, - or ( ) only.'),
    country: z.string().trim().min(2, 'Enter your country.').max(100),
    projectTitle: z.string().trim().max(160).optional(),
    timeline: oneOf(TIMELINES, 'Select a preferred timeline.'),
    reference: z
      .string()
      .trim()
      .max(500)
      .refine(
        (value) =>
          !value || (/^https?:\/\//i.test(value) && z.string().url().safeParse(value).success),
        'Enter a valid http or https link.',
      )
      .optional(),
    service: oneOf(SERVICE_OPTIONS, 'Select the service you need.'),
    message: z
      .string()
      .trim()
      .min(MIN_MESSAGE, `Please describe your project in at least ${MIN_MESSAGE} characters.`)
      .max(MAX_MESSAGE, `Please keep the description under ${MAX_MESSAGE} characters.`),
    budget: z
      .string()
      .optional()
      .refine(
        (value) => !value || BUDGET_OPTIONS.includes(value as (typeof BUDGET_OPTIONS)[number]),
        'Select a valid budget range.',
      ),
    contactMethod: oneOf(CONTACT_METHODS, 'Let us know how you prefer to be contacted.'),
    /** Honeypot — must stay empty or the submission is silently dropped. */
    botcheck: z.string().max(0).optional(),
  })
  .refine((data) => !data.botcheck, { path: ['botcheck'], message: 'Spam detected.' });

export type FormValues = z.infer<typeof schema>;
