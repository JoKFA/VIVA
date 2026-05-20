import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, Menu, X } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';
import type { Event } from '../../types';

const baseNavigation = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our Story', href: '/about' },
      { name: 'Board of Executives', href: '/about/board' },
      { name: 'Awards & Scholarships', href: '/about/awards' },
      { name: 'Annual Reports', href: '/about/reports' },
    ],
  },
  {
    name: 'Events',
    href: '/events',
    children: [
      { name: 'All Events', href: '/events' },
      { name: 'Calendar View', href: '/events/calendar' },
      { name: 'Past Events', href: '/events#past' },
    ],
  },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'Contact', href: '/contact' },
];

interface Announcement {
  label: string;
  text: string;
  cta: string;
  href: string;
}

function formatEventDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function eventAnnouncement(event: Event, overrides?: Partial<Announcement>): Announcement {
  const date = formatEventDate(event.date);
  const fallbackText = [event.title, date].filter(Boolean).join(' - ');

  return {
    label: overrides?.label || 'Upcoming Event',
    text: overrides?.text || fallbackText,
    cta: overrides?.cta || 'Learn More',
    href: overrides?.href || `/events/${event.slug}`,
  };
}

function popupText(title?: string, body?: string) {
  if (title && body) return `${title}: ${body}`;
  return title || body;
}

export default function Header() {
  const { settings } = useSiteSettings();
  const { data: upcomingEvents } = useUpcomingEvents();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [annIdx, setAnnIdx] = useState(0);
  const [annVisible, setAnnVisible] = useState(true);
  const [annDismissed, setAnnDismissed] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isDark = isHome && !isScrolled && !isMobileMenuOpen;
  const selectedPopupEvent = upcomingEvents.find((event) => event.slug === settings.popupEventSlug);
  const automaticAnnouncements = upcomingEvents.slice(0, 3).map((event) => eventAnnouncement(event));
  const fallbackAnnouncements: Announcement[] = [
    { label: 'Now Open', text: 'Volunteer applications for 2026 are open', cta: 'Apply', href: '/volunteer' },
  ];
  const announcements =
    settings.popupMode === 'hidden'
      ? []
      : settings.popupMode === 'selected_event' && selectedPopupEvent
        ? [
            eventAnnouncement(selectedPopupEvent, {
              label: 'Featured Event',
              text: popupText(settings.popupTitle, settings.popupBody),
              cta: settings.popupCtaLabel || undefined,
              href: settings.popupCtaUrl || undefined,
            }),
          ]
        : automaticAnnouncements.length > 0
          ? automaticAnnouncements
          : fallbackAnnouncements;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (annDismissed || announcements.length <= 1) return;
    const timer = setInterval(() => {
      setAnnVisible(false);
      setTimeout(() => {
        setAnnIdx((idx) => (idx + 1) % announcements.length);
        setAnnVisible(true);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, [annDismissed, announcements.length]);

  useEffect(() => {
    setAnnIdx(0);
  }, [settings.popupMode, settings.popupEventSlug]);

  const ann = announcements[annIdx % Math.max(announcements.length, 1)];
  const navigation = baseNavigation.map((item) => {
    if (item.name !== 'About' || !item.children) return item;
    return {
      ...item,
      children: item.children.filter((child) => {
        if (child.href === '/about/awards') return settings.awardsPageVisible;
        if (child.href === '/about/reports') return settings.annualReportsPageVisible;
        return true;
      }),
    };
  });
  const closeNavigation = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!annDismissed && ann && (
        <div
          className="relative flex items-center justify-center gap-3 px-4 py-1.5 text-white text-xs"
          style={{ background: '#c1272d', transition: 'opacity 0.3s', opacity: annVisible ? 1 : 0 }}
        >
          <span className="hidden sm:inline bg-white/20 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
            {ann.label}
          </span>
          <span className="font-medium">{ann.text}</span>
          <Link
            to={ann.href}
            onClick={closeNavigation}
            className="bg-white/20 border border-white/35 rounded px-2 py-0.5 text-[11px] font-semibold hover:bg-white/30 transition-colors"
          >
            {ann.cta}
          </Link>
          <button
            onClick={() => setAnnDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg leading-none px-1"
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      )}

      <header
        className={`transition-all duration-300 ${
          isDark ? 'bg-transparent' : 'bg-white/97 backdrop-blur-md shadow-soft border-b border-warm-200/60'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link to="/" onClick={closeNavigation} className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="VIVA" className="w-full h-full object-cover" />
              </div>
              <span
                className={`font-display font-extrabold text-[1.1875rem] tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-warm-900'
                }`}
              >
                VIVA
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      aria-expanded={openDropdown === item.name}
                      className={`flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors ${
                        isDark
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-warm-700 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>
                  ) : (
                    <NavLink
                      to={item.href}
                      end={item.href === '/'}
                      onClick={closeNavigation}
                      className={({ isActive }) =>
                        `px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors ${
                          isDark
                            ? isActive
                              ? 'text-white bg-white/15'
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                            : isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-warm-700 hover:text-primary-600 hover:bg-primary-50'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}

                  <AnimatePresence>
                    {item.children && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.14 }}
                        className="absolute left-0 mt-1.5 w-52 bg-white rounded-xl shadow-soft-lg border border-warm-200 py-1.5 z-50"
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            end
                            onClick={closeNavigation}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'text-primary-600 bg-primary-50 font-medium'
                                  : 'text-warm-700 hover:text-primary-600 hover:bg-warm-50'
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                to="/volunteer"
                onClick={closeNavigation}
                className={`px-4 py-2 text-[13px] font-semibold rounded-lg border transition-all duration-200 ${
                  isDark
                    ? 'text-white border-white/35 hover:border-white/60 hover:bg-white/10'
                    : 'text-warm-700 border-warm-300 hover:border-primary-400 hover:text-primary-600'
                }`}
              >
                Volunteer
              </Link>
              <Link
                to="/donate"
                onClick={closeNavigation}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 shadow-warm ${
                  isDark ? 'bg-white text-primary-600 hover:bg-warm-100' : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Donate
              </Link>
            </div>

            <button
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                isDark ? 'text-white hover:bg-white/10' : 'text-warm-700 hover:bg-warm-100'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden bg-white border-t border-warm-200"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                          className="flex items-center justify-between w-full px-4 py-3 text-warm-700 font-medium rounded-lg hover:bg-warm-50 text-sm"
                        >
                          {item.name}
                          <ChevronDown
                            className={`w-4 h-4 opacity-60 transition-transform ${
                              openDropdown === item.name ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-0.5"
                            >
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.name}
                                  to={child.href}
                                  end
                                  onClick={closeNavigation}
                                  className={({ isActive }) =>
                                    `block px-4 py-2.5 text-sm rounded-lg ${
                                      isActive
                                        ? 'text-primary-600 bg-primary-50 font-medium'
                                        : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                                    }`
                                  }
                                >
                                  {child.name}
                                </NavLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink
                        to={item.href}
                        end={item.href === '/'}
                        onClick={closeNavigation}
                        className={({ isActive }) =>
                          `block px-4 py-3 font-medium rounded-lg text-sm ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-warm-700 hover:text-primary-600 hover:bg-warm-50'
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    )}
                  </div>
                ))}

                <div className="pt-3 border-t border-warm-100 flex gap-2.5">
                  <Link
                    to="/volunteer"
                    onClick={closeNavigation}
                    className="flex-1 text-center py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg"
                  >
                    Volunteer
                  </Link>
                  <Link
                    to="/donate"
                    onClick={closeNavigation}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold text-white bg-primary-600 rounded-lg"
                  >
                    <Heart className="w-3.5 h-3.5" /> Donate
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
