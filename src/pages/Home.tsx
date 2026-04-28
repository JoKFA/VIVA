import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events, stats, honours, testimonials } from '../data/mockData';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const programs = [
  {
    num: '01',
    accent: '#c1272d',
    title: 'Youth Mentorship',
    body: 'Empower the next generation through educational support, career guidance, and personal development programs tailored for students and young professionals.',
    cta: 'Become a mentor',
    href: '/volunteer',
    img: 'https://picsum.photos/640/400?grayscale&random=51',
    imgAlt: 'Youth mentorship',
  },
  {
    num: '02',
    accent: '#1a5c9e',
    title: 'Community Events',
    body: "From small career talks to the Vancouver Career Fair — we organize events that connect people, create opportunities, and strengthen Vancouver's neighborhood bonds.",
    cta: 'View upcoming events',
    href: '/events',
    img: 'https://picsum.photos/640/400?grayscale&random=52',
    imgAlt: 'Community event',
  },
  {
    num: '03',
    accent: '#15803d',
    title: 'Environmental Action',
    body: "VIVA EG leads shoreline cleanups, tree planting, and sustainability initiatives that preserve Vancouver's natural spaces for future generations.",
    cta: 'Join a cleanup',
    href: '/volunteer',
    img: 'https://picsum.photos/640/400?grayscale&random=53',
    imgAlt: 'Shoreline cleanup',
  },
  {
    num: '04',
    accent: '#b45309',
    title: 'Career Development',
    body: 'Empowering youth and young professionals through resume building, networking events, online seminars, and career fairs to help them achieve their professional goals.',
    cta: 'Explore opportunities',
    href: '/events',
    img: 'https://picsum.photos/640/400?grayscale&random=54',
    imgAlt: 'Career development',
  },
];


function HonoursMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(0);
  const [paused, setPaused] = useState(false);
  const doubled = [...honours, ...honours];

  const measure = useCallback(() => {
    if (!wrapRef.current) return;
    const w = wrapRef.current.offsetWidth;
    // 2 cards visible with 24px gap between them
    setCardW(Math.floor((w - 24) / 2));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <section className="bg-warm-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10">
        <p className="eyebrow">Honours & Recognition</p>
        <div className="flex items-end justify-between gap-6">
          <div className="home-hero-copy">
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-2">
              Recognized by Canada's Leaders
            </h2>
            <p className="text-warm-600 text-[0.9375rem] max-w-lg">
              VIVA's impact has been acknowledged at the highest levels of government.
            </p>
          </div>
          <Link
            to="/about"
            className="flex-shrink-0 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            View all letters
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Marquee viewport — overflow hidden clips cards outside the 2-up window */}
      <div
        ref={wrapRef}
        className="max-w-7xl mx-auto overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {cardW > 0 && (
          <div
            className={`honours-marquee-track${paused ? ' paused' : ''}`}
          >
            {doubled.map((h, i) => (
              <div
                key={`${h.id}-${i}`}
                className="flex-shrink-0 bg-white border border-warm-200 rounded-xl overflow-hidden flex flex-col"
                style={{ width: cardW, marginRight: 24 }}
              >
                {/* Colored top accent */}
                <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: h.accent }} />

                {/* Body */}
                <div className="flex-1 px-6 pt-5 pb-4">
                  {/* Tier badge */}
                  <span
                    className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded mb-4"
                    style={{ color: h.accent, backgroundColor: `${h.accent}15` }}
                  >
                    {h.tier}
                  </span>

                  {/* Pull quote */}
                  <blockquote
                    className="text-[0.9375rem] text-warm-700 leading-relaxed italic border-l-2 pl-4 mb-5"
                    style={{ borderColor: h.accent }}
                  >
                    "{h.quote}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: h.accent }}
                      >
                        {h.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-warm-900 leading-tight">{h.name}</p>
                        <p className="text-xs text-warm-500">{h.title}</p>
                      </div>
                    </div>
                    <Link
                      to="/about"
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap flex-shrink-0"
                    >
                      Full letter →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = (i: number) => {
    if (i === idx) return;
    setFading(true);
    setTimeout(() => { setIdx(i); setFading(false); }, 280);
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx((i) => (i + 1) % count); setFading(false); }, 280);
    }, 5500);
    return () => clearInterval(t);
  }, [paused, count]);

  const t = testimonials[idx];

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: '#1c1a16' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Warm crimson orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -100, right: -80, width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(193,39,45,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>

          {/* Quote content */}
          <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.28s ease' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 3, height: 24, background: '#c1272d', borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c1272d' }}>
                Community Voices
              </span>
            </div>

            {/* Large opening quote mark */}
            <div style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '5rem', color: '#c1272d',
              lineHeight: 0.6, opacity: 0.6,
              marginBottom: 16, userSelect: 'none',
            }}>
              &ldquo;
            </div>

            {/* Quote text — Manrope, not italic */}
            <p style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.92)',
              marginBottom: 28,
            }}>
              {t.quote}
            </p>

            {/* Attribution */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: '#c1272d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}>
                {t.author.charAt(0)}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>{t.author}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t.role}</p>
              </div>
            </div>
          </div>

          {/* Vertical dot navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Testimonial ${i + 1}`}
                style={{
                  width: 8,
                  height: i === idx ? 28 : 8,
                  borderRadius: 4,
                  background: i === idx ? '#c1272d' : 'rgba(255,255,255,0.2)',
                  border: 'none', cursor: 'pointer',
                  transition: 'height 0.3s ease, background 0.3s ease',
                  padding: 0, flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function parseEventDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear(),
  };
}

const EVENT_TYPE_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  'community-service': { bg: '#fff0f1', color: '#a31f26', label: 'Community' },
  career: { bg: '#fef3c7', color: '#92400e', label: 'Career' },
  fundraiser: { bg: '#f5f3ff', color: '#6d28d9', label: 'Fundraiser' },
  social: { bg: '#f0fdf4', color: '#15803d', label: 'Social' },
  workshop: { bg: '#eff6ff', color: '#1e40af', label: 'Workshop' },
};

function getEventTypeConfig(type: string) {
  return EVENT_TYPE_CONFIG[type] || EVENT_TYPE_CONFIG['community-service'];
}

function getEventTiming(event: (typeof events)[number]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${event.date}T00:00:00`);
  const end = event.endDate ? new Date(`${event.endDate}T00:00:00`) : start;
  const daysUntil = Math.ceil((start.getTime() - today.getTime()) / 86400000);

  return {
    daysUntil,
    isPast: end.getTime() < today.getTime() || event.isPast,
  };
}

function HomeEventRow({ ev }: { ev: (typeof events)[number] }) {
  const [hovered, setHovered] = useState(false);
  const { day, month, year } = parseEventDate(ev.date);
  const { daysUntil } = getEventTiming(ev);
  const pct = ev.capacity > 0 ? Math.round((ev.registered / ev.capacity) * 100) : 0;
  const almostFull = pct >= 70;
  const type = getEventTypeConfig(ev.type);

  return (
    <Link
      to={`/events/${ev.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grid gap-4 border-b border-warm-200 sm:grid-cols-[80px_1fr_auto] sm:items-center"
      style={{
        background: hovered ? '#fff8f6' : 'transparent',
        borderRadius: hovered ? 12 : 0,
        marginLeft: hovered ? -16 : 0,
        marginRight: hovered ? -16 : 0,
        padding: hovered ? '18px 16px' : '18px 0',
        transition: 'all 0.2s ease',
      }}
    >
      <div>
        <p className="font-impact text-[2.5rem] leading-none text-warm-900">{day}</p>
        <p className="text-[9px] font-bold uppercase tracking-widest text-warm-400">
          {month} {year}
        </p>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className="rounded-[5px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: type.bg, color: type.color }}
          >
            {type.label}
          </span>
          {daysUntil >= 0 && daysUntil <= 30 && (
            <span className={`rounded-[5px] px-2 py-0.5 text-[10px] font-bold ${daysUntil <= 7 ? 'bg-accent-100 text-accent-700' : 'bg-warm-100 text-warm-500'}`}>
              {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
            </span>
          )}
        </div>
        <p className={`mb-1 font-display text-[0.9375rem] font-bold transition-colors ${hovered ? 'text-primary-600' : 'text-warm-900'}`}>
          {ev.title}
        </p>
        <p className="text-xs text-warm-500">Location: {ev.location}</p>
        {ev.capacity > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 max-w-[140px] flex-1 overflow-hidden rounded-full bg-warm-200">
              <div className={`h-full rounded-full transition-[width] duration-700 ${almostFull ? 'bg-accent-500' : 'bg-primary-600'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-[10px] font-medium ${almostFull ? 'text-accent-700' : 'text-warm-400'}`}>
              {almostFull ? `${Math.max(ev.capacity - ev.registered, 0)} spots left` : `${ev.registered}/${ev.capacity} filled`}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <span className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${hovered ? 'border-primary-600 bg-primary-600 text-white' : 'border-primary-200 text-primary-600'}`}>
          {hovered ? 'Register' : 'Details'}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const upcoming = events
    .filter((e) => !getEventTiming(e).isPast)
    .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime())
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="home-hero-bg min-h-screen bg-warm-900 flex flex-col -mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.30)_0%,rgba(8,8,7,0.16)_46%,rgba(8,8,7,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.12)_0%,rgba(8,8,7,0)_48%,rgba(8,8,7,0.20)_100%)]" />
        <div className="home-hero-grid relative flex-1 items-center max-w-7xl mx-auto w-full px-8 pt-32 pb-16 gap-12">

          {/* Left: text */}
          <div className="home-hero-copy">
            <motion.p
              {...(prefersReducedMotion ? {} : fadeUp(0.1))}
              className="text-xs font-bold tracking-widest uppercase text-accent-500 mb-6"
            >
              Vancouver · Since 2018
            </motion.p>

            <motion.h1
              {...(prefersReducedMotion ? {} : fadeUp(0.2))}
              className="font-impact text-[clamp(4.6rem,8.4vw,7.5rem)] text-white leading-[0.88] tracking-wide mb-7 drop-shadow-[0_2px_18px_rgba(0,0,0,0.36)]"
            >
              EMPOWER<br />
              <span className="text-accent-500">CONNECT</span><br />
              SERVE
            </motion.h1>

            <motion.p
              {...(prefersReducedMotion ? {} : fadeUp(0.3))}
              className="text-white/70 text-[1.0625rem] leading-relaxed max-w-md mb-10"
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
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors shadow-warm"
              >
                Become a Volunteer
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-colors"
              >
                View Events <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: photo + floating stat tiles */}
          <motion.div
            {...(prefersReducedMotion ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, delay: 0.3 } })}
            className="home-hero-media relative"
          >
            <div className="relative w-full h-[clamp(360px,38vw,500px)] rounded-2xl overflow-hidden shadow-[0_20px_70px_-26px_rgba(0,0,0,0.65)]">
              <img
                src="https://picsum.photos/640/500?grayscale&random=1"
                alt="VIVA volunteers"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/10" />
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
        <div className="relative bg-white border-t border-warm-200">
          <div className="overflow-x-auto scrollbar-none">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-5 grid grid-cols-4 gap-4 min-w-[560px]">
              {stats.map((s) => (
                <div key={s.id} className="text-center">
                  <p className="font-impact text-[2rem] sm:text-3xl text-primary-600 leading-none mb-1">
                    {s.value.toLocaleString()}{s.suffix}
                  </p>
                  <p className="text-[11px] sm:text-xs text-warm-500 font-medium whitespace-nowrap">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
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
            className="group grid grid-cols-1 lg:grid-cols-2 lg:min-h-[340px]"
          >
            {/* Image — alternates sides */}
            <div className={`relative overflow-hidden h-[210px] sm:h-[250px] lg:h-auto ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img
                src={p.img}
                alt={p.imgAlt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-warm-900/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            {/* Text */}
            <div
              className={`flex flex-col justify-center px-6 lg:px-12 py-14 ${
                i % 2 === 1 ? 'bg-warm-50 lg:order-1' : 'bg-white'
              }`}
              style={{
                borderLeft: i % 2 === 0 ? `4px solid ${p.accent}` : undefined,
                borderRight: i % 2 === 1 ? `4px solid ${p.accent}` : undefined,
              }}
            >
              <p className="font-impact text-[5rem] text-warm-200 leading-none mb-[-1rem] select-none">
                {p.num}
              </p>
              <h3 className="font-display font-extrabold text-2xl text-warm-900 mb-4">{p.title}</h3>
              <p className="text-warm-600 text-[0.9375rem] leading-relaxed mb-5 max-w-md">{p.body}</p>
              <Link
                to={p.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-[gap,color] duration-200 group-hover:gap-2.5"
                style={{ color: p.accent }}
              >
                {p.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Upcoming events */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <p className="eyebrow">Get Involved</p>
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

          <div className="border-t-2 border-warm-200">
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
              upcoming.map((ev) => <HomeEventRow key={ev.id} ev={ev} />)
            )}
          </div>
        </div>
      </section>

      {/* Community voices */}
      <TestimonialsCarousel />

      {/* Honours */}
      <HonoursMarquee />

      {/* Volunteer CTA */}
      <section className="gradient-hero py-20 px-8 relative overflow-hidden">
        {/* Subtle gold orb top-right */}
        <div className="absolute pointer-events-none" style={{
          top: -80, right: 100, width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative">
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
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-600 rounded-lg font-bold text-sm shadow-soft hover:-translate-y-0.5 hover:bg-warm-50 transition-all duration-200"
            >
              Become a Volunteer
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm text-white border border-white/30 bg-white/15 hover:bg-white/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Heart className="w-4 h-4" /> Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
