import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, Award, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function Home() {
  const stats = [
    { label: 'Active Volunteers', value: '2,500+', icon: Users },
    { label: 'Hours Served', value: '50,000+', icon: TrendingUp },
    { label: 'Communities Reached', value: '45+', icon: MapPin },
    { label: 'Annual Events', value: '120+', icon: Calendar },
  ];

  const programs = [
    {
      title: 'Community Service',
      description: 'Hands-on projects that directly impact local communities',
      icon: Heart,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Career Development',
      description: 'Professional workshops and networking opportunities',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Youth Leadership',
      description: 'Empowering the next generation of community leaders',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Recognition Programs',
      description: 'Awards and scholarships for outstanding volunteers',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Community Clean-Up Drive',
      date: 'March 15, 2024',
      time: '9:00 AM - 2:00 PM',
      location: 'Downtown Vancouver',
      type: 'Community Service',
      spots: 'Open',
      image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Career Skills Workshop',
      date: 'March 22, 2024',
      time: '6:00 PM - 8:30 PM',
      location: 'Virtual Event',
      type: 'Career Development',
      spots: 'Open',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Food Bank Volunteering',
      date: 'March 28, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Surrey Food Bank',
      type: 'Community Service',
      spots: 'Filling Fast',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const stories = [
    {
      title: 'Winter Warmth Campaign Success',
      description: 'Our volunteers collected and distributed over 500 warm clothing items to those in need.',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'February 2024',
    },
    {
      title: 'Youth Leadership Summit',
      description: '150 young leaders gathered to discuss community challenges and innovative solutions.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'January 2024',
    },
  ];

  const partners = [
    'City of Vancouver',
    'BC Community Foundation',
    'United Way',
    'Local Impact Fund',
    'Youth Network',
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Empowering Communities Through{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Volunteer Action
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of volunteers making a real difference across Canada. Together,
                we create lasting impact in communities that need it most.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/volunteer">
                  <Button size="lg" className="gap-2">
                    Start Volunteering <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button variant="outline" size="lg">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Volunteers working together"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" fill="white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2,500+</div>
                    <div className="text-sm text-gray-600">Active Volunteers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs connect passionate volunteers with meaningful opportunities to
              create lasting change
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program) => (
              <Card key={program.title} className="group cursor-pointer">
                <div className="p-6">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${program.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <program.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{program.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-600">
                Join us at our next volunteer opportunity
              </p>
            </div>
            <Link to="/events">
              <Button variant="ghost" className="gap-2">
                See All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.title} className="group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={event.spots === 'Open' ? 'success' : 'warning'}
                    >
                      {event.spots}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-teal-600 font-medium mb-2">
                    {event.type}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we're building stronger communities across Canada
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Impact Stories</h2>
            <p className="text-xl text-gray-600">
              Celebrating the difference our volunteers make
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {stories.map((story) => (
              <Card key={story.title} className="group cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-teal-600 font-medium mb-2">
                    {story.date}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{story.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link to="/events/past">
              <Button variant="outline" className="gap-2">
                View More Stories <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-gray-600">
              Working together to create meaningful change
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-xl font-medium text-gray-400 hover:text-teal-600 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-teal-50">
            Join our community of passionate volunteers and help create lasting impact in
            communities across Canada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/volunteer">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 gap-2"
              >
                Become a Volunteer <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
