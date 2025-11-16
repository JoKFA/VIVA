import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Calendar, Leaf, ArrowRight, Mail, MapPin, Clock } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { events, stats, programs, partners } from '../data/mockData';

const iconMap = {
  Users,
  GraduationCap,
  Calendar,
  Leaf,
};

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const upcomingEvents = events.filter((event) => !event.isPast).slice(0, 6);
  const pastEventsWithRecaps = events
    .filter((event) => event.isPast && event.recap)
    .slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
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
      {/* Impact Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
        {/* Animated decorative circles */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
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
              className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
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
            <motion.div
              className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        <div className="relative z-10 container-padding max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-display-md font-display font-bold text-white mb-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering Communities Through Volunteer Action
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            VIVA connects passionate volunteers with meaningful opportunities to create lasting positive change in our communities. Together, we build stronger neighborhoods, support newcomers, and empower the next generation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button href="/volunteer" size="lg" variant="primary">
              Become a Volunteer
            </Button>
            <Button href="/donate" size="lg" variant="accent">
              Donate Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="What We Do"
            subtitle="Our programs address critical community needs through dedicated volunteer service"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {programs.map((program) => {
              const IconComponent = iconMap[program.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={program.id}
                  variants={prefersReducedMotion ? {} : fadeInUp}
                >
                  <Card variant="elevated" hover className="p-6 h-full">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      {IconComponent && (
                        <IconComponent className="w-7 h-7 text-primary-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <Link
                      to={program.link}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us at our upcoming volunteer opportunities and community gatherings"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={prefersReducedMotion ? {} : fadeInUp}
              >
                <Card variant="default" hover className="overflow-hidden h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-primary-400" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors mt-auto"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button href="/events" variant="secondary" size="lg">
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* By the Numbers Section */}
      <section className="section-padding gradient-hero">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Our Impact By the Numbers"
            subtitle="See the difference our volunteers make every day"
            className="text-white [&_h2]:text-white [&_p]:text-white/90"
          />

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                variants={prefersReducedMotion ? {} : fadeInUp}
              >
                <Card variant="glass" className="p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Stories Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Recent Stories"
            subtitle="Highlights from our past events and the impact we've made together"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {pastEventsWithRecaps.map((event) => (
              <motion.div
                key={event.id}
                variants={prefersReducedMotion ? {} : fadeInUp}
              >
                <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-accent-600 mb-1">
                        {event.recap?.volunteersCount}
                      </div>
                      <div className="text-sm text-accent-700">Volunteers</div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(event.date).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-4 flex-1">
                      {event.recap?.summary}
                    </p>
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center text-accent-600 font-semibold hover:text-accent-700 transition-colors mt-auto"
                    >
                      View Recap
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Our Partners & Supporters"
            subtitle="We're grateful for the organizations that help make our work possible"
          />

          <motion.div
            className="mt-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="h-16 px-6 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <span className="text-gray-600 font-semibold group-hover:text-gray-900 transition-colors">
                      {partner.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="section-padding gradient-accent">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates on upcoming events, volunteer opportunities, and stories of impact from our community.
            </p>

            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <p className="text-white font-semibold text-lg">
                  Thank you for subscribing!
                </p>
                <p className="text-white/90 mt-2">
                  You'll receive our next newsletter soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-accent-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
