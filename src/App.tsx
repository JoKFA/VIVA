import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import { Analytics } from '@vercel/analytics/react';
import { SiteSettingsProvider, useSiteSettings } from './contexts/SiteSettingsContext';
import { PageLoadingSkeleton } from './components/ui/LoadingSkeleton';

// ── Public pages ──────────────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const BoardOfExecutives = lazy(() => import('./pages/BoardOfExecutives'));
const Awards = lazy(() => import('./pages/Awards'));
const AnnualReports = lazy(() => import('./pages/AnnualReports'));
const Events = lazy(() => import('./pages/Events'));
const EventsCalendar = lazy(() => import('./pages/EventsCalendar'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const Faqs = lazy(() => import('./pages/Faqs'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLogin = lazy(() => import('./admin/pages/Login'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminEvents = lazy(() => import('./admin/pages/Events'));
const AdminEventEdit = lazy(() => import('./admin/pages/EventEdit'));
const AdminTeam = lazy(() => import('./admin/pages/Team'));
const AdminAwards = lazy(() => import('./admin/pages/Awards'));
const AdminReports = lazy(() => import('./admin/pages/Reports'));
const AdminVolunteerRoles = lazy(() => import('./admin/pages/VolunteerRoles'));
const AdminPartners = lazy(() => import('./admin/pages/Partners'));
const AdminTestimonials = lazy(() => import('./admin/pages/Testimonials'));
const AdminFaqs = lazy(() => import('./admin/pages/Faqs'));
const AdminContactInfo = lazy(() => import('./admin/pages/ContactInfo'));
const AdminStats = lazy(() => import('./admin/pages/Stats'));
const AdminHero = lazy(() => import('./admin/pages/Hero'));
const AdminPrograms = lazy(() => import('./admin/pages/Programs'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));
const AdminHonours = lazy(() => import('./admin/pages/Honours'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoadingSkeleton />}>{children}</Suspense>
);

function PublicFeatureGate({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return enabled ? <>{children}</> : <NotFound />;
}

function AppRoutes() {
  const { settings } = useSiteSettings();

  return (
    <Router>
        <ScrollToTop />
        <Analytics />
        <Routes>

          {/* ── Public site ──────────────────────────────────────────────── */}
          <Route path="/" element={<Layout />}>
            <Route index element={<S><Home /></S>} />

            {/* About */}
            <Route path="about" element={<S><About /></S>} />
            <Route path="about/board" element={<S><BoardOfExecutives /></S>} />
            <Route path="about/awards" element={<S><PublicFeatureGate enabled={settings.awardsPageVisible}><Awards /></PublicFeatureGate></S>} />
            <Route path="about/reports" element={<S><PublicFeatureGate enabled={settings.annualReportsPageVisible}><AnnualReports /></PublicFeatureGate></S>} />

            {/* Events */}
            <Route path="events" element={<S><Events /></S>} />
            <Route path="events/calendar" element={<S><EventsCalendar /></S>} />
            <Route path="events/:slug" element={<S><EventDetail /></S>} />

            {/* Other */}
            <Route path="volunteer" element={<S><Volunteer /></S>} />
            <Route path="contact" element={<S><Contact /></S>} />
            <Route path="donate" element={<S><Donate /></S>} />
            <Route path="faqs" element={<S><Faqs /></S>} />
            <Route path="*" element={<S><NotFound /></S>} />
          </Route>

          {/* ── Admin — separate branch, no public Layout ─────────────── */}
          <Route path="/admin/login" element={<S><AdminLogin /></S>} />
          <Route path="/admin" element={<S><AdminLayout /></S>}>
            <Route index element={<S><AdminDashboard /></S>} />
            <Route path="events" element={<S><AdminEvents /></S>} />
            <Route path="events/new" element={<S><AdminEventEdit /></S>} />
            <Route path="events/:id/edit" element={<S><AdminEventEdit /></S>} />
            <Route path="team" element={<S><AdminTeam /></S>} />
            <Route path="awards" element={<S><AdminAwards /></S>} />
            <Route path="reports" element={<S><AdminReports /></S>} />
            <Route path="volunteer-roles" element={<S><AdminVolunteerRoles /></S>} />
            <Route path="partners" element={<S><AdminPartners /></S>} />
            <Route path="testimonials" element={<S><AdminTestimonials /></S>} />
            <Route path="faqs" element={<S><AdminFaqs /></S>} />
            <Route path="contact-info" element={<S><AdminContactInfo /></S>} />
            <Route path="stats" element={<S><AdminStats /></S>} />
            <Route path="hero" element={<S><AdminHero /></S>} />
            <Route path="programs" element={<S><AdminPrograms /></S>} />
            <Route path="settings" element={<S><AdminSettings /></S>} />
            <Route path="honours" element={<S><AdminHonours /></S>} />
            <Route path="*" element={<S><NotFound /></S>} />
          </Route>

          <Route path="*" element={<S><NotFound /></S>} />
        </Routes>
      </Router>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <AppRoutes />
    </SiteSettingsProvider>
  );
}

export default App;
