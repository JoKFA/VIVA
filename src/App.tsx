import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Board } from './pages/Board';
import { Awards } from './pages/Awards';
import { Reports } from './pages/Reports';
import { Events } from './pages/Events';
import { EventsCalendar } from './pages/EventsCalendar';
import { EventsPast } from './pages/EventsPast';
import { EventDetail } from './pages/EventDetail';
import { Volunteer } from './pages/Volunteer';
import { Contact } from './pages/Contact';
import { Donate } from './pages/Donate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="about/board" element={<Board />} />
          <Route path="about/awards" element={<Awards />} />
          <Route path="about/reports" element={<Reports />} />
          <Route path="events" element={<Events />} />
          <Route path="events/calendar" element={<EventsCalendar />} />
          <Route path="events/past" element={<EventsPast />} />
          <Route path="events/:slug" element={<EventDetail />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
