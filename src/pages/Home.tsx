import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events, stats } from '../data/mockData';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const programs = [
  {
    num: '01',
    title: 'Youth Mentorship',
    body: 'Empower the next generation through educational support, career guidance, and personal development programs tailored for students and young professionals.',
    cta: 'Become a mentor',
    href: '/volunteer',
    img: 'https://picsum.photos/640/400?grayscale&random=51',
    imgAlt: 'Youth mentorship',
  },
  {
    num: '02',
    title: 'Community Events',
    body: "From small career talks to the Vancouver Career Fair — we organize events that connect people, create opportunities, and strengthen Vancouver's neighborhood bonds.",
    cta: 'View upcoming events',
    href: '/events',
    img: 'https://picsum.photos/640/400?grayscale&random=52',
    imgAlt: 'Community event',
  },
  {
    num: '03',
    title: 'Environmental Action',
    body: "VIVA EG leads shoreline cleanups, tree planting, and sustainability initiatives that preserve Vancouver's natural spaces for future generations.",
    cta: 'Join a cleanup',
    href: '/volunteer',
    img: 'https://picsum.photos/640/400?grayscale&random=53',
    imgAlt: 'Shoreline cleanup',
  },
];

const honours = [
  {
    name: 'Mark Carney',
    role: 'Prime Minister of Canada',
    tier: 'Federal · 2025',
    accent: '#c1272d',
    quote:
      '"VIVA\'s dedication to strengthening communities through volunteer service exemplifies the spirit of Canadian civic engagement."',
    img: 'https://picsum.photos/56/56?grayscale&random=60',
  },
  {
    name: 'Premier of British Columbia',
    role: 'Province of British Columbia',
    tier: 'Provincial · 2025',
    accent: '#1a5c9e',
    quote:
      '"British Columbia is proud to recognize VIVA for their outstanding contributions to youth development and community building."',
    img: 'https://picsum.photos/56/56?grayscale&random=61',
  },
  {
    name: 'Mayor of Burnaby',
    role: 'City of Burnaby',
    tier: 'Municipal · 2024',
    accent: '#15803d',
    quote:
      '"VIVA has become an essential part of our city\'s volunteer ecosystem — connecting thousands of residents with meaningful community work."',
    img: 'https://picsum.photos/56/56?grayscale&random=62',
  },
  {
    name: 'UBC Student Affairs',
    role: 'University of British Columbia',
    tier: 'Academic · 2025',
    accent: '#002145',
    quote:
      '"The VIVA × UBC partnership has given hundreds of international students a real pathway into Canadian professional life."',
    img: 'https://picsum.photos/56/56?grayscale&random=63',
  },
];

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function parseEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getUTCDate(),
    month: MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  };
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const upcoming = events.filter((e) => !e.isPast).slice(0, 4);

  return (
    <div>
      {/* ── HERO (Layout B: Split dark + photo) ── */}
      <section className="min-h-screen bg-warm-900 flex flex-col -mt-20">
        <div className="flex-1 flex items-center max-w-7xl mx-auto w-full px-8 pt-28 pb-16 gap-16
                        lg:grid lg:grid-cols-2">

          {/* Left: text */}
          <div>
            <motion.p
              {...(prefersReducedMotion ? {} : fadeUp(0.1))}
              className="text-xs font-bold tracking-widest uppercase text-accent-500 mb-6"
            >
              Vancouver · Since 2018
            </motion.p>

            <motion.h1
              {...(prefersReducedMotion ? {} : fadeUp(0.2))}
              className="font-impact text-[clamp(4.5rem,9vw,7.5rem)] text-white leading-[0.88] tracking-wide mb-7"
            >
              EMPOWER<br />
              <span className="text-accent-500">CONNECT</span><br />
              SERVE
            </motion.h1>

            <motion.p
              {...(prefersReducedMotion ? {} : fadeUp(0.3))}
              className="text-warm-400 text-[1.0625rem] leading-relaxed max-w-md mb-10"
            >
              VIVA brings together passionate volunteers and community members across
              Vancouver — from shoreline cleanups to career fairs, senior care to youth mentorship.
            </motion.p>

            <motion.div
              {...(prefersReducedMotion ? {} : fadeUp(0.4))}
              className="flex gap-3 flex-wrap"
            >
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors shadow-warm"
              >
                Become a Volunteer
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white border border-white/25 bg-white/10 hover:bg-white/20 transition-colors"
              >
                View Events <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: photo + floating stat tiles */}
          <motion.div
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.3 } })}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
              <img
                src="https://picsum.photos/640/500?grayscale&random=1"
                alt="VIVA volunteers"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stat tile: bottom-left */}
            <div className="absolute -bottom-5 -left-6 bg-white rounded-xl px-5 py-4 shadow-soft-lg min-w-[160px]">
              <p className="font-impact text-4xl text-primary-600 leading-none mb-1">2,500+</p>
              <p className="text-xs text-warm-600 font-medium">Active Volunteers</p>
            </div>
            {/* Stat tile: top-right */}
            <div className="absolute top-6 -right-5 bg-primary-600 rounded-xl px-5 py-4 shadow-soft-lg">
              <p className="font-impact text-3xl text-white leading-none mb-1">120</p>
              <p className="text-xs text-white/75 font-medium">Events / Year</p>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="bg-white border-t border-warm-200">
          <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.id} className="text-center">
                <p className="font-impact text-3xl text-primary-600 leading-none mb-1">
                  {s.value.toLocaleString()}{s.suffix}
                </p>
                <p className="text-xs text-warm-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMS (alternating image/text rows) ── */}
      <section className="bg-warm-50 py-20">
        <div className="text-center px-8 mb-16">
          <p className="eyebrow">What We Do</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900">
            Programs That Move Communities
          </h2>
        </div>

        {programs.map((p, i) => (
          <div
            key={p.num}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[340px] ${i % 2 === 1 ? '' : ''}`}
          >
            {/* Image — alternates sides */}
            <div className={`relative overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img src={p.img} alt={p.imgAlt} className="w-full h-full object-cover min-h-[280px]" />
            </div>

            {/* Text */}
            <div
              className={`flex flex-col justify-center px-12 py-14 ${
                i % 2 === 1 ? 'bg-warm-50 lg:order-1' : 'bg-white'
              }`}
            >
              <p className="font-impact text-[5rem] text-warm-200 leading-none mb-[-1rem] select-none">
                {p.num}
              </p>
              <h3 className="font-display font-extrabold text-2xl text-warm-900 mb-4">{p.title}</h3>
              <p className="text-warm-600 text-[0.9375rem] leading-relaxed mb-5 max-w-md">{p.body}</p>
              <Link
                to={p.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group"
              >
                {p.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── HONOURS (carousel) ── */}
      <section className="bg-warm-50 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Honours & Recognition</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-3">
            Recognized by Canada's Leaders
          </h2>
          <p className="text-warm-600 text-[0.9375rem] mb-8 max-w-lg">
            VIVA's impact has been acknowledged at the highest levels of government.
          </p>

          {/* Scroll track */}
          <div className="honours-track">
            {honours.map((h) => (
              <div
                key={h.name}
                className="honours-card bg-white border border-warm-200 border-l-4 p-8"
                style={{ borderLeftColor: h.accent }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-warm-200">
                    <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-[0.9375rem] text-warm-900">{h.name}</p>
                    <p className="text-sm text-warm-600">{h.role}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color: h.accent }}>
                      {h.tier}
                    </p>
                  </div>
                </div>
                <p className="text-warm-700 text-[0.9375rem] leading-relaxed italic">{h.quote}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs text-warm-400">Scroll for more recognitions →</span>
            <div className="flex gap-1.5">
              <div className="w-5 h-1 rounded-sm bg-primary-600" />
              <div className="w-2 h-1 rounded-sm bg-warm-200" />
              <div className="w-2 h-1 rounded-sm bg-warm-200" />
              <div className="w-2 h-1 rounded-sm bg-warm-200" />
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS (date-first list) ── */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="eyebrow">Upcoming Events</p>
              <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900">
                Join Us in 2026
              </h2>
            </div>
            <Link
              to="/events"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              All events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="border-t border-warm-200">
            {upcoming.length === 0 ? (
              <div className="py-12 text-center text-warm-500">
                No upcoming events right now — follow{' '}
                <a
                  href="https://instagram.com/viva_hq"
                  className="text-primary-600 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @viva_hq
                </a>{' '}
                for announcements.
              </div>
            ) : (
              upcoming.map((ev) => {
                const { day, month, year } = parseEventDate(ev.date);
                return (
                  <div
                    key={ev.id}
                    className="grid grid-cols-[100px_1fr_auto_auto] items-center gap-6 py-5 border-b border-warm-200 group"
                  >
                    {/* Date */}
                    <div>
                      <p className="font-impact text-[2.5rem] text-warm-700 leading-none">{day}</p>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400">
                        {month} {year}
                      </p>
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-display font-bold text-[0.9375rem] text-warm-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {ev.title}
                      </p>
                      <p className="text-xs text-warm-500">📍 {ev.location}</p>
                    </div>

                    {/* Status */}
                    {ev.status === 'open' && (
                      <span className="status-open hidden sm:inline-flex">Open</span>
                    )}

                    {/* CTA */}
                    <Link
                      to={`/events/${ev.slug}`}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      Details
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── VOLUNTEER CTA ── */}
      <section className="gradient-hero py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-3">
              Get Involved
            </p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.5rem)] text-white leading-tight mb-3">
              Ready to make a difference?
            </h2>
            <p className="text-white/80 text-[0.9375rem] max-w-md leading-relaxed">
              Join 2,500+ volunteers across Vancouver. Flexible roles, real impact, lasting friendships.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-wrap">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-warm-100 transition-colors shadow-soft"
            >
              Become a Volunteer
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-white border border-white/30 bg-white/15 hover:bg-white/25 transition-colors"
            >
              <Heart className="w-4 h-4" /> Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
