import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import EventAdminContactModal from '../components/events/EventAdminContactModal';
import { supabase } from '../lib/supabase';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { useEventYears } from '../hooks/useEventYears';
import { useEventsByYear } from '../hooks/useEventsByYear';
import type { Event } from '../types';

type EventItem = Event;

const FILTERS = [
  { key: 'all', label: 'All Events' },
  { key: 'community', label: 'Community' },
  { key: 'career', label: 'Career' },
  { key: 'social', label: 'Social' },
  { key: 'fundraiser', label: 'Fundraiser' },
];

const TYPE_CONFIG: Record<string, { bg: string; color: string; label: string; accent: string }> = {
  'community-service': { bg: '#fff0f1', color: '#a31f26', label: 'Community', accent: '#c1272d' },
  career: { bg: '#fef3c7', color: '#92400e', label: 'Career', accent: '#f59e0b' },
  fundraiser: { bg: '#f5f3ff', color: '#6d28d9', label: 'Fundraiser', accent: '#7c3aed' },
  social: { bg: '#f0fdf4', color: '#15803d', label: 'Social', accent: '#16a34a' },
  workshop: { bg: '#eff6ff', color: '#1e40af', label: 'Workshop', accent: '#2563eb' },
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] || TYPE_CONFIG['community-service'];
}

function parseEventDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return {
    date,
    day: date.getDate(),
    month: MONTHS[date.getMonth()],
    year: date.getFullYear(),
  };
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getEventTiming(event: EventItem) {
  const start = parseEventDate(event.date).date;
  const end = event.endDate ? parseEventDate(event.endDate).date : start;
  const today = startOfToday();
  const daysUntil = Math.ceil((start.getTime() - today.getTime()) / 86400000);
  const isPastByDate = end.getTime() < today.getTime();

  return {
    daysUntil,
    isPast: isPastByDate || event.isPast,
  };
}

function matchesFilter(event: EventItem, filter: string) {
  if (filter === 'all') return true;
  if (filter === 'community') return event.type === 'community-service' || event.type === 'social';
  return event.type === filter || event.tags.includes(filter);
}

function formatToday() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function formatLongDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function useReveal(threshold = 0.05, delay = 0) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [threshold, delay]);

  return { ref, visible };
}

function FeaturedEvent({ event, onContactAdmin }: { event: EventItem; onContactAdmin: (event: EventItem) => void }) {
  const type = getTypeConfig(event.type);
  const { day, month, year } = parseEventDate(event.date);
  const { daysUntil } = getEventTiming(event);
  const pctFull = event.capacity > 0 ? Math.round((event.registered / event.capacity) * 100) : 0;
  const spotsLeft = Math.max(event.capacity - event.registered, 0);
  const urgent = pctFull >= 70;

  return (
    <article className="grid overflow-hidden rounded-[20px] border-2 border-warm-200 bg-white shadow-[0_8px_40px_-12px_rgba(28,20,16,0.10)] lg:grid-cols-2">
      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-primary-50">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(193,39,45,0.14)_0%,transparent_58%)]" />
            <div className="relative text-center">
              <div className="font-impact text-[6rem] leading-none tracking-wide text-primary-600/10">VIVA</div>
              <span
                className="inline-block rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                style={{ background: type.bg, color: type.color }}
              >
                {type.label}
              </span>
            </div>
          </>
        )}

        <div className="absolute right-5 top-5 rounded-xl bg-white px-4 py-3 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]">
          <div className="font-impact text-[2rem] leading-none text-primary-600">{day}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-warm-500">
            {month} {year}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-11">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span
            className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{ background: type.bg, color: type.color }}
          >
            {type.label}
          </span>
          {daysUntil > 0 && daysUntil <= 30 && (
            <span className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${daysUntil <= 7 ? 'bg-accent-100 text-accent-800' : 'bg-warm-100 text-warm-600'}`}>
              {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days away`}
            </span>
          )}
          {daysUntil === 0 && (
            <span className="rounded-md bg-accent-100 px-2.5 py-1 text-[11px] font-bold text-accent-800">Today</span>
          )}
        </div>

        <h2 className="mb-2.5 font-display text-2xl font-extrabold leading-tight text-warm-900">{event.title}</h2>
        <p className="mb-1 text-[13px] text-warm-500">Location: {event.location}</p>
        <p className="mb-4 text-[13px] text-warm-500">Time: {event.time}</p>
        <p className="mb-5 text-sm leading-relaxed text-warm-600">{event.description}</p>

        {event.capacity > 0 && (
          <div className="mb-5">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-semibold text-warm-700">Spots Filled</span>
              <span className={`font-medium ${urgent ? 'text-accent-700' : 'text-warm-500'}`}>
                {event.registered} / {event.capacity} ({pctFull}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-warm-200">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${urgent ? 'bg-accent-500' : 'bg-primary-600'}`}
                style={{ width: `${pctFull}%` }}
              />
            </div>
            {urgent && <p className="mt-1.5 text-[11px] font-medium text-accent-700">Only {spotsLeft} spots remaining. Register soon.</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => onContactAdmin(event)} className="btn-primary px-6 py-2.5 text-sm shadow-warm">
            Join as Volunteer
          </button>
          <span className="status-open">Open</span>
          <Link to={`/events/${event.slug}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function EventListRow({ event, delay = 0 }: { event: EventItem; delay?: number }) {
  const { ref, visible } = useReveal(0.05, delay);
  const [hovered, setHovered] = useState(false);
  const type = getTypeConfig(event.type);
  const { day, month, year } = parseEventDate(event.date);
  const { daysUntil } = getEventTiming(event);
  const pctFull = event.capacity > 0 ? Math.round((event.registered / event.capacity) * 100) : 0;
  const urgent = pctFull >= 70;

  return (
    <Link
      ref={ref}
      to={`/events/${event.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grid gap-4 border-b border-warm-200 py-4 text-left sm:grid-cols-[76px_1fr_auto_auto] sm:items-center"
      style={{
        background: hovered ? '#fff8f6' : 'white',
        borderRadius: hovered ? 12 : 0,
        marginLeft: hovered ? -20 : 0,
        marginRight: hovered ? -20 : 0,
        paddingLeft: hovered ? 20 : 0,
        paddingRight: hovered ? 20 : 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(12px)',
        transition: 'all 0.2s ease',
      }}
    >
      <div>
        <div className="font-impact text-[2.2rem] leading-none text-warm-900">{day}</div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-warm-400">
          {month} {year}
        </div>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: type.bg, color: type.color }}
          >
            {type.label}
          </span>
          {daysUntil > 0 && daysUntil <= 14 && (
            <span className="rounded bg-accent-100 px-2 py-0.5 text-[10px] font-semibold text-accent-800">
              {daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d away`}
            </span>
          )}
        </div>
        <h3 className={`mb-1 font-display text-[0.9375rem] font-bold transition-colors ${hovered ? 'text-primary-600' : 'text-warm-900'}`}>
          {event.title}
        </h3>
        <p className="text-xs text-warm-500">Location: {event.location}</p>
        {event.capacity > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-[3px] w-24 overflow-hidden rounded-full bg-warm-200">
              <div className={`h-full rounded-full ${urgent ? 'bg-accent-500' : 'bg-primary-600'}`} style={{ width: `${pctFull}%` }} />
            </div>
            <span className={`text-[10px] font-medium ${urgent ? 'text-accent-700' : 'text-warm-400'}`}>
              {urgent ? `${Math.max(event.capacity - event.registered, 0)} left` : `${pctFull}% filled`}
            </span>
          </div>
        )}
      </div>

      <span className="status-open w-fit">Open</span>
      <span
        className={`w-fit rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
          hovered ? 'border-primary-600 bg-primary-600 text-white' : 'border-primary-200 text-primary-600'
        }`}
      >
        {hovered ? 'Register' : 'Details'}
      </span>
    </Link>
  );
}

function PastEventRow({ event }: { event: EventItem }) {
  const { day, month } = parseEventDate(event.date);

  return (
    <Link
      to={`/events/${event.slug}`}
      className="grid gap-4 border-b border-warm-100 py-3.5 transition-all hover:rounded-lg hover:bg-white hover:px-3 sm:grid-cols-[60px_1fr_auto] sm:items-center"
    >
      <div>
        <div className="font-impact text-[1.75rem] leading-none text-warm-400">{day}</div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-warm-300">{month}</div>
      </div>
      <div>
        <h4 className="mb-0.5 font-display text-sm font-bold text-warm-600">{event.title}</h4>
        <p className="text-xs text-warm-400">Location: {event.location}</p>
        {event.recap && (
          <p className="mt-1 text-[11px] text-warm-400">
            {event.recap.volunteersCount} volunteers · {event.recap.hoursServed} hrs · {event.recap.beneficiaries} beneficiaries
          </p>
        )}
      </div>
      <span className="text-xs font-semibold text-warm-400">Recap</span>
    </Link>
  );
}

/** Lazy-loads events for a single year when the dropdown is open */
function YearSection({ year, isOpen, onToggle }: { year: number; isOpen: boolean; onToggle: () => void }) {
  const { data: yearEvents, loading } = useEventsByYear(year, isOpen);
  return (
    <div className="year-row">
      <button
        onClick={onToggle}
        className="year-toggle w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="font-impact text-[2.5rem] leading-none text-warm-400">{year}</span>
          {isOpen && !loading && (
            <span className="text-sm text-warm-400">{yearEvents.length} event{yearEvents.length === 1 ? '' : 's'}</span>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-warm-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-6">
          {loading ? (
            <div className="animate-pulse space-y-3 py-4">
              {[1,2].map(i => <div key={i} className="h-16 bg-warm-100 rounded-lg" />)}
            </div>
          ) : (
            yearEvents.map((event) => <PastEventRow key={event.id} event={event} />)
          )}
        </div>
      )}
    </div>
  );
}

export default function Events() {
  const [filter, setFilter] = useState('all');
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const [contactEvent, setContactEvent] = useState<EventItem | null>(null);
  const [contactForSlug, setContactForSlug] = useState<import('../types').EventVolunteerContact | null>(null);
  const [globalContact, setGlobalContact] = useState<import('../types').EventVolunteerContact | null>(null);

  const { data: upcomingEvents } = useUpcomingEvents();
  const { data: pastYears } = useEventYears();

  useEffect(() => {
    let cancelled = false;
    async function loadContact() {
      const { data } = await supabase
        .from('event_volunteer_contact_settings')
        .select('*')
        .eq('published', true)
        .maybeSingle();
      if (cancelled || !data) return;
      setGlobalContact({
        adminName: data.admin_name as string,
        adminRole: data.admin_role as string,
        adminWechatId: data.admin_wechat_id as string | undefined,
        adminWechatQrUrl: data.admin_wechat_qr_url as string | undefined,
        adminContactNote: data.admin_contact_note as string | undefined,
      });
    }
    loadContact();
    return () => { cancelled = true; };
  }, []);

  const filteredUpcoming = upcomingEvents
    .sort((a, b) => parseEventDate(a.date).date.getTime() - parseEventDate(b.date).date.getTime())
    .filter((event) => matchesFilter(event, filter));
  const featured = filteredUpcoming[0];
  const rest = filteredUpcoming.slice(1);

  const toggleYear = (year: number) => {
    setOpenYears((current) => {
      const next = new Set(current);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  function handleContactAdmin(event: EventItem, contact: import('../types').EventVolunteerContact | null) {
    setContactEvent(event);
    setContactForSlug(contact);
  }

  return (
    <div className="bg-warm-50">
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">2026 Season</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] leading-tight text-warm-900">
              Events
            </h1>
          </div>
        </div>
      </div>

      <div className="border-b border-warm-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`whitespace-nowrap rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                filter === item.key
                  ? 'bg-primary-600 text-white shadow-warm'
                  : 'bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredUpcoming.length === 0 ? (
            <div className="border border-dashed border-warm-200 bg-warm-50 px-6 py-14 text-center">
              <h2 className="mb-2 font-display text-lg font-bold text-warm-900">No events in this category right now</h2>
              <p className="text-sm text-warm-500">
                Follow <a href="https://instagram.com/viva_hq" className="font-semibold text-primary-600">@viva_hq</a> for announcements.
              </p>
            </div>
          ) : (
            <>
              {featured && <FeaturedEvent event={featured} onContactAdmin={(ev) => handleContactAdmin(ev, globalContact)} />}
              {rest.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-0 font-display text-base font-bold uppercase tracking-widest text-warm-400">More Events</h2>
                  <div>{rest.map((event, index) => <EventListRow key={event.id} event={event} delay={index * 80} />)}</div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="px-4 sm:px-8">
        <div className="today-divider mx-auto max-w-7xl">
          <span className="today-label">TODAY — {formatToday()}</span>
        </div>
      </div>

      <section className="px-4 pb-16 pt-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {pastYears.length === 0 ? (
            <p className="py-10 text-center text-sm text-warm-400">Past event records will appear here.</p>
          ) : (
            pastYears.map((year) => (
              <YearSection
                key={year}
                year={year}
                isOpen={openYears.has(year)}
                onToggle={() => toggleYear(year)}
              />
            ))
          )}
        </div>
      </section>

      <section className="gradient-hero px-8 py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/60">Get Involved</p>
            <h2 className="font-display text-2xl font-extrabold text-white">Volunteer at our next event</h2>
            <p className="mt-1 text-sm text-white/70">No experience needed. Just your time and enthusiasm.</p>
          </div>
          <button type="button" onClick={() => featured && handleContactAdmin(featured, globalContact)} className="inline-flex flex-shrink-0 items-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary-600 transition-all hover:-translate-y-0.5 hover:bg-warm-50">
            Become a Volunteer
          </button>
        </div>
      </section>

      <span className="sr-only">Dates are derived from event date fields. Today is {formatLongDate(new Date().toISOString().slice(0, 10))}.</span>
      {contactEvent && contactForSlug && (
        <EventAdminContactModal
          event={contactEvent}
          contact={contactForSlug}
          onClose={() => { setContactEvent(null); setContactForSlug(null); }}
        />
      )}
    </div>
  );
}
