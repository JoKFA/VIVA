import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, TrendingUp, Heart, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function EventsPast() {
  const pastEvents = [
    {
      id: 1,
      slug: 'winter-warmth-campaign',
      title: 'Winter Warmth Campaign',
      date: 'February 10, 2024',
      location: 'Multiple Locations',
      type: 'Community Service',
      volunteers: 85,
      hours: 340,
      beneficiaries: 500,
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Our volunteers collected and distributed over 500 warm clothing items to those in need across Vancouver.',
      photos: 24,
    },
    {
      id: 2,
      slug: 'youth-leadership-january',
      title: 'Youth Leadership Summit',
      date: 'January 20, 2024',
      location: 'SFU Campus',
      type: 'Workshop',
      volunteers: 150,
      hours: 1200,
      beneficiaries: 150,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: '150 young leaders gathered to discuss community challenges and develop innovative solutions.',
      photos: 42,
    },
    {
      id: 3,
      slug: 'holiday-hamper-drive',
      title: 'Holiday Hamper Drive',
      date: 'December 15, 2023',
      location: 'Surrey Community Center',
      type: 'Community Service',
      volunteers: 120,
      hours: 480,
      beneficiaries: 300,
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Assembled and delivered 300 holiday hampers to families experiencing food insecurity.',
      photos: 36,
    },
    {
      id: 4,
      slug: 'environmental-cleanup-november',
      title: 'Beach Clean-Up Initiative',
      date: 'November 5, 2023',
      location: 'Kitsilano Beach',
      type: 'Community Service',
      volunteers: 65,
      hours: 195,
      beneficiaries: 'N/A',
      image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Removed over 500kg of waste from our beautiful beaches, protecting marine ecosystems.',
      photos: 18,
    },
    {
      id: 5,
      slug: 'career-fair-october',
      title: 'Virtual Career Fair',
      date: 'October 18, 2023',
      location: 'Virtual Event',
      type: 'Career Development',
      volunteers: 45,
      hours: 180,
      beneficiaries: 200,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Connected 200 job seekers with employers and provided resume reviews and interview prep.',
      photos: 12,
    },
    {
      id: 6,
      slug: 'seniors-tech-workshop',
      title: 'Seniors Tech Literacy Workshop',
      date: 'September 22, 2023',
      location: 'Burnaby Library',
      type: 'Workshop',
      volunteers: 30,
      hours: 120,
      beneficiaries: 60,
      image: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800',
      summary: 'Helped seniors navigate smartphones, video calls, and online services to stay connected.',
      photos: 15,
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Past Events</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Celebrating the incredible impact our volunteers have made. Every event tells
              a story of community, dedication, and positive change.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{pastEvents.length}</span>{' '}
              past events
            </p>
            <Link
              to="/events"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              View Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-2/5 relative h-64 md:h-auto">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <ImageIcon className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {event.photos} Photos
                      </span>
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                      <span className="text-gray-400">•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {event.title}
                    </h2>

                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {event.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-5 h-5 text-teal-600" />
                          <span className="text-sm text-gray-600">Volunteers</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {event.volunteers}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Hours</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{event.hours}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Heart className="w-5 h-5 text-purple-600" />
                          <span className="text-sm text-gray-600">Served</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {event.beneficiaries}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                    >
                      View Full Recap
                      <svg
                        className="w-5 h-5 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">495</div>
              <div className="text-gray-600 font-medium">Total Volunteers</div>
              <div className="text-sm text-gray-500 mt-1">Across all past events</div>
            </div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">2,515</div>
              <div className="text-gray-600 font-medium">Hours Contributed</div>
              <div className="text-sm text-gray-500 mt-1">By dedicated volunteers</div>
            </div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">1,210+</div>
              <div className="text-gray-600 font-medium">People Helped</div>
              <div className="text-sm text-gray-500 mt-1">Direct community impact</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
