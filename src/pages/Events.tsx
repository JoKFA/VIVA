import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  List,
  Grid3X3,
  Map,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import { EventCard } from '../components/blocks/EventCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events } from '../data/mockData';
import type { Event } from '../types';

type ViewMode = 'list' | 'calendar' | 'map';

export default function Events() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const upcomingEvents = events.filter((event) => !event.isPast);

  // Get unique types and tags
  const eventTypes = useMemo(() => {
    const types = new Set(upcomingEvents.map((event) => event.type));
    return ['all', ...Array.from(types)];
  }, [upcomingEvents]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    upcomingEvents.forEach((event) => {
      event.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [upcomingEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => {
      const typeMatch = selectedType === 'all' || event.type === selectedType;
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => event.tags.includes(tag));
      return typeMatch && tagMatch;
    });
  }, [upcomingEvents, selectedType, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const formatType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Upcoming Events"
        subtitle="Get Involved"
        description="Discover volunteer opportunities and community gatherings. Find the perfect event to make a difference."
        ctaButtons={[
          { label: 'View Past Events', href: '/events/past', variant: 'secondary' },
        ]}
      />

      {/* Filters and Controls Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Type Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : formatType(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags as Chips */}
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Display Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          {viewMode === 'list' && (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredEvents.length}</span>{' '}
                  upcoming event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Events Grid */}
              {filteredEvents.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={prefersReducedMotion ? {} : staggerChildren}
                  initial="initial"
                  animate="animate"
                >
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={prefersReducedMotion ? {} : fadeInUp}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more events.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedTags([]);
                    }}
                    variant="secondary"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredEvents.length > 0 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(3, prev + 1))}
                    disabled={currentPage === 3}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}

          {viewMode === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <Grid3X3 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calendar View Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on an interactive calendar view. For now, please use the list
                view or visit our{' '}
                <Link
                  to="/events/calendar"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  dedicated calendar page
                </Link>
                .
              </p>
              <Button onClick={() => setViewMode('list')} variant="primary">
                Switch to List View
              </Button>
            </div>
          )}

          {viewMode === 'map' && (
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <Map className="w-16 h-16 text-primary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Map View Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're developing an interactive map to help you find events near you.
                Please check back soon!
              </p>
              <Button onClick={() => setViewMode('list')} variant="primary">
                Switch to List View
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-primary">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              We're always adding new events. Sign up for our newsletter to be notified
              when new volunteer opportunities become available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/volunteer" variant="accent" size="lg">
                Browse All Opportunities
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
