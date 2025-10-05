import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Share2, Heart, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function EventDetail() {
  const { slug } = useParams();

  const event = {
    title: 'Community Clean-Up Drive',
    date: 'March 15, 2024',
    time: '9:00 AM - 2:00 PM',
    location: 'Downtown Vancouver',
    locationAddress: '123 Main Street, Vancouver, BC V6B 2W1',
    type: 'Community Service',
    status: 'Open',
    capacity: '50 spots available',
    image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: `Join us for a city-wide clean-up initiative to beautify our neighborhoods and create a cleaner, greener Vancouver. This is a perfect opportunity to connect with fellow community members while making a tangible difference in our city.`,
    whatYouWillDo: [
      'Collect litter and recyclables from designated areas',
      'Sort waste into appropriate categories',
      'Participate in a team-based neighborhood beautification',
      'Learn about waste reduction and environmental sustainability',
    ],
    requirements: [
      'Closed-toe shoes and weather-appropriate clothing',
      'Reusable water bottle',
      'Work gloves (if you have them)',
      'Positive attitude and team spirit',
    ],
    agenda: [
      { time: '9:00 AM', activity: 'Registration and Welcome' },
      { time: '9:30 AM', activity: 'Safety Briefing and Team Assignments' },
      { time: '10:00 AM', activity: 'Clean-Up Activities Begin' },
      { time: '12:00 PM', activity: 'Lunch Break (provided)' },
      { time: '1:00 PM', activity: 'Afternoon Clean-Up Session' },
      { time: '2:00 PM', activity: 'Wrap-Up and Thank You' },
    ],
    leadContact: {
      name: 'Sarah Chen',
      role: 'Program Coordinator',
      email: 'sarah.chen@viva.org',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    partners: ['City of Vancouver', 'Green Future Initiative', 'Local Businesses Alliance'],
  };

  return (
    <div>
      <section className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-white/90 text-gray-900">{event.type}</Badge>
              <Badge
                variant={event.status === 'Open' ? 'success' : 'warning'}
                className="bg-white/90"
              >
                {event.status}
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center text-white/90 space-x-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose max-w-none mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Do</h2>
                <div className="space-y-3">
                  {event.whatYouWillDo.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.agenda.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-teal-600 font-bold text-lg whitespace-nowrap">
                        {item.time}
                      </div>
                      <div className="text-gray-700 text-lg">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What to Bring
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.requirements.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2.5" />
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
                <div className="p-8">
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.leadContact.image}
                      alt={event.leadContact.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Event Lead: {event.leadContact.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{event.leadContact.role}</p>
                      <p className="text-gray-700 mb-4">
                        Have questions? Feel free to reach out before the event!
                      </p>
                      <a
                        href={`mailto:${event.leadContact.email}`}
                        className="text-teal-600 hover:text-teal-700 font-medium"
                      >
                        {event.leadContact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Register Now</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-sm text-gray-600">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium">{event.location}</div>
                        <div className="text-sm text-gray-600">{event.locationAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Users className="w-5 h-5 text-teal-600" />
                      <div>
                        <div className="font-medium">{event.capacity}</div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mb-4 gap-2">
                    Register for Event <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Heart className="w-4 h-4" />
                    Save Event
                  </Button>
                  <button className="w-full mt-4 flex items-center justify-center space-x-2 text-teal-600 hover:text-teal-700 font-medium">
                    <Share2 className="w-4 h-4" />
                    <span>Share Event</span>
                  </button>
                </div>
              </Card>

              {event.partners.length > 0 && (
                <Card className="mt-6">
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Event Partners</h3>
                    <div className="space-y-3">
                      {event.partners.map((partner) => (
                        <div
                          key={partner}
                          className="text-gray-600 text-sm flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-teal-600 rounded-full" />
                          <span>{partner}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More Events You Might Like
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/${3184291 + i}/pexels-photo-${3184291 + i}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt="Event"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Badge className="mb-3">Community Service</Badge>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Upcoming Event {i}
                  </h3>
                  <div className="text-sm text-gray-600">March {20 + i}, 2024</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
