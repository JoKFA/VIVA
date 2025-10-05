import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Contact() {
  const locations = [
    {
      name: 'Vancouver Office',
      address: '123 Main Street, Suite 400',
      city: 'Vancouver, BC V6B 2W1',
      phone: '(604) 555-0123',
      email: 'vancouver@viva.org',
      hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
      isMain: true,
    },
    {
      name: 'Surrey Hub',
      address: '456 King George Blvd',
      city: 'Surrey, BC V3T 2X1',
      phone: '(604) 555-0124',
      email: 'surrey@viva.org',
      hours: 'Tue-Thu: 10:00 AM - 4:00 PM',
      isMain: false,
    },
    {
      name: 'Burnaby Center',
      address: '789 Hastings Street',
      city: 'Burnaby, BC V5C 2G8',
      phone: '(604) 555-0125',
      email: 'burnaby@viva.org',
      hours: 'Mon-Wed: 10:00 AM - 4:00 PM',
      isMain: false,
    },
  ];

  const departments = [
    {
      title: 'General Inquiries',
      email: 'info@viva.org',
      description: 'Questions about VIVA, programs, or how to get involved',
    },
    {
      title: 'Volunteer Support',
      email: 'volunteer@viva.org',
      description: 'Help with volunteer applications, hours, or opportunities',
    },
    {
      title: 'Event Registration',
      email: 'events@viva.org',
      description: 'Questions about upcoming events or registration',
    },
    {
      title: 'Partnerships',
      email: 'partnerships@viva.org',
      description: 'Corporate partnerships and community collaborations',
    },
    {
      title: 'Media & Press',
      email: 'media@viva.org',
      description: 'Media inquiries, press releases, and interviews',
    },
    {
      title: 'Donations',
      email: 'donations@viva.org',
      description: 'Questions about giving, sponsorships, or tax receipts',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Have questions? We're here to help. Reach out to us and we'll get back to
              you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {locations.map((location) => (
              <Card key={location.name} className={location.isMain ? 'lg:col-span-3' : ''}>
                <div className={`p-8 ${location.isMain ? 'md:flex md:items-start md:space-x-8' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                      {location.isMain && (
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                          Main Office
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-gray-700">{location.address}</p>
                          <p className="text-gray-700">{location.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-teal-600" />
                        <a
                          href={`tel:${location.phone}`}
                          className="text-gray-700 hover:text-teal-600"
                        >
                          {location.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-teal-600" />
                        <a
                          href={`mailto:${location.email}`}
                          className="text-gray-700 hover:text-teal-600"
                        >
                          {location.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <p className="text-gray-700">{location.hours}</p>
                      </div>
                    </div>
                  </div>
                  {location.isMain && (
                    <div className="mt-6 md:mt-0 flex-shrink-0">
                      <div className="w-full md:w-96 h-64 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          Map Placeholder
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact by Department</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with the right team for faster assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Card key={dept.title} className="group hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {dept.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{dept.email}</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MessageCircle className="w-16 h-16 text-teal-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <Card>
            <div className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="(604) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Select a subject</option>
                    <option>General Inquiry</option>
                    <option>Volunteer Opportunity</option>
                    <option>Event Question</option>
                    <option>Partnership Interest</option>
                    <option>Media Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  Send Message <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Follow us on social media for the latest updates, event announcements, and
                inspiring stories from our volunteer community.
              </p>
              <div className="flex justify-center space-x-4">
                {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            VIVA is committed to ensuring our services and spaces are accessible to everyone.
            All our offices have wheelchair access, and we provide accommodations upon request.
            If you need any accessibility support, please let us know when you reach out.
          </p>
          <p className="text-gray-600 leading-relaxed">
            For accessibility-related questions or concerns, contact us at{' '}
            <a href="mailto:accessibility@viva.org" className="text-teal-600 hover:underline">
              accessibility@viva.org
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
