import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Send, Upload, ArrowRight, ChevronRight } from 'lucide-react';
import { useVolunteerRoles } from '../hooks/useVolunteerRoles';
import { useFaqs } from '../hooks/useFaqs';
import { sendContactEmail } from '../lib/contactEmail';

const WHY_ITEMS = [
  { num: '01', title: 'Real Impact', body: 'See direct results of your efforts — from students finding jobs to communities restored after a cleanup.' },
  { num: '02', title: 'Grow Your Skills', body: 'Leadership, event management, communications, environmental science — every role builds something real.' },
  { num: '03', title: 'Build Your Network', body: 'Connect with 2,500+ volunteers, partner organizations, and professionals across Metro Vancouver.' },
  { num: '04', title: 'Official Recognition', body: 'Receive documented volunteer hours and a reference letter — valuable for academic and career applications.' },
];

const PROCESS_STEPS = [
  { n: 1, title: 'Submit Application', body: 'Fill out the form below. Takes about 5 minutes.' },
  { n: 2, title: 'Team Review', body: 'We review applications within 5–7 business days.' },
  { n: 3, title: 'Match & Interview', body: 'We contact you to discuss the best role fit.' },
  { n: 4, title: 'Orientation', body: 'Complete a short onboarding session.' },
  { n: 5, title: 'Start Volunteering', body: "You're in. Make your first impact." },
];

const INTERESTS = ['Newcomer Support', 'Youth Mentorship', 'Community Events', 'Environmental Action', 'Communications & Marketing', 'Administrative Support', 'Fundraising', 'Other'];
const AVAILABILITY = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekend mornings', 'Weekend afternoons', 'Flexible schedule'];

const ROLE_ACCENTS: Record<string, string> = {
  Operations: '#c1272d',
  'Publicity Department': '#1a5c9e',
  'Event Coordination Department': '#15803d',
  'Secretariat Office': '#b45309',
  'Environmental Action': '#15803d',
  'Vancouver Career Fair': '#b45309',
  'Newcomer Support': '#6d28d9',
  'Learning Hub': '#c1272d',
};

const FORM_STEPS = [
  { n: 1, label: 'Personal' },
  { n: 2, label: 'Availability' },
  { n: 3, label: 'Interests' },
];

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  availability: string; resume: File | null;
  interests: string[]; experience: string; motivation: string;
}

const EMPTY: FormData = { firstName: '', lastName: '', email: '', phone: '', availability: '', resume: null, interests: [], experience: '', motivation: '' };

export default function Volunteer() {
  const { data: volunteerRoles } = useVolunteerRoles();
  const { data: faqs } = useFaqs();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const field = (name: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const toggleInterest = (v: string) => {
    setForm((p) => ({ ...p, interests: p.interests.includes(v) ? p.interests.filter((i) => i !== v) : [...p.interests, v] }));
    if (errors.interests) setErrors((p) => ({ ...p, interests: '' }));
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim()) e.lastName = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
      if (!form.phone.trim()) e.phone = 'Required';
    }
    if (s === 2) {
      if (!form.availability) e.availability = 'Required';
    }
    if (s === 3) {
      if (form.interests.length === 0) e.interests = 'Select at least one area';
      if (!form.motivation.trim()) e.motivation = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateStep(3)) return;

    setIsSending(true);
    setSubmitError('');

    try {
      await sendContactEmail({
        source: 'volunteer',
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        subject: 'Volunteer application',
        message: form.motivation,
        metadata: {
          phone: form.phone,
          availability: form.availability,
          interests: form.interests,
          experience: form.experience,
          resumeFileName: form.resume?.name,
        },
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Application could not be sent right now.');
    } finally {
      setIsSending(false);
    }
  };

  const inputCls = (k: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm text-warm-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors[k] ? 'border-red-400' : 'border-warm-300'}`;

  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Get Involved</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Volunteer with VIVA
            </h1>
          </div>
        </div>
      </div>

      {/* Why volunteer — split image / reasons (NOT 3-col icon grid) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="img-placeholder min-h-[400px] relative">
            <img src="https://picsum.photos/640/480?grayscale&random=80" alt="VIVA volunteers" />
          </div>
          {/* Reasons */}
          <div className="px-12 py-16">
            <p className="eyebrow">Why Volunteer</p>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-8">More than giving back</h2>
            <div className="space-y-7">
              {WHY_ITEMS.map((w) => (
                <div key={w.num} className="flex gap-5">
                  <p className="font-impact text-[2.5rem] text-warm-200 leading-none flex-shrink-0 w-12">{w.num}</p>
                  <div>
                    <h3 className="font-display font-bold text-warm-900 mb-1">{w.title}</h3>
                    <p className="text-warm-600 text-sm leading-relaxed">{w.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles — horizontal scroll track (like honours) */}
      {volunteerRoles.length > 0 && (
        <section className="bg-warm-50 py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <p className="eyebrow">Open Roles</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-8">
              Find Your Fit
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {volunteerRoles.map((role) => {
                const accent = ROLE_ACCENTS[role.program] || '#c1272d';
                const hovered = hoveredRole === role.id;

                return (
                <div
                  key={role.id}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className="bg-white rounded-xl p-7 flex flex-col transition-all duration-200 hover:-translate-y-1"
                  style={{
                    border: `1px solid ${hovered ? accent : '#f0e8e5'}`,
                    boxShadow: hovered ? `0 8px 32px -8px ${accent}35` : '0 2px 12px -3px rgba(28,20,16,0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                      style={{ color: accent, backgroundColor: `${accent}15` }}
                    >
                      {role.program}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{ backgroundColor: hovered ? accent : '#e8e6e1' }}
                    />
                  </div>
                  <h3 className="font-display font-bold text-lg text-warm-900 mb-2">{role.title}</h3>
                  <p className="text-warm-600 text-sm leading-relaxed mb-4 flex-1">{role.description}</p>
                  <div className="flex items-center gap-2 text-xs text-warm-500 mb-4">
                    <Clock className="w-3.5 h-3.5" /> {role.commitment}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-xs rounded transition-colors"
                        style={{ backgroundColor: hovered ? `${accent}15` : '#f5f4f1', color: hovered ? accent : '#7c756e' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it works — numbered steps (vertical line, not circles in a row) */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow">Process</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-10">
              How It Works
            </h2>
            <div className="space-y-0 border-l-2 border-warm-200 ml-4">
              {PROCESS_STEPS.map((s, index) => (
                <div key={s.n} className="relative pl-8 pb-9">
                  <div
                    className={`absolute -left-[17px] w-8 h-8 rounded-full border-2 border-primary-600 flex items-center justify-center ${
                      index === 0 ? 'bg-primary-600' : 'bg-white'
                    }`}
                  >
                    <span className={`font-impact text-sm ${index === 0 ? 'text-white' : 'text-primary-600'}`}>{s.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-warm-900 mb-1">{s.title}</h3>
                  <p className="text-warm-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ accordion — right col */}
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-8">
              Common Questions
            </h2>
            {faqs.length > 0 ? (
              <div className="space-y-0 border-t border-warm-200">
                {faqs.slice(0, 6).map((faq) => (
                  <div key={faq.id} className="border-b border-warm-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className={`flex items-center justify-between w-full py-4 cursor-pointer text-left text-sm font-semibold transition-colors ${
                        openFaq === faq.id ? 'text-primary-600' : 'text-warm-900 hover:text-primary-600'
                      }`}
                    >
                      {faq.question}
                      <span className={`text-lg leading-none ml-4 transition-transform ${openFaq === faq.id ? 'rotate-45 text-primary-600' : 'text-warm-400'}`}>+</span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                        openFaq === faq.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <p className="overflow-hidden text-warm-600 text-sm leading-relaxed pb-4">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-warm-400 text-sm">FAQ coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Application Form — 3-step */}
      <section id="apply" className="bg-warm-50 py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow">Apply</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-3">
            Join the Team
          </h2>
          <p className="text-warm-600 text-sm mb-10">Takes about 5 minutes. We'll be in touch within a week.</p>

          {submitted ? (
            <div className="bg-white border border-warm-200 p-10 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-extrabold text-xl text-warm-900 mb-2">Application Submitted</h3>
              <p className="text-warm-600 text-sm max-w-sm mx-auto">
                Thank you! Our team will review your application and reach out within 5–7 business days.
              </p>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-0 mb-8">
                {FORM_STEPS.map((s, i) => (
                  <div key={s.n} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        step > s.n ? 'bg-primary-600 border-primary-600 text-white'
                        : step === s.n ? 'bg-white border-primary-600 text-primary-600'
                        : 'bg-white border-warm-300 text-warm-400'
                      }`}>
                        {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${step >= s.n ? 'text-warm-900' : 'text-warm-400'}`}>{s.label}</span>
                    </div>
                    {i < FORM_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > s.n ? 'bg-primary-600' : 'bg-warm-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Personal */}
              {step === 1 && (
                <div className="bg-white border border-warm-200 p-8 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-warm-900 mb-1">Personal Information</h3>
                    <p className="text-warm-500 text-sm">Tell us a bit about yourself.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-warm-700 mb-1.5">First Name *</label>
                      <input type="text" value={form.firstName} onChange={(e) => field('firstName', e.target.value)} className={inputCls('firstName')} placeholder="Jane" />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-700 mb-1.5">Last Name *</label>
                      <input type="text" value={form.lastName} onChange={(e) => field('lastName', e.target.value)} className={inputCls('lastName')} placeholder="Doe" />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-warm-700 mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => field('email', e.target.value)} className={inputCls('email')} placeholder="jane@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-warm-700 mb-1.5">Phone *</label>
                      <input type="tel" value={form.phone} onChange={(e) => field('phone', e.target.value)} className={inputCls('phone')} placeholder="604-555-0100" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="button" onClick={next}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Availability */}
              {step === 2 && (
                <div className="bg-white border border-warm-200 p-8 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-warm-900 mb-1">Availability</h3>
                    <p className="text-warm-500 text-sm">When are you available to volunteer?</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-3">Availability *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {AVAILABILITY.map((value) => {
                        const selected = form.availability === value;
                        return (
                          <label
                            key={value}
                            className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm cursor-pointer transition-colors ${
                              selected
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                                : 'border-warm-200 bg-white text-warm-700 hover:border-primary-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="availability"
                              value={value}
                              checked={selected}
                              onChange={() => field('availability', value)}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            {value}
                          </label>
                        );
                      })}
                    </div>
                    {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Resume / CV <span className="text-warm-400 font-normal">(optional)</span></label>
                    <div className="border-2 border-dashed border-warm-300 rounded-lg p-5 text-center hover:border-primary-400 transition-colors">
                      <Upload className="w-7 h-7 text-warm-400 mx-auto mb-2" />
                      <input type="file" id="resume" accept=".pdf,.doc,.docx" className="hidden"
                        onChange={(e) => setForm((p) => ({ ...p, resume: e.target.files?.[0] || null }))} />
                      <label htmlFor="resume" className="cursor-pointer text-sm">
                        <span className="text-primary-600 font-medium">Click to upload</span>
                        <span className="text-warm-500"> or drag and drop</span>
                      </label>
                      <p className="text-xs text-warm-400 mt-1">PDF, DOC, DOCX — max 5 MB</p>
                      {form.resume && <p className="text-xs text-green-600 mt-1">{form.resume.name}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={back}
                      className="py-3 px-2 text-sm font-semibold text-warm-600 hover:text-warm-900 transition-colors">
                      Back
                    </button>
                    <button type="button" onClick={next}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors">
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Interests */}
              {step === 3 && (
                <form onSubmit={submit} className="bg-white border border-warm-200 p-8 space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-warm-900 mb-1">Interests & Motivation</h3>
                    <p className="text-warm-500 text-sm">Help us find the right role for you.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-3">Areas of Interest * <span className="text-warm-400 font-normal">(select all that apply)</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {INTERESTS.map((v) => (
                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form.interests.includes(v)} onChange={() => toggleInterest(v)}
                            className="w-4 h-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500" />
                          <span className="text-sm text-warm-700">{v}</span>
                        </label>
                      ))}
                    </div>
                    {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Relevant Experience <span className="text-warm-400 font-normal">(optional)</span></label>
                    <textarea value={form.experience} onChange={(e) => field('experience', e.target.value)} rows={3}
                      className={inputCls('experience')} placeholder="Volunteer, work, or educational experience…" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Why do you want to volunteer with VIVA? *</label>
                    <textarea value={form.motivation} onChange={(e) => field('motivation', e.target.value)} rows={4}
                      className={inputCls('motivation')} placeholder="Tell us what motivates you…" />
                    {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={back}
                      className="py-3 px-2 text-sm font-semibold text-warm-600 hover:text-warm-900 transition-colors">
                      Back
                    </button>
                    <button type="submit"
                      disabled={isSending}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <Send className="w-4 h-4" /> {isSending ? 'Sending...' : 'Submit Application'}
                    </button>
                  </div>
                  {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                </form>
              )}
            </>
          )}
        </div>
      </section>

      {/* Code of conduct note */}
      <section className="bg-white py-10 px-8 border-t border-warm-200">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <p className="text-warm-600 text-sm leading-relaxed">
            All VIVA volunteers are expected to uphold our Code of Conduct — treating everyone with respect,
            maintaining confidentiality, and representing VIVA positively in all interactions.{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Questions? Contact us <ArrowRight className="inline w-3 h-3" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
