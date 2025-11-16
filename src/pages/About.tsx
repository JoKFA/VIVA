import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, Target, Users, Shield, Sparkles, HandHeart, Globe } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { Hero } from '../components/blocks/Hero';
import { useReducedMotion } from '../hooks/useReducedMotion';

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We approach every interaction with empathy and understanding, recognizing the dignity and worth of every individual.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in the power of collective action and foster connections that strengthen our neighborhoods.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We maintain the highest standards of honesty, transparency, and accountability in all our work.',
  },
  {
    icon: Sparkles,
    title: 'Excellence',
    description: 'We strive for continuous improvement and deliver programs that create meaningful, measurable impact.',
  },
  {
    icon: HandHeart,
    title: 'Service',
    description: 'We are committed to selfless service, putting the needs of our community at the center of everything we do.',
  },
  {
    icon: Globe,
    title: 'Inclusion',
    description: 'We celebrate diversity and create welcoming spaces where everyone belongs and can contribute.',
  },
];

export default function About() {
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

  return (
    <div>
      <Hero
        title="About VIVA"
        subtitle="Our Story"
        description="Volunteer Impact & Vitality Alliance is dedicated to empowering communities through meaningful volunteer engagement and creating lasting positive change across the Greater Toronto Area."
        ctaButtons={[
          { label: 'Meet Our Team', href: '/about/board', variant: 'primary' },
          { label: 'View Our Impact', href: '/about/reports', variant: 'secondary' },
        ]}
      />

      {/* Mission & Vision Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {/* Mission */}
            <motion.div
              variants={prefersReducedMotion ? {} : fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
            >
              <Card variant="elevated" className="p-8 h-full">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To connect passionate volunteers with meaningful opportunities that address critical community needs, foster personal growth, and build stronger, more resilient neighborhoods. We empower individuals to make a difference while developing skills, forming connections, and creating lasting positive change in the Greater Toronto Area.
                </p>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={prefersReducedMotion ? {} : fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
            >
              <Card variant="elevated" className="p-8 h-full">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  A thriving, inclusive community where every person has the opportunity to contribute their unique talents, where newcomers are welcomed and supported, where youth are empowered to lead, and where collective action drives sustainable positive change for generations to come.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Our Core Values"
            subtitle="The principles that guide our work and define who we are as an organization"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={prefersReducedMotion ? {} : fadeInUp}
                >
                  <Card variant="default" hover className="p-6 h-full">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Inclusion Statement Section */}
      <section className="section-padding gradient-hero">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Globe className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Commitment to Inclusion
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
              VIVA is committed to creating an inclusive environment where diversity is celebrated and all individuals are treated with dignity and respect. We believe that our differences make us stronger and that everyone deserves the opportunity to contribute their unique perspectives and talents.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              We actively work to remove barriers to participation, ensure accessibility in all our programs, and create welcoming spaces for people of all backgrounds, abilities, ages, genders, sexual orientations, religions, and ethnicities. Our community is enriched by the diverse voices that come together to volunteer and serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Learn More About Us
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover the people behind our mission and the impact we've made together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about/board"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 shadow-soft-lg transition-all duration-300 transform hover:scale-105"
              >
                Meet Our Board
              </Link>
              <Link
                to="/about/awards"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 shadow-soft transition-all duration-300 transform hover:scale-105"
              >
                Awards & Scholarships
              </Link>
              <Link
                to="/about/reports"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-accent-500 text-white hover:bg-accent-600 shadow-soft-lg transition-all duration-300 transform hover:scale-105"
              >
                Annual Reports
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
