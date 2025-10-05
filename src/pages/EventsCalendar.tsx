import { Link } from 'react-router-dom';
import { Calendar, List, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function EventsCalendar() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = 'March 2024';

  const calendarEvents = [
    { day: 15, title: 'Community Clean-Up', type: 'Community Service', slug: 'community-cleanup-march' },
    { day: 22, title: 'Career Skills Workshop', type: 'Career Development', slug: 'career-skills-workshop' },
    { day: 28, title: 'Food Bank Volunteering', type: 'Community Service', slug: 'food-bank-volunteering' },
  ];

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2;
    return day > 0 && day <= 31 ? day : null;
  });

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">Events Calendar</h1>
              <p className="text-xl text-teal-50">
                View all upcoming events in calendar format
              </p>
            </div>
            <div className="flex space-x-4 mt-6 md:mt-0">
              <Link to="/events">
                <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                  <List className="w-4 h-4" />
                  List View
                </Button>
              </Link>
              <Button className="gap-2 bg-white text-teal-600 hover:bg-gray-100">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">{currentMonth}</h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Today
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayEvents = day
                  ? calendarEvents.filter((e) => e.day === day)
                  : [];
                const isToday = day === 10;

                return (
                  <div
                    key={index}
                    className={`min-h-32 p-2 border-r border-b border-gray-100 ${
                      day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    } transition-colors`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isToday
                              ? 'w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center'
                              : 'text-gray-700'
                          }`}
                        >
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.map((event, idx) => (
                            <Link
                              key={idx}
                              to={`/events/${event.slug}`}
                              className="block p-2 bg-teal-50 hover:bg-teal-100 rounded text-xs transition-colors"
                            >
                              <div className="font-medium text-teal-900 truncate">
                                {event.title}
                              </div>
                              <div className="text-teal-600 truncate">{event.type}</div>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-600 rounded" />
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-50 border-2 border-teal-200 rounded" />
              <span className="text-sm text-gray-600">Has Events</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-16 h-16 text-teal-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sync with Your Calendar
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Never miss an event. Add VIVA events to your Google Calendar, Outlook, or
            Apple Calendar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Add to Google Calendar
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Subscribe to iCal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
