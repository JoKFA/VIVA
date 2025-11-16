import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import Button from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events } from '../data/mockData';
import type { Event } from '../types';

const typeColors: Record<Event['type'], string> = {
  workshop: 'bg-blue-500',
  'community-service': 'bg-primary-500',
  career: 'bg-purple-500',
  social: 'bg-accent-500',
  fundraiser: 'bg-pink-500',
};

export default function EventsCalendar() {
  const prefersReducedMotion = useReducedMotion();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    events.forEach((event) => {
      const eventDate = new Date(event.date);
      if (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      ) {
        const dateKey = eventDate.getDate().toString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    return grouped;
  }, [events, currentMonth, currentYear]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];

  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Events Calendar"
        subtitle="Plan Ahead"
        description="View all our upcoming and past events in a calendar format. Click on any event to learn more and register."
        ctaButtons={[
          { label: 'List View', href: '/events', variant: 'secondary' },
        ]}
      />

      {/* Calendar Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Calendar Header */}
            <div className="bg-white rounded-t-2xl shadow-soft p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {monthName} {currentYear}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-b-2xl shadow-soft overflow-hidden">
              {/* Week day headers */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] border-b border-r border-gray-200 p-2 ${
                      day === null ? 'bg-gray-50' : 'bg-white'
                    } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                  >
                    {day !== null && (
                      <>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isToday(day)
                              ? 'w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center'
                              : 'text-gray-900'
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {eventsByDate[day.toString()]?.slice(0, 3).map((event) => (
                            <Link
                              key={event.id}
                              to={`/events/${event.slug}`}
                              className={`block px-2 py-1 rounded text-xs font-medium text-white truncate hover:opacity-80 transition-opacity ${
                                typeColors[event.type]
                              }`}
                              title={event.title}
                            >
                              {event.title}
                            </Link>
                          ))}
                          {eventsByDate[day.toString()]?.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{eventsByDate[day.toString()].length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(typeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${color}`} />
                    <span className="text-sm text-gray-600">
                      {type
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Looking for Past Events?
            </h2>
            <p className="text-gray-600 mb-8">
              Check out our past events to see the impact we've made together and read
              inspiring stories from our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/events/past" variant="primary">
                View Past Events
              </Button>
              <Button href="/events" variant="secondary">
                Upcoming Events List
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
