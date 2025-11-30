import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';

// Pages - lazy load to identify issues
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const BoardOfExecutives = lazy(() => import('./pages/BoardOfExecutives'));
const Awards = lazy(() => import('./pages/Awards'));
const AnnualReports = lazy(() => import('./pages/AnnualReports'));
const Events = lazy(() => import('./pages/Events'));
const EventsCalendar = lazy(() => import('./pages/EventsCalendar'));
const PastEvents = lazy(() => import('./pages/PastEvents'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const UIComponents = lazy(() => import('./pages/UIComponents'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Home />
              </Suspense>
            }
          />

          {/* About Routes */}
          <Route
            path="about"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="about/board"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <BoardOfExecutives />
              </Suspense>
            }
          />
          <Route
            path="about/awards"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Awards />
              </Suspense>
            }
          />
          <Route
            path="about/reports"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <AnnualReports />
              </Suspense>
            }
          />

          {/* Events Routes */}
          <Route
            path="events"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path="events/calendar"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <EventsCalendar />
              </Suspense>
            }
          />
          <Route
            path="events/past"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <PastEvents />
              </Suspense>
            }
          />
          <Route
            path="events/:slug"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <EventDetail />
              </Suspense>
            }
          />

          {/* Other Routes */}
          <Route
            path="volunteer"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Volunteer />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="donate"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <Donate />
              </Suspense>
            }
          />
          <Route
            path="ui-components"
            element={
              <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <UIComponents />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
