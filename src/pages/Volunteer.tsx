import { useState } from 'react';
import { Heart, Users, Award, TrendingUp, Clock, FileText, Upload, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Volunteer() {
  const [formStep, setFormStep] = useState(1);

  const benefits = [
    {
      icon: Heart,
      title: 'Make Real Impact',
      description: 'Create meaningful change in communities that need support',
    },
    {
      icon: Users,
      title: 'Build Connections',
      description: 'Meet like-minded people and expand your network',
    },
    {
      icon: Award,
      title: 'Develop Skills',
      description: 'Gain valuable experience and leadership opportunities',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Enhance your resume and earn reference letters',
    },
  ];

  const roles = [
    {
      title: 'Event Volunteer',
      commitment: 'Flexible',
      description: 'Help at community events, clean-ups, and service projects',
      spots: 'Always Open',
    },
    {
      title: 'Program Assistant',
      commitment: '5-10 hrs/week',
      description: 'Support program coordinators with planning and logistics',
      spots: '3 Positions',
    },
    {
      title: 'Youth Mentor',
      commitment: '3 hrs/week',
      description: 'Guide and inspire young volunteers in their service journey',
      spots: '5 Positions',
    },
    {
      title: 'Communications Volunteer',
      commitment: 'Flexible',
      description: 'Create content, manage social media, and tell impact stories',
      spots: '2 Positions',
    },
    {
      title: 'Fundraising Team',
      commitment: '5 hrs/week',
      description: 'Help with donor outreach and fundraising campaign planning',
      spots: '4 Positions',
    },
    {
      title: 'Skills-Based Volunteer',
      commitment: 'Project-based',
      description: 'Use your professional skills (design, tech, legal, etc.)',
      spots: 'Open',
    },
  ];

  const steps = [
    { number: 1, title: 'Apply Online', description: 'Complete our volunteer application' },
    { number: 2, title: 'Interview', description: 'Quick chat to understand your interests' },
    { number: 3, title: 'Orientation', description: 'Learn about VIVA and get onboarded' },
    { number: 4, title: 'Start Volunteering', description: 'Join your first event or project' },
  ];

  const faqs = [
    {
      question: 'What is the minimum time commitment?',
      answer: 'We have flexible opportunities starting from a few hours per month. Some roles require weekly commitments, but many are event-based and completely flexible.',
    },
    {
      question: 'Do I need prior volunteer experience?',
      answer: 'Not at all! We welcome volunteers of all experience levels. We provide training and ongoing support for all roles.',
    },
    {
      question: 'Can international students volunteer?',
      answer: 'Yes! International students are welcome to volunteer. Volunteer hours do not count as work under your study permit.',
    },
    {
      question: 'Will I receive volunteer hours documentation?',
      answer: 'Absolutely. We track all volunteer hours and provide certificates and reference letters upon request.',
    },
    {
      question: 'What if I need to take a break?',
      answer: 'We understand life gets busy. You can pause your volunteering at any time and return when it works for you.',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Become a Volunteer
              </h1>
              <p className="text-xl text-teal-50 leading-relaxed mb-8">
                Join a community of passionate changemakers. No matter your schedule or
                skills, there's a place for you at VIVA.
              </p>
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 gap-2"
                onClick={() => {
                  document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Apply Now <Heart className="w-5 h-5" fill="currentColor" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Volunteers"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Volunteer with VIVA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Volunteering is more than just giving back—it's an opportunity to grow,
              connect, and create lasting impact
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Volunteer Roles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect role that matches your interests, skills, and availability
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role) => (
              <Card key={role.title} className="group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                      {role.title}
                    </h3>
                    <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {role.spots}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{role.commitment}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">{role.description}</p>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple. Here's what to expect
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="application" className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Volunteer Application
            </h2>
            <p className="text-xl text-gray-600">
              Join our community of changemakers. It only takes a few minutes!
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
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="(604) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Interest *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Community Service', 'Career Development', 'Youth Mentorship', 'Event Planning', 'Communications', 'Fundraising'].map((interest) => (
                      <label key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Tell us about your availability (days, times, hours per week)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  Submit Application <CheckCircle className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Code of Conduct</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                All volunteers are expected to uphold our values of respect, integrity, and
                inclusivity. We are committed to providing a safe, welcoming, and harassment-free
                environment for everyone.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                By volunteering with VIVA, you agree to treat all participants, staff, and
                community members with dignity and respect, regardless of background, identity,
                or beliefs.
              </p>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Read Full Code of Conduct
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
