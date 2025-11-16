import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  Award,
  FileText,
  Clock,
  CheckCircle,
  Send,
  Upload,
  Briefcase,
  GraduationCap,
  Handshake,
} from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Accordion } from '../components/blocks/Accordion';
import { volunteerRoles, faqs } from '../data/mockData';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string;
  experience: string;
  motivation: string;
  resume: File | null;
}

export default function Volunteer() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interests: [],
    availability: '',
    experience: '',
    motivation: '',
    resume: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const benefits = [
    {
      icon: GraduationCap,
      title: 'Develop New Skills',
      description:
        'Gain valuable experience in leadership, communication, project management, and specialized skills relevant to your career goals.',
    },
    {
      icon: Users,
      title: 'Build Community',
      description:
        'Connect with like-minded individuals, expand your network, and become part of a supportive community of changemakers.',
    },
    {
      icon: FileText,
      title: 'Professional References',
      description:
        'Receive official documentation of your volunteer hours and references from our team for academic or professional applications.',
    },
    {
      icon: Heart,
      title: 'Make Real Impact',
      description:
        'See the direct results of your efforts as you help newcomers settle, mentor youth, and strengthen our community.',
    },
    {
      icon: Award,
      title: 'Recognition & Awards',
      description:
        'Be eligible for our annual awards program and scholarships that celebrate outstanding volunteer contributions.',
    },
    {
      icon: Handshake,
      title: 'Personal Growth',
      description:
        'Challenge yourself, step outside your comfort zone, and discover new passions while making a meaningful difference.',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Submit Application',
      description: 'Fill out the volunteer application form with your interests and availability.',
    },
    {
      step: 2,
      title: 'Initial Review',
      description: 'Our team reviews your application within 5-7 business days.',
    },
    {
      step: 3,
      title: 'Interview & Matching',
      description: 'We connect with you to discuss opportunities that match your skills and interests.',
    },
    {
      step: 4,
      title: 'Orientation & Training',
      description: 'Complete our volunteer orientation and any role-specific training.',
    },
    {
      step: 5,
      title: 'Start Volunteering',
      description: 'Begin your volunteer journey and make a positive impact in your community!',
    },
  ];

  const interestOptions = [
    'Newcomer Support',
    'Youth Mentorship',
    'Community Events',
    'Environmental Action',
    'Communications & Marketing',
    'Administrative Support',
    'Fundraising',
    'Other',
  ];

  const availabilityOptions = [
    'Weekday mornings',
    'Weekday afternoons',
    'Weekday evenings',
    'Weekend mornings',
    'Weekend afternoons',
    'Flexible schedule',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    if (formErrors.interests) {
      setFormErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (formData.interests.length === 0) errors.interests = 'Please select at least one area of interest';
    if (!formData.availability) errors.availability = 'Please select your availability';
    if (!formData.motivation.trim()) errors.motivation = 'Please tell us about your motivation';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setFormSubmitted(true);
      // In a real application, this would send the data to a backend
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Why Volunteer with VIVA"
        subtitle="Make a Difference"
        description="Join a community of passionate individuals dedicated to creating positive change. Your time and skills can transform lives and strengthen our neighborhoods."
        ctaButtons={[
          { label: 'Apply Now', href: '#apply', variant: 'primary' },
          { label: 'View Open Roles', href: '#roles', variant: 'secondary' },
        ]}
      />

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Benefits of Volunteering"
            subtitle="Volunteering with VIVA is not just about giving back - it's about growing personally and professionally while making meaningful connections"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={prefersReducedMotion ? {} : fadeInUp}>
                  <Card variant="elevated" hover className="p-6 h-full">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="roles" className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Open Volunteer Roles"
            subtitle="Find the perfect opportunity that matches your skills and interests"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {volunteerRoles.map((role) => (
              <motion.div key={role.id} variants={prefersReducedMotion ? {} : fadeInUp}>
                <Card variant="default" hover className="p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="primary" size="sm" className="mb-2">
                        {role.program}
                      </Badge>
                      <h3 className="text-xl font-semibold text-gray-900">{role.title}</h3>
                    </div>
                    <Briefcase className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{role.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{role.commitment}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.skills.map((skill) => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <span key={tag} className="text-xs text-primary-600 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <SectionHeader
            title="Apply to Volunteer"
            subtitle="Take the first step towards making a difference in your community"
          />

          {formSubmitted ? (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              className="mt-12 bg-green-50 border border-green-200 rounded-xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Thank you for your interest in volunteering with VIVA. Our team will review your
                application and contact you within 5-7 business days.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-12 space-y-8"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(416) 555-0123"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas of Interest *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
                {formErrors.interests && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.interests}</p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-lg font-semibold text-gray-900 mb-4">
                  Availability *
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.availability ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                >
                  <option value="">Select your preferred availability</option>
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formErrors.availability && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.availability}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-lg font-semibold text-gray-900 mb-4">
                  Relevant Experience (Optional)
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about any relevant volunteer, work, or educational experience..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Motivation */}
              <div>
                <label htmlFor="motivation" className="block text-lg font-semibold text-gray-900 mb-4">
                  Why do you want to volunteer with VIVA? *
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share your motivation for volunteering and what you hope to gain from this experience..."
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.motivation ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                />
                {formErrors.motivation && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.motivation}</p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Resume/CV (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <span className="text-primary-600 font-medium hover:text-primary-700">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOC, or DOCX (max 5MB)</p>
                  {formData.resume && (
                    <p className="text-sm text-green-600 mt-2">Selected: {formData.resume.name}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Application
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-5xl mx-auto">
          <SectionHeader
            title="How It Works"
            subtitle="Your journey to becoming a VIVA volunteer in 5 simple steps"
          />

          <motion.div
            className="mt-12 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                variants={prefersReducedMotion ? {} : fadeInUp}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  {index < howItWorks.length - 1 && (
                    <div className="w-0.5 h-8 bg-primary-200 ml-6 mt-4" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about volunteering with VIVA"
          />

          <motion.div
            className="mt-12 space-y-4"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {faqs.map((faq) => (
              <motion.div key={faq.id} variants={prefersReducedMotion ? {} : fadeInUp}>
                <Accordion question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Code of Conduct Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Code of Conduct</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              All VIVA volunteers are expected to uphold our values of respect, inclusivity, and
              integrity. We maintain a safe and welcoming environment for all participants, beneficiaries,
              and fellow volunteers.
            </p>
            <p className="text-gray-600 mb-8">
              Key principles include: treating everyone with dignity and respect, maintaining
              confidentiality, being reliable and punctual, communicating openly, and representing VIVA
              positively in all interactions.
            </p>
            <Button href="#" variant="secondary" size="lg">
              Read Full Code of Conduct
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
