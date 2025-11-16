import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
} from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events } from '../data/mockData';
import type { Event } from '../types';

const typeColors: Record<Event['type'], string> = {
  workshop: 'bg-blue-100 text-blue-600',
  'community-service': 'bg-primary-100 text-primary-600',
  career: 'bg-purple-100 text-purple-600',
  social: 'bg-accent-100 text-accent-600',
  fundraiser: 'bg-pink-100 text-pink-600',
};

export default function PastEvents() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pastEvents = events.filter((event) => event.isPast);

  // Get unique types and tags
  const eventTypes = useMemo(() => {
    const types = new Set(pastEvents.map((event) => event.type));
    return ['all', ...Array.from(types)];
  }, [pastEvents]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pastEvents.forEach((event) => {
      event.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [pastEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return pastEvents.filter((event) => {
      const typeMatch = selectedType === 'all' || event.type === selectedType;
      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => event.tags.includes(tag));
      return typeMatch && tagMatch;
    });
  }, [pastEvents, selectedType, selectedTags]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
        title="Past Events"
        subtitle="Our Impact Stories"
        description="Explore the events we've completed and see the difference our volunteers have made in the community."
        ctaButtons={[
          { label: 'View Upcoming Events', href: '/events', variant: 'secondary' },
        ]}
      />

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-padding max-w-7xl mx-auto">
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
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-gray-700 text-white'
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
        </div>
      </section>

      {/* Past Events Grid Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredEvents.length}</span> past
              event{filteredEvents.length !== 1 ? 's' : ''}
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
                <motion.div key={event.id} variants={prefersReducedMotion ? {} : fadeInUp}>
                  <Link to={`/events/${event.slug}`}>
                    <Card
                      variant="elevated"
                      hover
                      className="overflow-hidden h-full flex flex-col opacity-90 hover:opacity-100 transition-opacity"
                    >
                      {/* Image placeholder with muted treatment */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <History className="w-16 h-16 text-gray-400" />
                        {/* Past badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Completed
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Type chip - muted */}
                        <div className="mb-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              typeColors[event.type]
                            } opacity-80`}
                          >
                            {formatType(event.type)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Details */}
                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{event.registered} participants</span>
                          </div>
                        </div>

                        {/* Recap indicator */}
                        {event.recap && (
                          <div className="mt-auto pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">
                                  {event.recap.volunteersCount}
                                </span>{' '}
                                volunteers |{' '}
                                <span className="font-medium">
                                  {event.recap.hoursServed}
                                </span>{' '}
                                hours
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                View Recap
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </span>
                            </div>
                          </div>
                        )}

                        {!event.recap && (
                          <div className="mt-auto">
                            <span className="inline-flex items-center text-gray-600 font-semibold hover:text-gray-800 transition-colors">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more past events.
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
                      ? 'bg-gray-700 text-white'
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-800">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make Your Mark?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our upcoming events and become part of the next success story. Your
              contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/events" variant="primary" size="lg">
                View Upcoming Events
              </Button>
              <Button href="/volunteer" variant="secondary" size="lg">
                Become a Volunteer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
