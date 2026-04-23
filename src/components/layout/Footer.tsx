import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, MapPin, Phone, Heart } from 'lucide-react';
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
};

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-400">

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5 group">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="font-impact text-white text-xl leading-none tracking-wide">V</span>
            </div>
            <span className="font-display font-extrabold text-xl text-white tracking-tight">VIVA</span>
          </Link>
          <p className="text-warm-400 text-sm leading-relaxed mb-6 max-w-xs">
            Vancouver International Volunteer Association — connecting passionate volunteers
            with meaningful opportunities across BC since 2018.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={siteSettings.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-warm-800 hover:bg-primary-600 rounded-lg transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a
              href={siteSettings.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-warm-800 hover:bg-primary-600 rounded-lg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* About links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">About</h3>
          <ul className="space-y-3">
            {footerLinks.about.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-sm hover:text-primary-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get Involved links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">Get Involved</h3>
          <ul className="space-y-3">
            {footerLinks.getInvolved.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-sm hover:text-primary-400 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
              <span>
                {siteSettings.address.street}<br />
                {siteSettings.address.city}, {siteSettings.address.province}<br />
                {siteSettings.address.postalCode}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <a href={`tel:${siteSettings.phone}`} className="hover:text-primary-400 transition-colors">
                {siteSettings.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <a href={`mailto:${siteSettings.email}`} className="hover:text-primary-400 transition-colors">
                {siteSettings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Land acknowledgement */}
      <div className="border-t border-warm-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-[11px] text-warm-500 leading-relaxed max-w-3xl">
            <span className="font-semibold text-warm-400">Land Acknowledgement: </span>
            {siteSettings.territoryAcknowledgement}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-warm-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-warm-600">
            © {new Date().getFullYear()} Vancouver International Volunteer Association. All rights reserved.
          </p>
          <p className="text-[11px] text-warm-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary-600" /> in Vancouver, BC
          </p>
        </div>
      </div>
    </footer>
  );
}
