import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Our Story', href: '/about' },
      { name: 'Board of Executives', href: '/about/board' },
      { name: 'Awards & Scholarships', href: '/about/awards' },
      { name: 'Annual Reports', href: '/about/reports' },
    ],
  },
  {
    name: 'Events',
    href: '/events',
    children: [
      { name: 'All Events', href: '/events' },
      { name: 'Calendar View', href: '/events/calendar' },
    ],
  },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Homepage gets transparent header that reveals on scroll
  const isHome = location.pathname === '/';
  const isDark = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-transparent'
          : 'bg-white/96 backdrop-blur-md shadow-soft border-b border-warm-200/60'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobileMenu}>
            <img
              src="/logo.png"
              alt="VIVA"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                    aria-expanded={openDropdown === item.name}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDark
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : 'text-warm-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isDark
                          ? isActive
                            ? 'text-white bg-white/15'
                            : 'text-white/85 hover:text-white hover:bg-white/10'
                          : isActive
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-warm-700 hover:text-primary-600 hover:bg-primary-50'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-soft-lg border border-warm-200 py-1.5 z-50"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          end
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'text-primary-600 bg-primary-50 font-medium'
                                : 'text-warm-700 hover:text-primary-600 hover:bg-warm-50'
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/donate"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                isDark
                  ? 'bg-white text-primary-600 hover:bg-warm-100'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-warm'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2.5 rounded-lg transition-colors ${
              isDark ? 'text-white hover:bg-white/10' : 'text-warm-700 hover:bg-warm-100'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-warm-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full px-4 py-3 text-warm-700 font-medium rounded-lg hover:bg-warm-50 text-sm"
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 opacity-60 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-0.5"
                          >
                            {item.children.map((child) => (
                              <NavLink
                                key={child.name}
                                to={child.href}
                                end
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                  `block px-4 py-2.5 text-sm rounded-lg ${
                                    isActive
                                      ? 'text-primary-600 bg-primary-50 font-medium'
                                      : 'text-warm-600 hover:text-primary-600 hover:bg-warm-50'
                                  }`
                                }
                              >
                                {child.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink
                      to={item.href}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 font-medium rounded-lg text-sm ${
                          isActive
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-warm-700 hover:text-primary-600 hover:bg-warm-50'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-warm-100">
                <Link
                  to="/donate"
                  onClick={closeMobileMenu}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Donate
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
