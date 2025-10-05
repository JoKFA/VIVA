import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Filter, Search, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function Events() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const eventTypes = ['all', 'Community Service', 'Career Development', 'Workshop', 'Social'];

  const events = [
    {
      id: 1,
      slug: 'community-cleanup-march',
      title: 'Community Clean-Up Drive',
      date: 'March 15, 2024',
      time: '9:00 AM - 2:00 PM',
      location: 'Downtown Vancouver',
      type: 'Community Service',
      spots: 'Open',
      capacity: '50 spots available',
      description: 'Join us for a city-wide clean-up initiative to beautify our neighborhoods',
      image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      slug: 'career-skills-workshop',
      title: 'Career Skills Workshop',
      date: 'March 22, 2024',
      time: '6:00 PM - 8:30 PM',
      location: 'Virtual Event',
      type: 'Career Development',
      spots: 'Open',
      capacity: 'Unlimited',
      description: 'Professional development session on resume building and interview skills',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      slug: 'food-bank-volunteering',
      title: 'Food Bank Volunteering',
      date: 'March 28, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Surrey Food Bank',
      type: 'Community Service',
      spots: 'Filling Fast',
      capacity: '15 spots left',
      description: 'Help sort and distribute food to families in need',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 4,
      slug: 'youth-leadership-summit',
      title: 'Youth Leadership Summit',
      date: 'April 5, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'UBC Campus',
      type: 'Workshop',
      spots: 'Open',
      capacity: '100 spots available',
      description: 'Full-day leadership training for young volunteers',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 5,
      slug: 'community-garden-project',
      title: 'Community Garden Project',
      date: 'April 12, 2024',
      time: '10:00 AM - 3:00 PM',
      location: 'East Vancouver',
      type: 'Community Service',
      spots: 'Open',
      capacity: '30 spots available',
      description: 'Build raised garden beds and plant vegetables for local residents',
      image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 6,
      slug: 'networking-mixer',
      title: 'Volunteer Networking Mixer',
      date: 'April 18, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Downtown Vancouver',
      type: 'Social',
      spots: 'Open',
      capacity: 'Unlimited',
      description: 'Connect with fellow volunteers and community leaders',
      image: 'https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Discover volunteer opportunities that match your interests and schedule. Every
              event is a chance to make a difference.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Events' : type}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <Link to="/events/calendar">
                <Button variant="outline" className="gap-2 whitespace-nowrap">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            <Link to="/events/past" className="text-teal-600 hover:text-teal-700 font-medium">
              View Past Events
            </Link>
          </div>

          {filteredEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 text-lg">
                No events found matching your criteria. Try adjusting your filters.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`}>
                  <Card className="group cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant={
                            event.spots === 'Open'
                              ? 'success'
                              : event.spots === 'Filling Fast'
                              ? 'warning'
                              : 'error'
                          }
                        >
                          {event.spots}
                        </Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-900">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span>{event.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't See What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're always planning new events. Sign up for our newsletter to get notified
            about upcoming opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
