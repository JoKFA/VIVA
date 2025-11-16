import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Image,
  Quote,
  BarChart3,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events } from '../data/mockData';
import type { Event } from '../types';

const typeColors: Record<Event['type'], string> = {
  workshop: 'bg-blue-100 text-blue-700',
  'community-service': 'bg-primary-100 text-primary-700',
  career: 'bg-purple-100 text-purple-700',
  social: 'bg-accent-100 text-accent-700',
  fundraiser: 'bg-pink-100 text-pink-700',
};

const statusConfig: Record<Event['status'], { color: string; label: string; icon: typeof CheckCircle }> = {
  open: { color: 'success', label: 'Registration Open', icon: CheckCircle },
  waitlist: { color: 'warning', label: 'Waitlist Only', icon: AlertCircle },
  closed: { color: 'error', label: 'Registration Closed', icon: AlertCircle },
};

export default function EventDetail() {
  const prefersReducedMotion = useReducedMotion();
  const { slug } = useParams<{ slug: string }>();

  const event = useMemo(() => {
    return events.find((e) => e.slug === slug);
  }, [slug]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button href="/events" variant="primary">
            View All Events
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const StatusIcon = statusConfig[event.status].icon;

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
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Animated background */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        <div className="relative z-10 container-padding max-w-5xl mx-auto py-16">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back link */}
            <Link
              to={event.isPast ? '/events/past' : '/events'}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {event.isPast ? 'Past Events' : 'Events'}
            </Link>

            {/* Type badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  typeColors[event.type]
                }`}
              >
                {formatType(event.type)}
              </span>
              {event.isPast && (
                <span className="inline-block ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                  Past Event
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            {/* Key info */}
            <div className="flex flex-wrap gap-6 text-lg text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>{event.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : fadeInUp.initial}
                animate={prefersReducedMotion ? {} : fadeInUp.animate}
                transition={fadeInUp.transition}
              >
                <Card variant="elevated" className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="default">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* What You'll Do */}
              {event.whatYouWillDo && event.whatYouWillDo.length > 0 && (
                <motion.div
                  initial={prefersReducedMotion ? {} : fadeInUp.initial}
                  animate={prefersReducedMotion ? {} : fadeInUp.animate}
                  transition={{ ...fadeInUp.transition, delay: 0.1 }}
                >
                  <Card variant="elevated" className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      What You'll Do
                    </h2>
                    <ul className="space-y-4">
                      {event.whatYouWillDo.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )}

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <motion.div
                  initial={prefersReducedMotion ? {} : fadeInUp.initial}
                  animate={prefersReducedMotion ? {} : fadeInUp.animate}
                  transition={{ ...fadeInUp.transition, delay: 0.2 }}
                >
                  <Card variant="elevated" className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Recap Section (for past events) */}
              {event.isPast && event.recap && (
                <motion.div
                  initial={prefersReducedMotion ? {} : fadeInUp.initial}
                  animate={prefersReducedMotion ? {} : fadeInUp.animate}
                  transition={{ ...fadeInUp.transition, delay: 0.3 }}
                >
                  <Card variant="elevated" className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Recap</h2>

                    <p className="text-gray-600 leading-relaxed text-lg mb-8">
                      {event.recap.summary}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-primary-50 rounded-xl p-6 text-center">
                        <BarChart3 className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-primary-700">
                          {event.recap.volunteersCount}
                        </div>
                        <div className="text-sm text-primary-600 font-medium">
                          Volunteers
                        </div>
                      </div>
                      <div className="bg-accent-50 rounded-xl p-6 text-center">
                        <Clock className="w-8 h-8 text-accent-500 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-accent-700">
                          {event.recap.hoursServed}
                        </div>
                        <div className="text-sm text-accent-600 font-medium">
                          Hours Served
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-6 text-center">
                        <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-green-700">
                          {event.recap.beneficiaries}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          People Helped
                        </div>
                      </div>
                    </div>

                    {/* Gallery Placeholder */}
                    {event.recap.gallery.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Event Gallery
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {event.recap.gallery.map((_, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center"
                            >
                              <Image className="w-12 h-12 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quotes */}
                    {event.recap.quotes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          What People Said
                        </h3>
                        <div className="space-y-4">
                          {event.recap.quotes.map((quote, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-xl p-6 relative"
                            >
                              <Quote className="w-8 h-8 text-primary-200 absolute top-4 left-4" />
                              <p className="text-gray-700 italic pl-8 mb-3">
                                "{quote.text}"
                              </p>
                              <div className="pl-8">
                                <div className="font-semibold text-gray-900">
                                  {quote.author}
                                </div>
                                {quote.role && (
                                  <div className="text-sm text-gray-500">
                                    {quote.role}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Details Box */}
              <motion.div
                initial={prefersReducedMotion ? {} : fadeInUp.initial}
                animate={prefersReducedMotion ? {} : fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
              >
                <Card variant="elevated" className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Event Details</h3>

                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatDate(event.date)}
                        </div>
                        <div className="text-sm text-gray-600">{event.time}</div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">{event.location}</div>
                        {event.address && (
                          <div className="text-sm text-gray-600">{event.address}</div>
                        )}
                      </div>
                    </div>

                    {/* Registration Status */}
                    {!event.isPast && (
                      <div className="flex items-start gap-3">
                        <StatusIcon
                          className={`w-5 h-5 mt-0.5 ${
                            event.status === 'open'
                              ? 'text-green-500'
                              : event.status === 'waitlist'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {statusConfig[event.status].label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {event.registered}/{event.capacity} spots filled
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Capacity for past events */}
                    {event.isPast && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.registered} Participants
                          </div>
                          <div className="text-sm text-gray-600">Event completed</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {!event.isPast && (
                    <div className="mt-6">
                      <Button
                        href="/volunteer"
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        Join as Volunteer
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Lead Contact */}
              {event.leadContact && (
                <motion.div
                  initial={prefersReducedMotion ? {} : fadeInUp.initial}
                  animate={prefersReducedMotion ? {} : fadeInUp.animate}
                  transition={{ ...fadeInUp.transition, delay: 0.2 }}
                >
                  <Card variant="elevated" className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Event Coordinator
                    </h3>
                    <div className="space-y-3">
                      <div className="font-medium text-gray-900">
                        {event.leadContact.name}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-primary-500" />
                        <a
                          href={`mailto:${event.leadContact.email}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {event.leadContact.email}
                        </a>
                      </div>
                      {event.leadContact.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-primary-500" />
                          <a
                            href={`tel:${event.leadContact.phone}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {event.leadContact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Related Events Placeholder */}
              <motion.div
                initial={prefersReducedMotion ? {} : fadeInUp.initial}
                animate={prefersReducedMotion ? {} : fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.3 }}
              >
                <Card variant="default" className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    More {formatType(event.type)} Events
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover more events in this category.
                  </p>
                  <Button href="/events" variant="secondary" size="sm" className="w-full">
                    Browse All Events
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!event.isPast && (
        <section className="section-padding gradient-primary">
          <div className="container-padding max-w-4xl mx-auto text-center">
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-16 h-16 text-white/90 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join us for this event and contribute to our community. Every volunteer
                counts!
              </p>
              <Button href="/volunteer" variant="accent" size="lg">
                Sign Up to Volunteer
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {event.isPast && (
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
                Don't Miss Our Next Event
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                This event has passed, but there are more opportunities to get involved.
                Check out our upcoming events!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/events" variant="primary" size="lg">
                  View Upcoming Events
                </Button>
                <Button href="/events/past" variant="secondary" size="lg">
                  More Past Events
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
