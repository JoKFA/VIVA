import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Users, Clock, CalendarDays, Filter } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Hero } from '../components/blocks/Hero';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { annualReports } from '../data/mockData';

export default function AnnualReports() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const years = ['all', ...annualReports.map((report) => report.year.toString())];

  const filteredReports =
    selectedYear === 'all'
      ? annualReports
      : annualReports.filter((report) => report.year.toString() === selectedYear);

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
        title="Annual Reports"
        subtitle="Our Impact Stories"
        description="Explore our annual reports to see the incredible impact our volunteers have made. Each report showcases our achievements, growth, and the communities we've served."
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
            <FileText className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Transparency & Accountability
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe in complete transparency with our community, donors, and stakeholders. Our annual reports provide comprehensive insights into our programs, financial stewardship, and the measurable impact of your support. Download our reports to see how together, we're making a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reports Grid Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Browse Our Reports"
            subtitle="View detailed reports from each year of our journey"
          />

          {/* Year Filter */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by year:</span>
            </div>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {year === 'all' ? 'All Years' : year}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                variants={prefersReducedMotion ? {} : fadeInUp}
              >
                <Card variant="elevated" hover className="h-full overflow-hidden flex flex-col">
                  {/* Cover Image Placeholder */}
                  <div className="relative h-56 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-primary-400 mx-auto mb-2" />
                      <span className="text-3xl font-bold text-primary-600">
                        {report.year}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="accent" size="md">
                        Annual Report
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {report.title}
                    </h3>

                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">
                          {report.totalVolunteers?.toLocaleString() || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">Volunteers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">
                          {report.totalHours ? (report.totalHours / 1000).toFixed(0) + "K" : "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">Hours</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">
                          {report.totalEvents || "N/A"}
                        </div>
                        <div className="text-xs text-gray-600">Events</div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                        Key Highlights
                      </h4>
                      <ul className="space-y-2">
                        {report.highlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Download Button */}
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-soft hover:shadow-soft-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF Report
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No reports found for the selected year.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Request Custom Report Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-16 h-16 text-accent-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Need Additional Information?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              If you need specific data, financial statements, or additional reports for grant applications or donor requests, please contact us. We're happy to provide the information you need.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-accent-500 text-white hover:bg-accent-600 shadow-soft-lg transition-all duration-300 transform hover:scale-105"
            >
              Request Information
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
