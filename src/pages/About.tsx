import { Users, Target, Eye, Heart, Award, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize the needs and voices of the communities we serve',
    },
    {
      icon: Users,
      title: 'Inclusive Excellence',
      description: 'Diversity and inclusion are at the heart of everything we do',
    },
    {
      icon: Award,
      title: 'Integrity & Transparency',
      description: 'We operate with the highest ethical standards and accountability',
    },
    {
      icon: Globe,
      title: 'Sustainable Impact',
      description: 'We focus on creating long-term, meaningful change',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">About VIVA</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Volunteer Initiative for Vibrant Action is a volunteer-driven non-profit
              organization committed to empowering communities across Canada through
              meaningful volunteer action and youth leadership development.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To mobilize and empower volunteers to create positive social change through
                community service, leadership development, and sustainable partnerships.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone has the capacity to make a difference, and we
                provide the platform, resources, and support to turn that potential into
                meaningful action.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="VIVA mission"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl opacity-20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="VIVA vision"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl opacity-20 -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A Canada where every individual is empowered to contribute their unique
                talents and skills to build vibrant, resilient, and inclusive communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a future where volunteer action is recognized as a cornerstone
                of social progress, and where diverse communities thrive through
                collaborative effort and mutual support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide our work and define who we are as an organization
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Commitment to Inclusion
                </h2>
              </div>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  VIVA is committed to creating an inclusive environment where all
                  individuals, regardless of background, identity, or circumstance, feel
                  welcomed, valued, and empowered to contribute.
                </p>
                <p>
                  We actively work to remove barriers to participation and ensure that our
                  programs, events, and leadership opportunities are accessible to everyone.
                  This includes considerations for physical accessibility, language support,
                  cultural sensitivity, and economic accessibility.
                </p>
                <p>
                  We recognize that diversity strengthens our organization and enriches the
                  communities we serve. We are committed to ongoing learning, reflection, and
                  action to advance equity and justice in all aspects of our work.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              From humble beginnings to a thriving community of change-makers
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-500 to-emerald-600" />

            <div className="space-y-16">
              {[
                {
                  year: '2018',
                  title: 'VIVA Founded',
                  description:
                    'Started with 50 passionate volunteers and a vision to make a difference',
                },
                {
                  year: '2020',
                  title: 'Expansion',
                  description:
                    'Reached 500 volunteers and launched programs in 10 cities across BC',
                },
                {
                  year: '2022',
                  title: 'National Recognition',
                  description:
                    'Received national awards for community impact and volunteer excellence',
                },
                {
                  year: '2024',
                  title: 'Growing Strong',
                  description:
                    'Over 2,500 active volunteers serving 45+ communities nationwide',
                },
              ].map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'
                    }`}
                  >
                    <Card>
                      <div className="p-6">
                        <div className="text-2xl font-bold text-teal-600 mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-600 rounded-full border-4 border-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
