import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Heart, Mail, MapPin, Phone } from 'lucide-react';
import { siteSettings } from '../../data/mockData';

const footerLinks = {
  about: [
    { name: 'Our Story', href: '/about' },
    { name: 'Board of Executives', href: '/about/board' },
    { name: 'Awards & Scholarships', href: '/about/awards' },
    { name: 'Annual Reports', href: '/about/reports' },
  ],
  getInvolved: [
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Upcoming Events', href: '/events' },
    { name: 'Donate', href: '/donate' },
    { name: 'Contact Us', href: '/contact' },
  ],
  resources: [
    { name: 'FAQs', href: '/volunteer#faqs' },
    { name: 'Code of Conduct', href: '/volunteer#code-of-conduct' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - would connect to backend
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold text-white">VIVA</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {siteSettings.tagline}. Empowering communities through volunteer action and creating lasting positive impact.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Stay Connected</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {Object.entries(siteSettings.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform as keyof typeof socialIcons];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"
                    aria-label={`Follow us on ${platform}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-3">
              {footerLinks.getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>
                  {siteSettings.address.street}<br />
                  {siteSettings.address.city}, {siteSettings.address.province}<br />
                  {siteSettings.address.postalCode}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {siteSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Donate CTA Banner */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg">Support Our Mission</h3>
              <p className="text-primary-100">
                Your donation helps us continue making a difference in our community.
              </p>
            </div>
            <Link
              to="/donate"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Donate Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Land Acknowledgement & Copyright */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Land Acknowledgement */}
          <div className="mb-6 pb-6 border-b border-gray-800">
            <h4 className="text-white font-semibold mb-2 text-sm">Land Acknowledgement</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {siteSettings.territoryAcknowledgement}
            </p>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} {siteSettings.organizationName}. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-500 hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
