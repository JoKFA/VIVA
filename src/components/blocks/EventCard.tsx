import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

const typeColors: Record<Event['type'], string> = {
  workshop: 'bg-blue-100 text-blue-700',
  'community-service': 'bg-primary-100 text-primary-700',
  career: 'bg-purple-100 text-purple-700',
  social: 'bg-accent-100 text-accent-700',
  fundraiser: 'bg-pink-100 text-pink-700',
};

const statusColors: Record<Event['status'], string> = {
  open: 'bg-green-100 text-green-700 border-green-200',
  waitlist: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  closed: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels: Record<Event['status'], string> = {
  open: 'Open',
  waitlist: 'Waitlist',
  closed: 'Closed',
};

export function EventCard({ event }: EventCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: prefersReducedMotion ? 1 : 1.02,
      transition: { duration: 0.2 },
    },
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

  const formatType = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Link to={`/events/${event.slug}`}>
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className="bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col"
      >
        {/* Image */}
        {event.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[event.status]}`}
              >
                {statusLabels[event.status]}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Type chip */}
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type]}`}>
              {formatType(event.type)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {event.title}
          </h3>

          {/* Details */}
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <span>
                {event.registered}/{event.capacity} registered
              </span>
            </div>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
