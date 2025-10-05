import { Linkedin, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Board() {
  const board = [
    {
      name: 'Sarah Chen',
      role: 'Executive Director',
      bio: 'Sarah brings over 15 years of experience in non-profit leadership and community development. She is passionate about empowering young leaders and creating sustainable social change.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'sarah.chen@viva.org',
    },
    {
      name: 'Marcus Johnson',
      role: 'Director of Programs',
      bio: 'Marcus oversees all volunteer programs and community partnerships. With a background in social work, he ensures our initiatives create meaningful and lasting impact.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'marcus.johnson@viva.org',
    },
    {
      name: 'Priya Patel',
      role: 'Director of Operations',
      bio: 'Priya manages day-to-day operations and strategic planning. Her expertise in organizational development helps VIVA scale its impact efficiently.',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'priya.patel@viva.org',
    },
    {
      name: 'David Kim',
      role: 'Director of Finance',
      bio: 'David ensures financial sustainability and transparency. He brings corporate finance experience and a commitment to ethical resource management.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'david.kim@viva.org',
    },
    {
      name: 'Amanda Rodriguez',
      role: 'Director of Communications',
      bio: 'Amanda leads our storytelling and community engagement efforts. She helps amplify the voices of volunteers and communities we serve.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'amanda.rodriguez@viva.org',
    },
    {
      name: 'James Wilson',
      role: 'Director of Volunteer Relations',
      bio: 'James focuses on volunteer recruitment, training, and retention. He creates pathways for volunteers to grow and maximize their impact.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      linkedin: '#',
      email: 'james.wilson@viva.org',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Board of Executives</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Meet the passionate leaders driving VIVA's mission forward. Our board brings
              diverse expertise and a shared commitment to community empowerment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {board.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-teal-200 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-6">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-100 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-100 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Join Our Leadership Team
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                VIVA is always looking for passionate individuals to join our board and
                advisory committees. If you're committed to community service and want to
                help shape the future of volunteer action in Canada, we'd love to hear from
                you.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Board positions require a commitment of 10-15 hours per month and involve
                strategic planning, governance oversight, and community representation.
              </p>
              <a
                href="mailto:board@viva.org"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Express Interest</span>
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
