import { useState } from 'react';
import { Heart, Shield, Receipt, ArrowRight } from 'lucide-react';
import { siteSettings } from '../data/mockData';

const AMOUNTS = [25, 50, 100, 250, 500];

const FUNDS = [
  { value: 'general', label: 'General Fund', desc: 'Support where needed most' },
  { value: 'youth', label: 'Youth Initiatives', desc: 'Mentorship & scholarships' },
  { value: 'environment', label: 'VIVA EG', desc: 'Shoreline cleanups & sustainability' },
  { value: 'events', label: 'Community Events', desc: 'Event coordination & supplies' },
];

const IMPACT = [
  { amount: '$25', headline: 'Welcome Package', body: 'Provides a complete welcome kit for a newcomer family — settlement resources, guides, and community connections.' },
  { amount: '$50', headline: '4 Hours of Tutoring', body: 'Funds one-on-one tutoring for a student, helping them build confidence and excel academically.' },
  { amount: '$100', headline: 'Community Event', body: 'Sponsors the materials for an event bringing 50+ neighbours together to connect and celebrate.' },
  { amount: '$250', headline: 'Shoreline Cleanup', body: 'Covers gear and logistics for a full VIVA EG cleanup session removing debris from BC\'s shorelines.' },
];

const ALLOCATION = [
  { label: 'Programs & Services', pct: 75, color: '#c1272d' },
  { label: 'Administration', pct: 15, color: '#f59e0b' },
  { label: 'Fundraising', pct: 10, color: '#15803d' },
];

export default function Donate() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number | 'other'>(50);
  const [custom, setCustom] = useState('');
  const [fund, setFund] = useState('general');

  const displayAmount = amount === 'other' ? (custom ? `$${custom}` : '$—') : `$${amount}`;

  const handleDonate = () => {
    alert(`Demo only — no payment processed.\n\n${frequency} donation of ${displayAmount} to the ${FUNDS.find(f => f.value === fund)?.label}.`);
  };

  return (
    <div>
      {/* Crimson hero — conversion page gets full crimson treatment */}
      <section className="gradient-hero pt-28 pb-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-4">Support VIVA</p>
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4rem)] text-white leading-tight mb-5">
              Fund the<br />community.
            </h1>
            <p className="text-white/80 text-[1.0625rem] leading-relaxed max-w-md mb-8">
              Every dollar goes directly toward connecting volunteers with meaningful work — shoreline cleanups,
              youth mentorship, career fairs, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Shield className="w-4 h-4 text-white/60" /> Registered charity
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Receipt className="w-4 h-4 text-white/60" /> Tax receipts issued
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Heart className="w-4 h-4 text-white/60" /> 75% to programs
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '2,500+', l: 'Active Volunteers' },
              { v: '120', l: 'Events / Year' },
              { v: '45K+', l: 'Hours Served' },
              { v: '50+', l: 'Communities Reached' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 border border-white/15 p-6 text-center">
                <p className="font-impact text-[2.5rem] text-white leading-none mb-1">{s.v}</p>
                <p className="text-xs text-white/60 font-medium">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section id="donate-form" className="bg-warm-50 py-20 px-8">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow">Make a Donation</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-10">
            Choose Your Gift
          </h2>

          <div className="bg-white border border-warm-200 p-8 space-y-8">
            {/* Frequency toggle */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-warm-500 mb-3">Frequency</p>
              <div className="inline-flex bg-warm-100 rounded-lg p-1">
                {(['one-time', 'monthly'] as const).map((f) => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${frequency === f ? 'bg-white text-warm-900 shadow-soft' : 'text-warm-500 hover:text-warm-700'}`}>
                    {f === 'one-time' ? 'One-Time' : 'Monthly'}
                  </button>
                ))}
              </div>
              {frequency === 'monthly' && (
                <p className="text-xs text-primary-600 font-medium mt-2">Monthly gifts provide sustained support for our programs.</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-warm-500 mb-3">Amount</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AMOUNTS.map((a) => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(''); }}
                    className={`py-3 text-sm font-bold rounded-lg border-2 transition-all ${amount === a ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-warm-700 border-warm-200 hover:border-primary-400'}`}>
                    ${a}
                  </button>
                ))}
                <button onClick={() => setAmount('other')}
                  className={`py-3 text-sm font-bold rounded-lg border-2 transition-all ${amount === 'other' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-warm-700 border-warm-200 hover:border-primary-400'}`}>
                  Other
                </button>
              </div>
              {amount === 'other' && (
                <div className="relative mt-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-500">$</span>
                  <input type="text" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-warm-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              )}
            </div>

            {/* Fund designation */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-warm-500 mb-3">Designate Your Gift</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUNDS.map((f) => (
                  <button key={f.value} onClick={() => setFund(f.value)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${fund === f.value ? 'bg-primary-50 border-primary-600' : 'bg-white border-warm-200 hover:border-primary-300'}`}>
                    <p className="text-sm font-bold text-warm-900">{f.label}</p>
                    <p className="text-xs text-warm-500">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary + button */}
            <div className="bg-warm-50 border border-warm-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-warm-600 text-sm">Your {frequency} donation:</p>
                <p className="font-impact text-[2rem] text-primary-600 leading-none">{displayAmount}</p>
              </div>
              <button onClick={handleDonate}
                disabled={amount === 'other' && !custom}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Heart className="w-4 h-4" /> Complete Donation
              </button>
              <p className="text-xs text-warm-400 text-center mt-3">Demo only — no payment will be processed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Where your donation goes */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Allocation bar chart */}
          <div>
            <p className="eyebrow">Transparency</p>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-8">Where it goes</h2>
            <div className="flex h-10 rounded overflow-hidden mb-6">
              {ALLOCATION.map((a) => (
                <div key={a.label} style={{ width: `${a.pct}%`, background: a.color }}
                  className="flex items-center justify-center text-white text-xs font-bold">
                  {a.pct}%
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {ALLOCATION.map((a) => (
                <div key={a.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: a.color }} />
                  <p className="text-sm text-warm-700 font-medium flex-1">{a.label}</p>
                  <p className="text-sm font-bold text-warm-900">{a.pct}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact stories */}
          <div>
            <p className="eyebrow">Your Impact</p>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-8">What your gift does</h2>
            <div className="space-y-0 border-t border-warm-200">
              {IMPACT.map((item) => (
                <div key={item.amount} className="grid grid-cols-[64px_1fr] gap-4 py-5 border-b border-warm-200">
                  <div className="text-center">
                    <p className="font-impact text-2xl text-primary-600 leading-none">{item.amount}</p>
                  </div>
                  <div>
                    <p className="font-display font-bold text-warm-900 text-sm mb-1">{item.headline}</p>
                    <p className="text-warm-600 text-xs leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Employer match / other ways to give */}
      <section className="bg-warm-50 py-14 px-8 border-t border-warm-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Other Ways to Give</p>
            <h2 className="font-display font-extrabold text-xl text-warm-900 mb-1">Employer matching doubles your impact</h2>
            <p className="text-warm-600 text-sm max-w-md">
              Many employers match charitable donations. Check with your HR team — your $100 gift could become $200.
            </p>
          </div>
          <a href={`mailto:${siteSettings.email}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-warm-300 text-warm-700 text-sm font-semibold rounded-lg hover:bg-warm-100 transition-colors flex-shrink-0">
            Contact Us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
