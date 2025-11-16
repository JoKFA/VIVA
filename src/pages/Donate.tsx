import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Building2,
  Receipt,
  Users,
  GraduationCap,
  Calendar,
  Wallet,
  CheckCircle,
} from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface DonationState {
  frequency: 'one-time' | 'monthly';
  amount: number | string;
  customAmount: string;
  fund: string;
}

export default function Donate() {
  const prefersReducedMotion = useReducedMotion();
  const [donation, setDonation] = useState<DonationState>({
    frequency: 'one-time',
    amount: 50,
    customAmount: '',
    fund: 'general',
  });

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

  const donationAmounts = [25, 50, 100, 250, 500];

  const fundOptions = [
    { value: 'general', label: 'General Fund', description: 'Support where needed most' },
    { value: 'programs', label: 'Programs', description: 'Direct program support' },
    { value: 'youth', label: 'Youth Initiatives', description: 'Youth mentorship & scholarships' },
    { value: 'events', label: 'Community Events', description: 'Event coordination & supplies' },
  ];

  const allocationData = [
    { label: 'Programs & Services', percentage: 75, color: 'bg-primary-600' },
    { label: 'Administration', percentage: 15, color: 'bg-accent-500' },
    { label: 'Fundraising', percentage: 10, color: 'bg-green-500' },
  ];

  const impactStories = [
    {
      amount: '$25',
      icon: Users,
      title: 'Welcome Package',
      description:
        'Provides a complete welcome package for a newcomer family, including essential settlement resources and community guides.',
    },
    {
      amount: '$50',
      icon: GraduationCap,
      title: 'Youth Tutoring Session',
      description:
        'Funds 4 hours of one-on-one tutoring for a student in need, helping them excel in their studies and build confidence.',
    },
    {
      amount: '$100',
      icon: Calendar,
      title: 'Community Event',
      description:
        'Sponsors supplies and materials for a community event that brings together 50+ neighbors to connect and celebrate.',
    },
  ];

  const handleAmountSelect = (amount: number | 'other') => {
    if (amount === 'other') {
      setDonation((prev) => ({ ...prev, amount: 'other', customAmount: '' }));
    } else {
      setDonation((prev) => ({ ...prev, amount, customAmount: '' }));
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setDonation((prev) => ({ ...prev, customAmount: value }));
  };

  const getDisplayAmount = () => {
    if (donation.amount === 'other') {
      return donation.customAmount ? `$${donation.customAmount}` : '$0';
    }
    return `$${donation.amount}`;
  };

  const handleDonate = () => {
    // Front-end only - no actual payment processing
    alert(`Thank you! This is a demo. Your ${donation.frequency} donation of ${getDisplayAmount()} to ${donation.fund} would be processed here.`);
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Support Our Mission"
        subtitle="Make a Donation"
        description="Your generosity empowers volunteers, strengthens communities, and creates lasting positive change. Every donation, regardless of size, makes a real difference."
        ctaButtons={[
          { label: 'Donate Now', href: '#donate-form', variant: 'primary' },
        ]}
      />

      {/* Trust Building Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={prefersReducedMotion ? {} : fadeInUp}>
              <Card variant="elevated" className="p-6 text-center h-full">
                <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
                <p className="text-gray-600">
                  Your donation is processed securely. We are a registered charitable organization with
                  full financial transparency.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={prefersReducedMotion ? {} : fadeInUp}>
              <Card variant="elevated" className="p-6 text-center h-full">
                <Receipt className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Deductible</h3>
                <p className="text-gray-600">
                  Receive an official tax receipt for your donation. Charitable registration #
                  123456789RR0001.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={prefersReducedMotion ? {} : fadeInUp}>
              <Card variant="elevated" className="p-6 text-center h-full">
                <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Impact</h3>
                <p className="text-gray-600">
                  75% of every dollar goes directly to programs and services that support our community.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section id="donate-form" className="section-padding bg-gray-50">
        <div className="container-padding max-w-3xl mx-auto">
          <SectionHeader
            title="Make Your Donation"
            subtitle="Choose your donation amount and frequency"
          />

          <motion.div
            className="mt-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="elevated" className="p-8">
              {/* Frequency Toggle */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Donation Frequency
                </label>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setDonation((prev) => ({ ...prev, frequency: 'one-time' }))}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                      donation.frequency === 'one-time'
                        ? 'bg-white text-primary-600 shadow-soft'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonation((prev) => ({ ...prev, frequency: 'monthly' }))}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                      donation.frequency === 'monthly'
                        ? 'bg-white text-primary-600 shadow-soft'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
                {donation.frequency === 'monthly' && (
                  <p className="text-sm text-accent-600 mt-2 font-medium">
                    Monthly donations provide sustained support for our programs!
                  </p>
                )}
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-4 px-4 rounded-xl font-semibold text-lg transition-all border-2 ${
                        donation.amount === amount
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAmountSelect('other')}
                    className={`py-4 px-4 rounded-xl font-semibold text-lg transition-all border-2 ${
                      donation.amount === 'other'
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                    }`}
                  >
                    Other
                  </button>
                </div>

                {donation.amount === 'other' && (
                  <div className="mt-4">
                    <label htmlFor="customAmount" className="sr-only">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                        $
                      </span>
                      <input
                        type="text"
                        id="customAmount"
                        value={donation.customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Designated Fund Selection */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Designate Your Gift
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fundOptions.map((fund) => (
                    <button
                      key={fund.value}
                      type="button"
                      onClick={() => setDonation((prev) => ({ ...prev, fund: fund.value }))}
                      className={`p-4 rounded-xl text-left transition-all border-2 ${
                        donation.fund === fund.value
                          ? 'bg-primary-50 border-primary-600'
                          : 'bg-white border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{fund.label}</div>
                      <div className="text-sm text-gray-600">{fund.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary and Donate Button */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Your {donation.frequency} donation:</span>
                  <span className="text-3xl font-bold text-primary-600">{getDisplayAmount()}</span>
                </div>
                <button
                  type="button"
                  onClick={handleDonate}
                  disabled={donation.amount === 'other' && !donation.customAmount}
                  className="w-full py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors focus:outline-none focus:ring-4 focus:ring-accent-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Complete Donation
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  This is a demonstration. No actual payment will be processed.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Where Your Donation Goes Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <SectionHeader
            title="Where Your Donation Goes"
            subtitle="We are committed to financial transparency and responsible stewardship"
          />

          <motion.div
            className="mt-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="elevated" className="p-8">
              {/* Visual Chart using Tailwind */}
              <div className="mb-8">
                <div className="h-12 flex rounded-xl overflow-hidden">
                  {allocationData.map((item, index) => (
                    <div
                      key={item.label}
                      className={`${item.color} flex items-center justify-center text-white font-semibold text-sm transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      {item.percentage}%
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-4">
                {allocationData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-700 w-12">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Employer Match Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-padding max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Building2 className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Double Your Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Many employers offer matching gift programs that can double or even triple your donation.
              Check with your HR department to see if your company participates in charitable matching.
            </p>
            <Card variant="default" className="p-6 bg-white max-w-lg mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">How Employer Matching Works:</h3>
              <ul className="space-y-2 text-left text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Make your donation to VIVA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Submit a matching gift request to your employer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Your employer matches your gift to VIVA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Your impact is doubled!</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Tax Receipt Note */}
      <section className="py-12 bg-gray-50">
        <div className="container-padding max-w-4xl mx-auto">
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Receipt className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tax Receipt Information</h3>
              <p className="text-gray-600">
                You will receive an official tax receipt via email immediately after your donation is
                processed. For donations over $20, you'll also receive a mailed copy. Please ensure your
                contact information is accurate. Charitable Registration # 123456789RR0001.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Micro-Impact Stories Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Your Impact in Action"
            subtitle="See how donations of every size create real change in our community"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {impactStories.map((story) => {
              const IconComponent = story.icon;
              return (
                <motion.div key={story.title} variants={prefersReducedMotion ? {} : fadeInUp}>
                  <Card variant="elevated" hover className="p-6 h-full">
                    <Badge variant="accent" size="md" className="mb-4">
                      {story.amount}
                    </Badge>
                    <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-accent-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{story.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{story.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Your support enables us to continue empowering volunteers and strengthening our community.
              Together, we can create lasting positive change.
            </p>
            <a
              href="#donate-form"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-soft-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
