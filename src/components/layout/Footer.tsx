import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { sendContactEmail } from '../../lib/contactEmail';

export default function Footer() {
  const { settings: siteSettings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const aboutLinks = [
    { name: 'Our Story', href: '/about', visible: true },
    { name: 'Board of Executives', href: '/about/board', visible: true },
    { name: 'Awards & Scholarships', href: '/about/awards', visible: siteSettings.awardsPageVisible },
    { name: 'Annual Reports', href: '/about/reports', visible: siteSettings.annualReportsPageVisible },
  ].filter((link) => link.visible);
  const socialLinks = [
    { name: 'Instagram', href: siteSettings.socialLinks.instagram, icon: Instagram },
    { name: 'LinkedIn', href: siteSettings.socialLinks.linkedin, icon: Linkedin },
    { name: 'Facebook', href: siteSettings.socialLinks.facebook, icon: ExternalLink },
    { name: 'Twitter', href: siteSettings.socialLinks.twitter, icon: ExternalLink },
    { name: 'YouTube', href: siteSettings.socialLinks.youtube, icon: ExternalLink },
  ].filter((link) => Boolean(link.href));

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscribeError('');

    try {
      await sendContactEmail({
        source: 'newsletter',
        email,
        subject: 'Newsletter signup',
        message: 'Please add this email address to the VIVA newsletter list.',
      });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      setSubscribeError(error instanceof Error ? error.message : 'Subscription could not be sent right now.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-warm-900 text-warm-400">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <img src="/logo.png" alt="VIVA" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display font-extrabold text-xl text-white leading-none">VIVA</p>
                <p className="text-[10px] uppercase tracking-widest text-primary-300 mt-1">Vancouver</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              {siteSettings.footerDescription}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-warm-800 hover:bg-primary-600 rounded-lg transition-colors"
                  aria-label={name}
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">About</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm hover:text-primary-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">Get Involved</h3>
            <ul className="space-y-3">
              {[
                { name: 'Volunteer', href: '/volunteer' },
                { name: 'Upcoming Events', href: '/events' },
                { name: 'Donate', href: '/donate' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm hover:text-primary-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">Stay Connected</h3>
            <p className="text-sm leading-relaxed mb-5">{siteSettings.footerCtaBody}</p>

            {subscribed ? (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                Thanks. You're on the list.
              </div>
            ) : (
              <form onSubmit={subscribe} className="flex gap-2 mb-6">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 rounded-lg border border-warm-700 bg-warm-800 px-3 py-2.5 text-sm text-white placeholder:text-warm-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-600/40"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-3.5 text-white hover:bg-primary-700 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
            {subscribeError && <p className="mb-6 text-sm text-red-300">{subscribeError}</p>}

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-300 flex-shrink-0" />
                <span>
                  {siteSettings.address.street}<br />
                  {siteSettings.address.city}, {siteSettings.address.province}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-300 flex-shrink-0" />
                <a href={`tel:${siteSettings.phone}`} className="hover:text-primary-300 transition-colors">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-300 flex-shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-primary-300 transition-colors">
                  {siteSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-warm-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
          <p className="text-[11px] text-warm-500 leading-relaxed max-w-3xl">
            <span className="font-semibold text-warm-400">Land Acknowledgement: </span>
            {siteSettings.territoryAcknowledgement}
          </p>
        </div>
      </div>

      <div className="border-t border-warm-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-warm-600">
            &copy; {new Date().getFullYear()} VIVA. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-warm-600">
            <Link to="/faqs" className="hover:text-warm-400 transition-colors">FAQs</Link>
            <Link to="/code-of-conduct" className="hover:text-warm-400 transition-colors">Code of Conduct</Link>
            <Link to="/privacy" className="hover:text-warm-400 transition-colors">Privacy Policy</Link>
            <Link to="/accessibility" className="hover:text-warm-400 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
