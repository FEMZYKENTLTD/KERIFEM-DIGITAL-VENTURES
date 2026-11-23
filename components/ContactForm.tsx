'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, MIN_MESSAGE, MAX_MESSAGE, type FormValues } from '@/lib/enquiry';
import { AlertTriangle, Loader2, Send } from 'lucide-react';

import { BUDGET_OPTIONS, CONTACT_METHODS, SERVICE_OPTIONS, TIMELINES } from '@/lib/content';
import { CONTACT } from '@/lib/site';
import { useRouter } from 'next/navigation';
import { quoteReceiptPath } from '@/lib/quote-editions';
import { useReceiptSession } from './QuoteReceiptSession';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

const EMPTY: FormValues = {
  name: '',
  email: '',
  phone: '',
  country: '',
  projectTitle: '',
  timeline: '',
  reference: '',
  service: '',
  message: '',
  budget: '',
  contactMethod: '',
  botcheck: '',
};

/* -------------------------------------------------------------------------- */
/* Enquiry submission                                                        */
/* -------------------------------------------------------------------------- */

type Status = 'idle' | 'submitting' | 'error' | 'unconfigured' | 'provider-error';

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export default function ContactForm({ initialService = '' }: { initialService?: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const { setReceipt } = useReceiptSession();
  const router = useRouter();
  const [invalidNotice, setInvalidNotice] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    // RHF's generic expects the *output* type of the schema; the cast keeps the
    // resolver types aligned without reaching for `any`.
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    mode: 'onTouched',
    defaultValues: { ...EMPTY, service: initialService },
  });

  const messageLength = watch('message').trim().length;
  const showStatus = status === 'error' || status === 'unconfigured' || status === 'provider-error';

  /* Reset the inline status whenever the visitor edits after an error. */
  useEffect(() => {
    if (status === 'error' || status === 'unconfigured' || status === 'provider-error')
      setStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirtyFields.name, dirtyFields.email, dirtyFields.message]);

  const pending = useRef(false);
  const onValid = async (values: FormValues) => {
    setInvalidNotice(false);

    if (pending.current) return;
    pending.current = true;
    setStatus('submitting');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(22000),
      });
      const result = await response.json().catch(() => null);
      if (result?.code === 'FORM_NOT_CONFIGURED') {
        setStatus('unconfigured');
        return;
      }
      if (result?.code?.startsWith('PROVIDER_')) {
        setStatus('provider-error');
        return;
      }
      const ok = response.ok && result?.success === true;
      if (ok) {
        setReceipt({
          values,
          reference: typeof result.reference === 'string' ? result.reference : '',
        });
        setStatus('idle');
        router.replace(quoteReceiptPath(values.budget));
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      pending.current = false;
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
        Fields marked with <span className="text-gold">*</span> are required. Enquiries are saved to
        our private enquiry inbox.{' '}
        <a className="link-underline" href="/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>

      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => void handleSubmit(onValid, onInvalid)(event)}
        className="mt-8 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {(
            [
              { key: 'country', label: 'Country', required: true },
              { key: 'projectTitle', label: 'Project title', required: false },
              { key: 'reference', label: 'Reference URL', required: false },
            ] as const
          ).map(({ key, label, required }) => (
            <Field
              key={key}
              label={label}
              required={required}
              htmlFor={fieldId(key)}
              error={errors[key]?.message}
            >
              <input
                id={fieldId(key)}
                className={inputClass(key)}
                type={key === 'reference' ? 'url' : 'text'}
                autoComplete={key === 'country' ? 'country-name' : undefined}
                required={required}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? errorId(key) : undefined}
                {...register(key)}
              />
            </Field>
          ))}
          <Field
            label="Preferred timeline"
            required
            htmlFor={fieldId('timeline')}
            error={errors.timeline?.message}
          >
            <select
              id={fieldId('timeline')}
              required
              className={inputClass('timeline')}
              aria-invalid={Boolean(errors.timeline)}
              aria-describedby={errors.timeline ? errorId('timeline') : undefined}
              {...register('timeline')}
            >
              <option value="">Select timeline</option>
              {TIMELINES.map((timeline) => (
                <option key={timeline}>{timeline}</option>
              ))}
            </select>
          </Field>
        </div>
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
          <Field label="Budget Range (USD)" htmlFor={fieldId('budget')} error={undefined}>
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
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
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
                Request a Quote
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
        {status === 'provider-error'
          ? 'We could not confirm that your enquiry was saved. Your details are still in the form. You can try again or contact us directly via'
          : 'Something went wrong. Please try again or contact us directly via'}{' '}
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
