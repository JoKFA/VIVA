import { motion } from 'framer-motion';
import { Linkedin, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Hero } from '../components/blocks/Hero';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { teamMembers } from '../data/mockData';

export default function BoardOfExecutives() {
  const prefersReducedMotion = useReducedMotion();

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

  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <div>
      <Hero
        title="Our Leadership Team"
        subtitle="Meet the People Behind VIVA"
        description="Our dedicated board members and executives bring diverse expertise and a shared passion for community service. Together, they guide VIVA's mission to create lasting positive change."
      />

      {/* Team Grid Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {sortedMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={prefersReducedMotion ? {} : fadeInUp}
              >
                <Card variant="elevated" hover className="h-full overflow-hidden">
                  {/* Photo Placeholder */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <User className="w-24 h-24 text-primary-400" />
                    {member.isExecutive && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="primary" size="md">
                          Executive
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-semibold mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {member.bio}
                    </p>
                    {member.linkedInUrl && (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Interested in Leadership Opportunities?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're always looking for passionate individuals to join our board or take on leadership roles within our programs. If you share our commitment to community service and want to make a difference, we'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-soft-lg transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
