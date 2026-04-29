import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import EventAdminContactModal from '../components/events/EventAdminContactModal';
import { useEventWithContact } from '../hooks/useEventWithContact';
import { SafeImage } from '../components/ui/SafeImage';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatLong(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDate(dateStr: string) {
  const d = new Date(dateStr);
  return { day: d.getUTCDate(), month: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
}

const STATUS_LABEL: Record<string, string> = {
  open: 'Registration Open',
  waitlist: 'Waitlist Only',
  closed: 'Registration Closed',
};

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { event, contact, loading } = useEventWithContact(slug ?? '');
  const [contactOpen, setContactOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 pt-20">
        <div className="animate-pulse text-warm-400">Loading event…</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 pt-20">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-2xl text-warm-900 mb-3">Event Not Currently Available</h1>
          <p className="text-warm-600 mb-6 text-sm">This event is not visible on the public site right now.</p>
          <Link to="/events" className="btn-primary">View All Events</Link>
        </div>
      </div>
    );
  }

  const { day, month, year } = parseDate(event.date);
  const spotsLeft = event.capacity - event.registered;
  const pctFull = Math.round((event.registered / event.capacity) * 100);

  return (
    <div>
      {/* Full-bleed image hero */}
      <div className="relative w-full h-[50vh] min-h-[340px] bg-warm-900 overflow-hidden">
        <SafeImage
          src={event.imageUrl || `https://picsum.photos/1400/600?grayscale&random=${event.id}`}
          fallbackSrc={`https://picsum.photos/1400/600?grayscale&random=${event.id}`}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-900 via-warm-900/60 to-transparent" />

        {/* content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-7xl mx-auto">
          <Link to="/events"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {event.isPast ? 'Past Events' : 'All Events'}
          </Link>
          <div className="flex flex-wrap items-end gap-8">
            {/* Date block */}
            <div>
              <p className="font-impact text-[4rem] text-white leading-none">{day}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-white/60">{month} {year}</p>
            </div>
            <div className="flex-1 min-w-0">
              {event.isPast && (
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-warm-700 text-warm-300 rounded mb-2">
                  Past Event
                </span>
              )}
              <h1 className="font-display font-extrabold text-[clamp(1.5rem,3vw,2.5rem)] text-white leading-tight">{event.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Body: 2-col */}
      <div className="bg-warm-50 px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* Left: main content */}
          <div className="space-y-8">
            {/* About */}
            <div className="bg-white border border-warm-200 p-8">
              <h2 className="font-display font-extrabold text-xl text-warm-900 mb-4">About This Event</h2>
              <p className="text-warm-600 leading-relaxed">{event.description}</p>
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {event.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-warm-100 text-warm-600 rounded-sm">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* What you'll do */}
            {event.whatYouWillDo && event.whatYouWillDo.length > 0 && (
              <div className="bg-white border border-warm-200 p-8">
                <h2 className="font-display font-extrabold text-xl text-warm-900 mb-5">What You'll Do</h2>
                <ul className="space-y-3">
                  {event.whatYouWillDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-warm-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white border border-warm-200 p-8">
                <h2 className="font-display font-extrabold text-xl text-warm-900 mb-5">Agenda</h2>
                <div className="space-y-3">
                  {event.agenda.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-warm-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recap (past events) */}
            {event.isPast && event.recap && (
              <div className="bg-white border border-warm-200 p-8">
                <h2 className="font-display font-extrabold text-xl text-warm-900 mb-5">Event Recap</h2>
                <p className="text-warm-600 leading-relaxed mb-7">{event.recap.summary}</p>

                <div className="grid grid-cols-3 gap-4 mb-7">
                  <div className="text-center border border-warm-200 py-5">
                    <p className="font-impact text-3xl text-primary-600 leading-none mb-1">{event.recap.volunteersCount}</p>
                    <p className="text-xs text-warm-500 font-medium">Volunteers</p>
                  </div>
                  <div className="text-center border border-warm-200 py-5">
                    <p className="font-impact text-3xl text-primary-600 leading-none mb-1">{event.recap.hoursServed}</p>
                    <p className="text-xs text-warm-500 font-medium">Hours Served</p>
                  </div>
                  <div className="text-center border border-warm-200 py-5">
                    <p className="font-impact text-3xl text-primary-600 leading-none mb-1">{event.recap.beneficiaries}</p>
                    <p className="text-xs text-warm-500 font-medium">People Helped</p>
                  </div>
                </div>

                {event.recap.quotes.length > 0 && (
                  <div className="space-y-4">
                    {event.recap.quotes.map((q, i) => (
                      <div key={i} className="bg-warm-50 border-l-4 border-primary-600 pl-5 py-4 pr-4">
                        <p className="text-warm-700 italic text-sm leading-relaxed mb-2">"{q.text}"</p>
                        <p className="text-xs font-semibold text-warm-600">{q.author}{q.role && <span className="text-warm-400 font-normal"> · {q.role}</span>}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: sticky sidebar */}
          <div className="space-y-5 self-start">
            {/* Details card */}
            <div className="bg-white border border-warm-200 p-6 sticky top-24">
              <h3 className="font-display font-bold text-warm-900 mb-5 pb-4 border-b border-warm-200">Event Details</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warm-900">{formatLong(event.date)}</p>
                    <p className="text-warm-500">{event.time}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warm-900">{event.location}</p>
                    {event.address && <p className="text-warm-500">{event.address}</p>}
                  </div>
                </li>
                {!event.isPast && (
                  <li className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-warm-900">{STATUS_LABEL[event.status]}</p>
                      <p className="text-warm-500">{event.registered} / {event.capacity} registered</p>
                      {/* Capacity bar */}
                      <div className="mt-2 h-1.5 bg-warm-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{ width: `${pctFull}%` }} />
                      </div>
                      {spotsLeft > 0 && spotsLeft <= 20 && (
                        <p className="text-xs text-amber-600 font-medium mt-1">{spotsLeft} spots left</p>
                      )}
                    </div>
                  </li>
                )}
              </ul>

              {!event.isPast && event.status === 'open' && (
                <button type="button" onClick={() => setContactOpen(true)} className="btn-primary w-full mt-6 text-sm">
                  Join as Volunteer
                </button>
              )}

              {/* Coordinator */}
              {event.leadContact && (
                <div className="mt-6 pt-5 border-t border-warm-200">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400 mb-3">Coordinator</p>
                  <p className="text-sm font-medium text-warm-900 mb-2">{event.leadContact.name}</p>
                  {event.leadContact.email && (
                    <a href={`mailto:${event.leadContact.email}`}
                      className="flex items-center gap-2 text-xs text-warm-500 hover:text-primary-600 transition-colors">
                      <Mail className="w-3.5 h-3.5" /> {event.leadContact.email}
                    </a>
                  )}
                  {event.leadContact.phone && (
                    <a href={`tel:${event.leadContact.phone}`}
                      className="flex items-center gap-2 text-xs text-warm-500 hover:text-primary-600 transition-colors mt-1">
                      <Phone className="w-3.5 h-3.5" /> {event.leadContact.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA band */}
      {!event.isPast ? (
        <section className="gradient-hero py-14 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white mb-1">Ready to make a difference?</h2>
              <p className="text-white/80 text-sm">Every volunteer matters. Sign up and join us.</p>
            </div>
            <button type="button" onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-warm-100 transition-colors flex-shrink-0">
              Become a Volunteer
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-warm-900 py-14 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white mb-1">Don't miss our next event</h2>
              <p className="text-warm-400 text-sm">More upcoming opportunities to get involved.</p>
            </div>
            <Link to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors flex-shrink-0">
              View Upcoming Events
            </Link>
          </div>
        </section>
      )}
      {contactOpen && contact && (
        <EventAdminContactModal
          event={event}
          contact={contact!}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}
