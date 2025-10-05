import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', path: '/' },
    {
      label: 'About',
      path: '/about',
      dropdown: [
        { label: 'About VIVA', path: '/about' },
        { label: 'Board of Executives', path: '/about/board' },
        { label: 'Awards & Scholarships', path: '/about/awards' },
        { label: 'Annual Reports', path: '/about/reports' },
      ],
    },
    {
      label: 'Events',
      path: '/events',
      dropdown: [
        { label: 'Upcoming Events', path: '/events' },
        { label: 'Calendar View', path: '/events/calendar' },
        { label: 'Past Events', path: '/events/past' },
      ],
    },
    { label: 'Volunteer', path: '/volunteer' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              VIVA
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.label === 'About') setAboutDropdownOpen(true);
                    if (link.label === 'Events') setEventsDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (link.label === 'About') setAboutDropdownOpen(false);
                    if (link.label === 'Events') setEventsDropdownOpen(false);
                  }}
                >
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                      location.pathname.startsWith(link.path)
                        ? 'text-teal-600'
                        : isScrolled
                        ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                        : 'text-gray-800 hover:text-teal-600'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {((link.label === 'About' && aboutDropdownOpen) ||
                    (link.label === 'Events' && eventsDropdownOpen)) && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-teal-600'
                      : isScrolled
                      ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                      : 'text-gray-800 hover:text-teal-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/donate"
              className="ml-4 px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Donate
            </Link>
          </nav>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <div className="px-4 py-2 font-medium text-gray-900">
                    {link.label}
                  </div>
                  <div className="pl-4 space-y-1">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/donate"
              className="block mx-4 mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium text-center hover:shadow-lg transition-all"
            >
              Donate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
