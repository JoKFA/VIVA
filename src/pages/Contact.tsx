import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Send, CheckCircle, Clock } from 'lucide-react';
import { siteSettings } from '../data/mockData';

interface FormData { firstName: string; lastName: string; email: string; subject: string; message: string; }
const EMPTY: FormData = { firstName: '', lastName: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const field = (k: keyof FormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.subject.trim()) e.subject = 'Required';
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
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Reach Out</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Contact Us
            </h1>
          </div>
        </div>
      </div>

      {/* 2-col layout: details left, form right */}
      <section className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">

          {/* Left: contact details */}
          <div>
            <h2 className="font-display font-extrabold text-xl text-warm-900 mb-8">Get in Touch</h2>

            <ul className="space-y-6 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-warm-400 mb-1">Office</p>
                  <p className="text-warm-900 text-sm font-medium">{siteSettings.address.street}</p>
                  <p className="text-warm-600 text-sm">{siteSettings.address.city}, {siteSettings.address.province}</p>
                  <p className="text-warm-600 text-sm">{siteSettings.address.postalCode}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-warm-400 mb-1">Phone</p>
                  <a href={`tel:${siteSettings.phone}`} className="text-warm-900 text-sm font-medium hover:text-primary-600 transition-colors">
                    {siteSettings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-warm-400 mb-1">Email</p>
                  <a href={`mailto:${siteSettings.email}`} className="text-warm-900 text-sm font-medium hover:text-primary-600 transition-colors">
                    {siteSettings.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-warm-400 mb-1">Response Time</p>
                  <p className="text-warm-900 text-sm font-medium">Within 48 hours</p>
                </div>
              </li>
            </ul>

            {/* Social */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-warm-400 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-warm-100 hover:bg-primary-600 hover:text-white rounded-lg text-warm-600 transition-colors"
                  aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-warm-100 hover:bg-primary-600 hover:text-white rounded-lg text-warm-600 transition-colors"
                  aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Land acknowledgement */}
            <div className="mt-10 pt-8 border-t border-warm-200">
              <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400 mb-2">Land Acknowledgement</p>
              <p className="text-xs text-warm-500 leading-relaxed">{siteSettings.territoryAcknowledgement}</p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 className="font-display font-extrabold text-xl text-warm-900 mb-8">Send a Message</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-warm-900 mb-1">Message Sent</h3>
                <p className="text-warm-600 text-sm">We'll get back to you within 2–3 business days.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">First Name *</label>
                    <input type="text" value={form.firstName} onChange={(e) => field('firstName', e.target.value)}
                      className={inputCls('firstName')} placeholder="Jane" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-warm-700 mb-1.5">Last Name *</label>
                    <input type="text" value={form.lastName} onChange={(e) => field('lastName', e.target.value)}
                      className={inputCls('lastName')} placeholder="Doe" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => field('email', e.target.value)}
                    className={inputCls('email')} placeholder="jane@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Subject *</label>
                  <select value={form.subject} onChange={(e) => field('subject', e.target.value)} className={inputCls('subject')}>
                    <option value="">Select a subject…</option>
                    <option value="general">General Inquiry</option>
                    <option value="volunteer">Volunteering Questions</option>
                    <option value="donation">Donation Information</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="events">Events Information</option>
                    <option value="media">Media / Press</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warm-700 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={(e) => field('message', e.target.value)}
                    rows={6} className={inputCls('message')} placeholder="How can we help?" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white font-semibold text-sm rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
