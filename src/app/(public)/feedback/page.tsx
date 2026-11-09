'use client';
import { submitFeedback } from '@/api-routes/feedback-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MessageSquareHeart,
  PartyPopper,
  Send,
  Sparkles,
  Wallet,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/*  Zod schema — every answer validated before submit                  */
/* ------------------------------------------------------------------ */

const feedbackSchema = z.object({
  triedProduct: z.enum(['regularly', 'once_or_twice', 'not_yet'], {
    message: 'Please pick one option',
  }),
  usefulFeature: z.enum(
    ['monitoring', 'alerts', 'reports', 'crawling', 'collaboration'],
    { message: 'Please pick one option' }
  ),
  frustration: z
    .string()
    .trim()
    .max(1000, 'Keep it under 1000 characters')
    .optional()
    .or(z.literal('')),
  usageFrequency: z.enum(['daily', 'weekly', 'monthly', 'rarely'], {
    message: 'Please pick one option',
  }),
  wouldPay: z.enum(['yes', 'maybe', 'free_only', 'unsure'], {
    message: 'Please pick one option',
  }),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;
type FeedbackErrors = Partial<Record<keyof FeedbackForm, string>>;

/* ------------------------------------------------------------------ */
/*  Question data                                                      */
/* ------------------------------------------------------------------ */

const TRIED_OPTIONS = [
  { value: 'regularly', label: 'Yes, I use it regularly' },
  { value: 'once_or_twice', label: "Yes, I've tried it once or twice" },
  { value: 'not_yet', label: 'Not yet' },
] as const;

const FEATURE_OPTIONS = [
  { value: 'monitoring', label: 'Automatic website & broken-link monitoring' },
  { value: 'alerts', label: 'Real-time alerts and notifications' },
  { value: 'reports', label: 'Reports, history & website health analytics' },
  { value: 'crawling', label: 'More advanced crawling and link discovery' },
  { value: 'collaboration', label: 'Team collaboration and integrations' },
] as const;

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly or when problems arise' },
  { value: 'rarely', label: 'Probably not often' },
] as const;

const PAY_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe, depending on features and price' },
  { value: 'free_only', label: "I'd only use a free version" },
  { value: 'unsure', label: 'Not sure yet' },
] as const;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function OptionCard({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
        selected
          ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-[0_2px_12px_-4px_rgba(13,148,136,0.35)]'
          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/40'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
            ? 'border-teal-600 bg-teal-600'
            : 'border-slate-300 bg-white group-hover:border-teal-400'
        }`}
      >
        {selected && <span className='h-2 w-2 rounded-full bg-white' />}
      </span>
      <span className='flex-1'>{label}</span>
      {selected && <CheckCircle2 className='h-4 w-4 shrink-0 text-teal-600' />}
    </button>
  );
}

function QuestionSection({
  step,
  icon: Icon,
  title,
  error,
  children,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className='animate-[fadeUp_0.5s_ease_both] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-8'
      style={{ animationDelay: `${step * 90}ms` }}
    >
      <div className='mb-5 flex items-start gap-4'>
        <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-amber-300 shadow-md'>
          <Icon className='h-5 w-5' />
        </span>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600'>
            Question {step} of 5
          </p>
          <h2 className='mt-1 text-lg font-bold text-slate-900'>{title}</h2>
        </div>
      </div>
      {children}
      {error && (
        <p className='mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600'>
          <span className='inline-block h-1.5 w-1.5 rounded-full bg-red-500' />
          {error}
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page content — renders inside your existing navbar + footer layout */
/* ------------------------------------------------------------------ */

export default function FeedbackPage() {
  const [form, setForm] = useState<Partial<FeedbackForm>>({ frustration: '' });
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submission = useMutation({ mutationFn: submitFeedback, retry: false });

  const setField = <K extends keyof FeedbackForm>(
    key: K,
    value: FeedbackForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = feedbackSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FeedbackErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FeedbackForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      // Scroll to the first invalid section
      const firstInvalid = document.querySelector('[data-invalid="true"]');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitError('');
    try {
      await submission.mutateAsync(result.data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          'Could not submit feedback. Please try again.'
        )
      );
    } finally {
      submission.reset();
    }
  };

  /* ------------------------- Thank-you state ------------------------- */
  if (submitted) {
    return (
      <div className='flex items-center justify-center px-4 py-24'>
        <div className='animate-[fadeUp_0.6s_ease_both] w-full max-w-md rounded-3xl border border-teal-700/40 bg-gradient-to-b from-teal-900 to-teal-950 p-10 text-center shadow-2xl'>
          <span className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-teal-950 shadow-lg'>
            <PartyPopper className='h-8 w-8' />
          </span>
          <h1 className='mt-6 text-2xl font-bold text-white'>Thank you!</h1>
          <p className='mt-3 text-sm leading-relaxed text-teal-100/80'>
            Your feedback helps us decide what to build next for DeadLink
            Watchdog. We read every single response.
          </p>
          <div className='mt-8 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent' />
          <p className='mt-6 text-xs uppercase tracking-[0.2em] text-teal-300/60'>
            DeadLink Watchdog
          </p>
        </div>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  /* ----------------------------- Form ----------------------------- */
  return (
    <div className='bg-slate-50'>
      {/* Banner */}
      <header className='relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800'>
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.07]'
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className='relative mx-auto max-w-3xl px-4 py-14 sm:py-20'>
          <p className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400'>
            <MessageSquareHeart className='h-4 w-4' />
            DeadLink Watchdog
          </p>
          <h1 className='mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl'>
            Help us shape what
            <span className='bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent'>
              {' '}
              comes next
            </span>
          </h1>
          <p className='mt-4 max-w-xl text-sm leading-relaxed text-teal-100/80 sm:text-base'>
            Five quick questions — under two minutes. Your answers directly
            decide which features we build first.
          </p>
        </div>
        <div className='h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-teal-500' />
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className='mx-auto max-w-3xl space-y-6 px-4 py-10 sm:py-14'
      >
        {/* Q1 */}
        <div data-invalid={!!errors.triedProduct || undefined}>
          <QuestionSection
            step={1}
            icon={Sparkles}
            title='Have you tried DeadLink Watchdog?'
            error={errors.triedProduct}
          >
            <div className='grid gap-2.5'>
              {TRIED_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={form.triedProduct === opt.value}
                  onSelect={() => setField('triedProduct', opt.value)}
                />
              ))}
            </div>
          </QuestionSection>
        </div>

        {/* Q2 */}
        <div data-invalid={!!errors.usefulFeature || undefined}>
          <QuestionSection
            step={2}
            icon={Wrench}
            title='Which feature would be most useful to you?'
            error={errors.usefulFeature}
          >
            <div className='grid gap-2.5'>
              {FEATURE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={form.usefulFeature === opt.value}
                  onSelect={() => setField('usefulFeature', opt.value)}
                />
              ))}
            </div>
          </QuestionSection>
        </div>

        {/* Q3 — free text */}
        <QuestionSection
          step={3}
          icon={MessageSquareHeart}
          title="What's missing or frustrating about the current version?"
          error={errors.frustration}
        >
          <textarea
            value={form.frustration ?? ''}
            onChange={(e) => setField('frustration', e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder='Optional — tell us anything that annoyed you, or something you wish it did…'
            className='w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20'
          />
          <p className='mt-1.5 text-right text-xs text-slate-400'>
            {(form.frustration ?? '').length}/1000
          </p>
        </QuestionSection>

        {/* Q4 */}
        <div data-invalid={!!errors.usageFrequency || undefined}>
          <QuestionSection
            step={4}
            icon={CalendarClock}
            title='How often would you use a tool like this?'
            error={errors.usageFrequency}
          >
            <div className='grid gap-2.5 sm:grid-cols-2'>
              {FREQUENCY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={form.usageFrequency === opt.value}
                  onSelect={() => setField('usageFrequency', opt.value)}
                />
              ))}
            </div>
          </QuestionSection>
        </div>

        {/* Q5 */}
        <div data-invalid={!!errors.wouldPay || undefined}>
          <QuestionSection
            step={5}
            icon={Wallet}
            title='If it offered more advanced features, would you consider paying?'
            error={errors.wouldPay}
          >
            <div className='grid gap-2.5 sm:grid-cols-2'>
              {PAY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={form.wouldPay === opt.value}
                  onSelect={() => setField('wouldPay', opt.value)}
                />
              ))}
            </div>
          </QuestionSection>
        </div>

        {/* Submit */}
        <div
          className='animate-[fadeUp_0.5s_ease_both] pt-2'
          style={{ animationDelay: '480ms' }}
        >
          <button
            type='submit'
            disabled={submission.isPending}
            className='group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 px-6 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(13,148,136,0.5)] transition-all duration-200 hover:shadow-[0_12px_32px_-8px_rgba(13,148,136,0.65)] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submission.isPending ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Sending…
              </>
            ) : (
              <>
                <Send className='h-5 w-5 text-amber-300 transition-transform group-hover:translate-x-0.5' />
                Submit feedback
                <ChevronRight className='h-4 w-4 text-amber-300/70 transition-transform group-hover:translate-x-1' />
              </>
            )}
          </button>
          {submitError && (
            <p role='alert' className='mt-3 text-center text-sm text-red-600'>
              {submitError}
            </p>
          )}
          <p className='mt-3 text-center text-xs text-slate-400'>
            Anonymous by default — no account needed.
          </p>
        </div>
      </form>

      {/* Keyframes (safe to keep even if your global CSS already defines fadeUp) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
