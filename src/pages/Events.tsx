import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { events } from '../data/mockData';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function parseDate(dateStr: string) {
  const d = new Date(dateStr);
  return { day: d.getUTCDate(), month: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
}

const TYPE_LABELS: Record<string, string> = {
  'community-service': 'Community',
  fundraiser: 'Fundraiser',
  workshop: 'Workshop',
  social: 'Social',
  career: 'Career',
};

function groupByYear(evts: typeof events) {
  const map: Record<number, typeof events> = {};
  evts.forEach((e) => {
    const yr = new Date(e.date).getUTCFullYear();
    if (!map[yr]) map[yr] = [];
    map[yr].push(e);
  });
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year: Number(year), items }));
}

export default function Events() {
  const upcoming = events.filter((e) => !e.isPast);
  const past = events.filter((e) => e.isPast);
  const pastByYear = groupByYear(past);

  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const toggleYear = (yr: number) =>
    setOpenYears((prev) => {
      const next = new Set(prev);
      next.has(yr) ? next.delete(yr) : next.add(yr);
      return next;
    });

  const featured = upcoming[0];
  const rest = upcoming.slice(1);

  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">2026</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Events
            </h1>
          </div>
        </div>
      </div>

      {/* ── UPCOMING ── */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Upcoming</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-10">
            What's Next
          </h2>

          {upcoming.length === 0 ? (
            <div className="py-16 text-center text-warm-400">
              <p className="text-sm">No upcoming events right now — follow <a href="https://instagram.com/viva_hq" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-medium">@viva_hq</a> for announcements.</p>
            </div>
          ) : (
            <>
              {/* Featured first event */}
              {featured && (
                <div className="grid grid-cols-1 lg:grid-cols-2 mb-8 border border-warm-200">
                  {/* Image */}
                  <div className="img-placeholder min-h-[260px] relative">
                    {featured.imageUrl && <img src={featured.imageUrl} alt={featured.title} />}
                  </div>
                  {/* Content */}
                  <div className="p-10 flex flex-col justify-center">
                    {(() => { const { day, month, year } = parseDate(featured.date); return (
                      <div className="mb-4">
                        <p className="font-impact text-[3.5rem] text-warm-700 leading-none">{day}</p>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400">{month} {year}</p>
                      </div>
                    ); })()}
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-primary-50 text-primary-600 rounded mb-3 w-fit">
                      {TYPE_LABELS[featured.type] || featured.type}
                    </span>
                    <h3 className="font-display font-extrabold text-2xl text-warm-900 mb-3">{featured.title}</h3>
                    <p className="text-warm-600 text-sm leading-relaxed mb-2">
                      <MapPin className="inline w-3.5 h-3.5 mr-1 text-primary-400" />{featured.location}
                    </p>
                    <p className="text-warm-600 text-[0.875rem] leading-relaxed mb-6 line-clamp-3">{featured.description}</p>
                    <div className="flex items-center gap-3">
                      <Link to={`/events/${featured.slug}`} className="btn-primary py-2 px-5 text-sm">
                        View Details
                      </Link>
                      {featured.status === 'open' && (
                        <span className="status-open">Open</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining events — date-column list */}
              {rest.length > 0 && (
                <div className="border-t border-warm-200">
                  {rest.map((ev) => {
                    const { day, month, year } = parseDate(ev.date);
                    return (
                      <div key={ev.id}
                        className="grid grid-cols-[80px_1fr_auto_auto] items-center gap-5 py-5 border-b border-warm-200 group">
                        <div>
                          <p className="font-impact text-[2rem] text-warm-700 leading-none">{day}</p>
                          <p className="text-[9px] font-bold tracking-widest uppercase text-warm-400">{month} {year}</p>
                        </div>
                        <div>
                          <p className="font-display font-bold text-[0.9375rem] text-warm-900 mb-0.5 group-hover:text-primary-600 transition-colors">{ev.title}</p>
                          <p className="text-xs text-warm-500"><MapPin className="inline w-3 h-3 mr-0.5" />{ev.location}</p>
                        </div>
                        {ev.status === 'open' && <span className="status-open hidden sm:inline-flex">Open</span>}
                        <Link to={`/events/${ev.slug}`} className="btn-primary py-1.5 px-4 text-xs">Details</Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── TODAY DIVIDER ── */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto today-divider">
          <span className="today-label">Past Events</span>
        </div>
      </div>

      {/* ── PAST (year accordion) ── */}
      <section className="bg-warm-50 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          {past.length === 0 ? (
            <div className="py-12 text-center text-warm-400">
              <p className="text-sm">Past event records will appear here.</p>
            </div>
          ) : (
            pastByYear.map(({ year, items }) => (
              <div key={year} className="year-row">
                <button
                  onClick={() => toggleYear(year)}
                  className="year-toggle w-full text-left"
                  aria-expanded={openYears.has(year)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-impact text-[2.5rem] text-warm-700 leading-none">{year}</span>
                    <span className="text-sm text-warm-400">{items.length} event{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-warm-400 transition-transform ${openYears.has(year) ? 'rotate-180' : ''}`} />
                </button>

                {openYears.has(year) && (
                  <div className="pb-6 border-t border-warm-200">
                    {items.map((ev) => {
                      const { day, month } = parseDate(ev.date);
                      return (
                        <div key={ev.id}
                          className="grid grid-cols-[64px_1fr_auto] items-center gap-5 py-4 border-b border-warm-200/60 group">
                          <div>
                            <p className="font-impact text-[1.75rem] text-warm-500 leading-none">{day}</p>
                            <p className="text-[9px] font-bold tracking-widest uppercase text-warm-400">{month}</p>
                          </div>
                          <div>
                            <p className="font-display font-bold text-[0.875rem] text-warm-700 mb-0.5 group-hover:text-primary-600 transition-colors">{ev.title}</p>
                            <p className="text-xs text-warm-400"><MapPin className="inline w-3 h-3 mr-0.5" />{ev.location}</p>
                          </div>
                          <Link to={`/events/${ev.slug}`}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Recap <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Volunteer CTA band */}
      <section className="gradient-hero py-14 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2">Get Involved</p>
            <h2 className="font-display font-extrabold text-2xl text-white">Volunteer at our next event</h2>
          </div>
          <Link to="/volunteer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-warm-100 transition-colors flex-shrink-0">
            Become a Volunteer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
