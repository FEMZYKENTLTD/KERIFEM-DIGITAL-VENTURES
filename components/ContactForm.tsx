'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Check, Loader2, Send } from 'lucide-react';

import { BUDGET_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS } from '@/lib/content';
import { CONTACT, WEB3FORMS_ACCESS_KEY } from '@/lib/site';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

const MIN_MESSAGE = 20;
const MAX_MESSAGE = 4000;

const oneOf = (options: readonly string[], message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => options.includes(value), message);

const schema = z
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
      .email('Enter a valid email address, e.g. you@company.com.'),
    phone: z
      .string()
      .trim()
      .min(7, 'Add a phone or WhatsApp number we can reach you on.')
      .max(24, 'That number looks too long — include the country code only.')
      .regex(/^\+?[\d][\d\s\-()]*$/, 'Use digits, spaces, +, - or ( ) only.'),
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

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  budget: '',
  contactMethod: '',
  botcheck: '',
};

/* -------------------------------------------------------------------------- */
/* Web3Forms submission                                                        */
/* -------------------------------------------------------------------------- */

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';

async function submitToWeb3Forms(values: FormValues): Promise<boolean> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'New Project Enquiry — FEMZYK ENTERPRISES',
      from_name: 'FEMZYK ENTERPRISES Website',
      // Reply-to so the enquiry can be answered from the inbox directly.
      replyto: values.email,
      botcheck: values.botcheck ?? '',
      // Structured fields for the notification email.
      Name: values.name,
      Email: values.email,
      'Phone / WhatsApp': values.phone,
      'Service Required': values.service,
      'Project Description': values.message,
      'Budget Range': values.budget || 'Not provided',
      'Preferred Contact Method': values.contactMethod,
      // Plain-text fallback in case the notification template is customised.
      message: `New enquiry from ${values.name}\n\nService: ${values.service}\nBudget: ${
        values.budget || 'Not provided'
      }\nPreferred contact: ${values.contactMethod}\n\n${values.message}`,
    }),
  });

  if (!response.ok) return false;
  const data: unknown = await response.json().catch(() => null);
  return Boolean(
    data && typeof data === 'object' && (data as { success?: boolean }).success === true,
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [invalidNotice, setInvalidNotice] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    // RHF's generic expects the *output* type of the schema; the cast keeps the
    // resolver types aligned without reaching for `any`.
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    mode: 'onTouched',
    defaultValues: EMPTY,
  });

  const messageLength = watch('message').trim().length;
  const showStatus = status === 'success' || status === 'error' || status === 'unconfigured';

  /* Reset the inline status whenever the visitor edits after an error. */
  useEffect(() => {
    if (status === 'error' || status === 'unconfigured') setStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirtyFields.name, dirtyFields.email, dirtyFields.message]);

  const onValid = async (values: FormValues) => {
    setInvalidNotice(false);

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('unconfigured');
      return;
    }

    setStatus('submitting');
    try {
      const ok = await submitToWeb3Forms(values);
      if (ok) {
        setStatus('success');
        reset(EMPTY);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const onInvalid = () => {
    setInvalidNotice(true);
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: false });
    } else {
      const key = Object.keys(errors)[0];
      if (key) void setFocus(key as keyof FormValues);
    }
  };

  const fieldId = (name: keyof FormValues) => `${id}-${name}`;
  const errorId = (name: keyof FormValues) => `${fieldId(name)}-error`;
  const inputClass = (name: keyof FormValues) => cn('field-base', errors[name] && 'field-invalid');

  return (
    <div className="luxe-card p-6 sm:p-8 lg:p-10">
      <h3 className="font-display text-2xl font-semibold text-white">Project Enquiry Form</h3>
      <p className="mt-2 text-sm text-fog">
        Fields marked with <span className="text-gold">*</span> are required. Your enquiry is sent
        straight to {CONTACT.email.primary}.
      </p>

      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
        className="mt-8 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" required htmlFor={fieldId('name')} error={errors.name?.message}>
            <input
              id={fieldId('name')}
              type="text"
              autoComplete="name"
              placeholder="Ada Okafor"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId('name') : undefined}
              className={inputClass('name')}
              {...register('name')}
            />
          </Field>

          <Field
            label="Email Address"
            required
            htmlFor={fieldId('email')}
            error={errors.email?.message}
          >
            <input
              id={fieldId('email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId('email') : undefined}
              className={inputClass('email')}
              {...register('email')}
            />
          </Field>

          <Field
            label="Phone / WhatsApp Number"
            required
            htmlFor={fieldId('phone')}
            error={errors.phone?.message}
            hint="Include your country code."
          >
            <input
              id={fieldId('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+234 801 234 5678"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? errorId('phone') : undefined}
              className={inputClass('phone')}
              {...register('phone')}
            />
          </Field>

          <Field
            label="Service Required"
            required
            htmlFor={fieldId('service')}
            error={errors.service?.message}
          >
            <div className="relative">
              <select
                id={fieldId('service')}
                autoComplete="off"
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? errorId('service') : undefined}
                className={cn(inputClass('service'), 'appearance-none pr-10')}
                {...register('service')}
              >
                <option value="">Select a service…</option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>
        </div>

        <Field
          label="Project Description"
          required
          htmlFor={fieldId('message')}
          error={errors.message?.message}
          hint={`Brief: goals, scope, timeline, and any links that help. Minimum ${MIN_MESSAGE} characters.`}
        >
          <textarea
            id={fieldId('message')}
            rows={6}
            maxLength={MAX_MESSAGE}
            placeholder="We need a five-page corporate website with a client portal and WhatsApp order form…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              cn(errors.message && errorId('message'), 'message-counter') || undefined
            }
            className={cn(inputClass('message'), 'resize-y leading-relaxed')}
            {...register('message')}
          />
          <p
            id="message-counter"
            className={cn(
              'mt-1.5 text-right text-[0.7rem] tabular-nums',
              messageLength >= MIN_MESSAGE ? 'text-gold/80' : 'text-white/50',
            )}
          >
            {messageLength}/{MAX_MESSAGE} characters
          </p>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Budget Range" htmlFor={fieldId('budget')} error={undefined}>
            <div className="relative">
              <select
                id={fieldId('budget')}
                autoComplete="off"
                className={cn(inputClass('budget'), 'appearance-none pr-10')}
                {...register('budget')}
              >
                <option value="">Select a range (optional)…</option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </Field>

          <fieldset>
            <legend className="field-label">
              Preferred Contact Method <span className="text-gold">*</span>
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {CONTACT_METHODS.map((method) => (
                <label
                  key={method}
                  className={cn(
                    'flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors duration-200',
                    'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold',
                    watch('contactMethod') === method
                      ? 'border-gold/70 bg-gold/[0.10] text-white'
                      : 'border-white/10 bg-charcoal/50 text-white/60 hover:border-gold/35 hover:text-white',
                    errors.contactMethod && 'field-invalid',
                  )}
                >
                  <input
                    type="radio"
                    value={method}
                    className="peer sr-only"
                    aria-describedby={errors.contactMethod ? errorId('contactMethod') : undefined}
                    {...register('contactMethod')}
                  />
                  {method}
                </label>
              ))}
            </div>
            {errors.contactMethod ? (
              <p
                id={errorId('contactMethod')}
                role="alert"
                className="mt-2 flex items-start gap-1.5 text-xs text-danger"
              >
                {errors.contactMethod.message}
              </p>
            ) : null}
          </fieldset>
        </div>

        {/* Honeypot: visually and programmatically hidden, never focusable. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={`${id}-botcheck`}>
            Leave this field empty
            <input
              id={`${id}-botcheck`}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('botcheck')}
            />
          </label>
        </div>

        {invalidNotice ? (
          <p className="flex items-center gap-2 text-sm text-danger" role="alert">
            <AlertTriangle className="h-4 w-4" strokeWidth={1.8} />
            Please complete the highlighted fields before sending.
          </p>
        ) : null}

        {showStatus ? <StatusMessage status={status} /> : null}

        <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-[0.7rem] leading-relaxed text-white/50">
            By sending this form you agree to our{' '}
            <a href="/privacy-policy" className="link-underline text-white/55 hover:text-gold">
              Privacy Policy
            </a>
            . We never share your details.
          </p>

          <button
            type="submit"
            disabled={isSubmitting || status === 'submitting'}
            className="btn-primary min-w-[11.5rem] shrink-0"
          >
            {isSubmitting || status === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                Send Enquiry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bits                                                                        */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {hint && !error ? (
        <p className="-mt-1 mb-2.5 text-[0.72rem] leading-relaxed text-white/50">{hint}</p>
      ) : null}
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-danger"
        >
          <AlertTriangle
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusMessage({ status }: { status: Status }) {
  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-start gap-3 rounded-lg border border-success/35 bg-success/[0.08] px-4 py-3.5"
      >
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
          <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-success">
          Thank you! Your enquiry has been received. We will respond within 24 hours.
        </p>
      </div>
    );
  }

  if (status === 'unconfigured') {
    return (
      <div role="alert" className="rounded-lg border border-gold/35 bg-gold/[0.06] px-4 py-3.5">
        <p className="text-sm leading-relaxed text-gold">
          The enquiry form is not connected yet on this deployment. Please{' '}
          <a
            href={CONTACT.whatsapp.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-white"
          >
            message us on WhatsApp
          </a>{' '}
          or email{' '}
          <a
            href={`mailto:${CONTACT.email.primary}`}
            className="link-underline font-medium text-white"
          >
            {CONTACT.email.primary}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger/[0.07] px-4 py-3.5"
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0 text-danger"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed text-danger">
        Something went wrong. Please try again or contact us directly via{' '}
        <a
          href={CONTACT.whatsapp.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline font-medium text-white"
        >
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
