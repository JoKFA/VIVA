import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Newspaper,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Accessibility,
} from 'lucide-react';
import { Hero } from '../components/blocks/Hero';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { contactInfo, siteSettings } from '../data/mockData';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
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

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'office':
        return MapPin;
      case 'email':
        return Mail;
      case 'phone':
        return Phone;
      case 'press':
        return Newspaper;
      default:
        return Mail;
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'office':
        return 'bg-blue-100 text-blue-600';
      case 'email':
        return 'bg-green-100 text-green-600';
      case 'phone':
        return 'bg-purple-100 text-purple-600';
      case 'press':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: siteSettings.socialLinks.facebook },
    { name: 'Instagram', icon: Instagram, url: siteSettings.socialLinks.instagram },
    { name: 'Twitter', icon: Twitter, url: siteSettings.socialLinks.twitter },
    { name: 'LinkedIn', icon: Linkedin, url: siteSettings.socialLinks.linkedin },
    { name: 'YouTube', icon: Youtube, url: siteSettings.socialLinks.youtube },
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setFormSubmitted(true);
      // In a real application, this would send the data to a backend
      console.log('Contact form submitted:', formData);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Get in Touch"
        subtitle="Contact Us"
        description="We'd love to hear from you. Whether you have questions about volunteering, want to partner with us, or need to reach our team, we're here to help."
        ctaButtons={[
          { label: 'Send a Message', href: '#contact-form', variant: 'primary' },
        ]}
      />

      {/* Contact Cards Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <SectionHeader
            title="Contact Information"
            subtitle="Multiple ways to reach our team"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            variants={prefersReducedMotion ? {} : staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
          >
            {contactInfo.map((info) => {
              const IconComponent = getContactIcon(info.type);
              const colorClass = getContactColor(info.type);
              return (
                <motion.div key={info.id} variants={prefersReducedMotion ? {} : fadeInUp}>
                  <Card variant="elevated" hover className="p-6 h-full text-center">
                    <div
                      className={`w-14 h-14 ${colorClass} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                    {info.type === 'email' || info.type === 'press' ? (
                      <a
                        href={`mailto:${info.value}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors break-all"
                      >
                        {info.value}
                      </a>
                    ) : info.type === 'phone' ? (
                      <a
                        href={`tel:${info.value.replace(/[^0-9+]/g, '')}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.value}</p>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* General Inquiry Form Section */}
      <section id="contact-form" className="section-padding bg-gray-50">
        <div className="container-padding max-w-3xl mx-auto">
          <SectionHeader
            title="Send Us a Message"
            subtitle="Fill out the form below and we'll get back to you as soon as possible"
          />

          {formSubmitted ? (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              className="mt-12 bg-green-50 border border-green-200 rounded-xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Thank you for reaching out. Our team will review your message and respond within 2-3
                business days.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-12 space-y-6"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="default" className="p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
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
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.subject ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteering Questions</option>
                      <option value="donate">Donation Information</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="events">Events Information</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="How can we help you?"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </Card>
            </motion.form>
          )}
        </div>
      </section>

      {/* Press/Media Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Newspaper className="w-16 h-16 text-accent-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Press & Media Inquiries</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              For media inquiries, interview requests, or press-related questions, please contact our
              communications team. We aim to respond to all media requests within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 inline-block">
              <p className="font-semibold text-gray-900 mb-2">Media Contact</p>
              <a
                href="mailto:media@vivacommunity.org"
                className="text-primary-600 hover:text-primary-700 transition-colors text-lg"
              >
                media@vivacommunity.org
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="section-padding gradient-accent">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Connect With Us</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Follow us on social media to stay updated on our latest events, volunteer stories, and
              community impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Statement Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Accessibility className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Statement</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              VIVA is committed to ensuring digital accessibility for people with disabilities. We are
              continually improving the user experience for everyone and applying relevant accessibility
              standards.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Our Commitment:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>WCAG 2.1 Level AA compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Keyboard navigation support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Screen reader compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Reduced motion support</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                If you encounter any accessibility barriers on our website, please contact us at{' '}
                <a href="mailto:accessibility@vivacommunity.org" className="text-primary-600 hover:text-primary-700">
                  accessibility@vivacommunity.org
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Land Acknowledgement Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-padding max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Land Acknowledgement</h2>
            <div className="bg-white rounded-xl p-8 shadow-soft">
              <p className="text-gray-700 leading-relaxed text-lg italic">
                {siteSettings.territoryAcknowledgement}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
