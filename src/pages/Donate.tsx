import { useState } from 'react';
import { Send, CheckCircle, Heart } from 'lucide-react';
import { siteSettings } from '../data/mockData';

interface FormData { name: string; email: string; message: string; }
const EMPTY: FormData = { name: '', email: '', message: '' };

export default function Donate() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const field = (k: keyof FormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const inputCls = (k: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm text-warm-900 bg-warm-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors[k] ? 'border-red-400' : 'border-warm-200'}`;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Support VIVA</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Donate
            </h1>
          </div>
        </div>
      </div>

      {/* Intro + Form */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">

          {/* Left: context */}
          <div>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-warm-900 mb-4">Make a Difference</h2>
            <p className="text-warm-600 text-sm leading-relaxed mb-6">
              VIVA is a volunteer-driven organization dedicated to connecting communities across Metro Vancouver.
              Your generosity helps us run cleanups, career fairs, youth mentorship programs, and more.
            </p>
            <p className="text-warm-600 text-sm leading-relaxed mb-8">
              To discuss donation options, sponsorships, or in-kind contributions, send us a message and our team
              will get back to you within 2–3 business days.
            </p>
            <div className="text-xs text-warm-400 border-t border-warm-200 pt-6">
              <p className="font-bold tracking-widest uppercase mb-1">Direct Contact</p>
              <a href={`mailto:${siteSettings.email}`} className="text-primary-600 hover:underline">
                {siteSettings.email}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 className="font-display font-extrabold text-xl text-warm-900 mb-8">Send an Inquiry</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-warm-900 mb-1">Inquiry Sent</h3>
                <p className="text-warm-600 text-sm">We'll be in touch within 2–3 business days.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => field('name', e.target.value)}
                    className={inputCls('name')}
                    placeholder="Jane Doe"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => field('email', e.target.value)}
                    className={inputCls('email')}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => field('message', e.target.value)}
                    rows={6}
                    className={inputCls('message')}
                    placeholder="Tell us how you'd like to support VIVA — donation amount, sponsorship interest, in-kind contributions, etc."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
