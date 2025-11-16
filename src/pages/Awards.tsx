import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award as AwardIcon, FileText, Calendar, CheckCircle, Trophy, Users } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Hero } from '../components/blocks/Hero';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { awards } from '../data/mockData';

export default function Awards() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>(awards[0]?.id || '');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div>
      <Hero
        title="Awards & Scholarships"
        subtitle="Recognizing Excellence"
        description="VIVA celebrates outstanding volunteers and supports young leaders through our awards and scholarship programs. Learn about opportunities to be recognized for your contributions."
      />

      {/* Overview Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Trophy className="w-16 h-16 text-accent-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Celebrating Our Community Champions
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At VIVA, we believe in recognizing the incredible contributions of our volunteers. Our awards and scholarships program honors those who go above and beyond in their service, demonstrating exceptional dedication, leadership, and impact. These programs not only celebrate past achievements but also inspire future generations of community leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Awards Tabs Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Available Awards & Scholarships"
            subtitle="Explore our recognition programs and find out how to apply"
          />

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 mb-8">
            {awards.map((award) => (
              <button
                key={award.id}
                onClick={() => setActiveTab(award.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === award.id
                    ? 'bg-primary-600 text-white shadow-soft-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {award.name}
              </button>
            ))}
          </div>

          {/* Award Details */}
          {awards.map((award) => (
            <motion.div
              key={award.id}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={
                activeTab === award.id
                  ? { opacity: 1, display: 'block' }
                  : { opacity: 0, display: 'none' }
              }
              transition={{ duration: 0.3 }}
            >
              <Card variant="elevated" className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AwardIcon className="w-7 h-7 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {award.name}
                        </h3>
                        <div className="flex gap-2">
                          {award.years.map((year) => (
                            <Badge key={year} variant="primary" size="sm">
                              {year}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      {award.description}
                    </p>

                    <div className="space-y-6">
                      {/* Eligibility */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                          <h4 className="text-lg font-semibold text-gray-900">
                            Eligibility Requirements
                          </h4>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-7">
                          {award.eligibility}
                        </p>
                      </div>

                      {/* Timeline */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-5 h-5 text-primary-600" />
                          <h4 className="text-lg font-semibold text-gray-900">
                            Application Timeline
                          </h4>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-7">
                          {award.timeline}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button href={award.applicationUrl} variant="primary" size="lg">
                        Apply Now
                      </Button>
                      <Button
                        href={award.pdfUrl}
                        variant="outline"
                        size="lg"
                        icon={FileText}
                        external
                      >
                        Download Guidelines (PDF)
                      </Button>
                    </div>
                  </div>

                  {/* Past Recipients */}
                  <div className="lg:col-span-1">
                    <Card variant="glass" className="p-6 bg-primary-50">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-primary-600" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Past Recipients
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {award.pastRecipients.map((recipient, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 shadow-soft"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">
                                {recipient.name}
                              </span>
                              <Badge variant="accent" size="sm">
                                {recipient.year}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {recipient.achievement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nominate Section */}
      <section className="section-padding gradient-accent">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <AwardIcon className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Know Someone Deserving?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Do you know a volunteer who has made an exceptional impact in your community? Nominate them for one of our awards and help us celebrate their dedication and service.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white text-accent-600 hover:bg-gray-100 shadow-soft-lg transition-all duration-300 transform hover:scale-105"
            >
              Submit a Nomination
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
