import { Heart, DollarSign, Gift, Users, TrendingUp, CheckCircle, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Donate() {
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  const impactStories = [
    {
      amount: 25,
      impact: 'Provides supplies for one volunteer at a community event',
      icon: Gift,
    },
    {
      amount: 50,
      impact: 'Sponsors training materials for 5 new volunteers',
      icon: Users,
    },
    {
      amount: 100,
      impact: 'Funds a full day community service project',
      icon: Heart,
    },
    {
      amount: 250,
      impact: 'Supports a youth leadership workshop for 20 participants',
      icon: TrendingUp,
    },
  ];

  const monthlyBenefits = [
    'Sustainable support for long-term programs',
    'Reduced administrative costs',
    'Exclusive monthly impact updates',
    'Special recognition in our annual report',
    'Easy to manage or cancel anytime',
  ];

  const designatedFunds = [
    {
      title: 'General Fund',
      description: 'Support where the need is greatest',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Youth Programs',
      description: 'Empower the next generation of leaders',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Community Service',
      description: 'Direct support for local service projects',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Scholarship Fund',
      description: 'Help volunteers pursue education',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-20 h-20 mx-auto mb-6" fill="white" />
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Make a Difference Today
            </h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Your generosity helps us empower volunteers, strengthen communities, and
              create lasting positive change across Canada.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    donationType === 'one-time'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    donationType === 'monthly'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly Giving
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Amount</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-4 rounded-lg font-semibold transition-all ${
                        amount === preset
                          ? 'bg-teal-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Other amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(null);
                    }}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-lg"
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Designate Your Gift</h3>
                <select className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-lg">
                  <option>General Fund - Where needed most</option>
                  <option>Youth Programs</option>
                  <option>Community Service Projects</option>
                  <option>Scholarship Fund</option>
                  <option>Emergency Response</option>
                </select>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">
                    Your donation is tax-deductible
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  VIVA is a registered charity (BN: 123456789RR0001). You will receive a tax
                  receipt for your full donation amount.
                </p>
              </div>

              <Button size="lg" className="w-full gap-2">
                <CreditCard className="w-5 h-5" />
                Complete Donation
              </Button>
            </div>
          </Card>

          {donationType === 'monthly' && (
            <Card className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Give Monthly?
                </h3>
                <div className="space-y-3">
                  {monthlyBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your donation creates real change in communities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStories.map((story) => (
              <Card key={story.amount} className="text-center">
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <story.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-3">
                    ${story.amount}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{story.impact}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Other Ways to Give
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the giving option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {designatedFunds.map((fund) => (
              <Card key={fund.title} className="group cursor-pointer hover:shadow-xl transition-shadow">
                <div className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${fund.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {fund.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{fund.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <div className="p-8">
                <Gift className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Corporate Partnerships
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Partner with VIVA to engage your employees, strengthen your community
                  impact, and align with your corporate social responsibility goals.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Workplace giving campaigns',
                    'Employee volunteer programs',
                    'Matching gift programs',
                    'Cause marketing partnerships',
                  ].map((item) => (
                    <li key={item} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline">Learn About Partnerships</Button>
              </div>
            </Card>

            <Card>
              <div className="p-8">
                <Users className="w-12 h-12 text-teal-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Planned Giving
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Leave a lasting legacy through bequests, life insurance, or other planned
                  giving vehicles. Your long-term support ensures future generations can
                  benefit from volunteer action.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Bequests in your will',
                    'Life insurance beneficiary',
                    'Securities and stocks',
                    'Memorial and tribute gifts',
                  ].map((item) => (
                    <li key={item} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline">Contact Planned Giving</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Transparency & Accountability
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                We are committed to using your donations responsibly and effectively. 72% of
                every dollar goes directly to programs, with detailed financial reports
                available to all donors.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">72%</div>
                  <div className="text-gray-700 font-medium">Program Services</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">15%</div>
                  <div className="text-gray-700 font-medium">Administration</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">13%</div>
                  <div className="text-gray-700 font-medium">Fundraising</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Giving?</h2>
          <p className="text-xl text-teal-50 mb-8">
            Our donor relations team is here to help you make the most meaningful gift
            possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:donations@viva.org">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Contact Donor Relations
              </Button>
            </a>
            <a href="tel:604-555-0123">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Call (604) 555-0123
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
