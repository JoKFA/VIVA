import { FileText, Download, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Reports() {
  const reports = [
    {
      year: 2023,
      title: '2023 Annual Report',
      subtitle: 'Year of Growth and Impact',
      coverImage: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        { label: 'Volunteers', value: '2,500+', icon: Users },
        { label: 'Hours Served', value: '52,000', icon: TrendingUp },
        { label: 'Communities', value: '45', icon: Target },
        { label: 'Funds Raised', value: '$850K', icon: DollarSign },
      ],
      summary:
        '2023 marked a transformative year for VIVA. We expanded our reach to 45 communities, doubled our volunteer base, and launched three new program initiatives focused on youth leadership and environmental sustainability.',
    },
    {
      year: 2022,
      title: '2022 Annual Report',
      subtitle: 'Building Resilient Communities',
      coverImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        { label: 'Volunteers', value: '1,800', icon: Users },
        { label: 'Hours Served', value: '38,000', icon: TrendingUp },
        { label: 'Communities', value: '32', icon: Target },
        { label: 'Funds Raised', value: '$620K', icon: DollarSign },
      ],
      summary:
        'In 2022, VIVA focused on post-pandemic community recovery. We supported vulnerable populations, launched our mental health awareness campaign, and strengthened partnerships with local organizations.',
    },
    {
      year: 2021,
      title: '2021 Annual Report',
      subtitle: 'Adapting and Thriving',
      coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      highlights: [
        { label: 'Volunteers', value: '1,200', icon: Users },
        { label: 'Hours Served', value: '25,000', icon: TrendingUp },
        { label: 'Communities', value: '24', icon: Target },
        { label: 'Funds Raised', value: '$480K', icon: DollarSign },
      ],
      summary:
        '2021 saw VIVA pivot to hybrid programming, combining virtual and in-person opportunities. We maintained strong community connections while ensuring volunteer safety and accessibility.',
    },
  ];

  const financialBreakdown = {
    expenses: [
      { category: 'Program Services', percentage: 72 },
      { category: 'Administrative', percentage: 15 },
      { category: 'Fundraising', percentage: 13 },
    ],
    revenue: [
      { category: 'Individual Donations', percentage: 45 },
      { category: 'Corporate Sponsors', percentage: 30 },
      { category: 'Grants', percentage: 20 },
      { category: 'Other', percentage: 5 },
    ],
  };

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Annual Reports</h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Transparency and accountability are core to our mission. Explore our annual
              reports to see how your support creates meaningful community impact.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {reports.map((report) => (
              <Card key={report.year} className="overflow-hidden">
                <div className="lg:flex">
                  <div className="lg:w-2/5 relative h-80 lg:h-auto">
                    <img
                      src={report.coverImage}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="text-5xl font-bold mb-2">{report.year}</div>
                      <div className="text-xl font-semibold">{report.subtitle}</div>
                    </div>
                  </div>
                  <div className="lg:w-3/5 p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {report.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {report.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {report.highlights.map((highlight) => (
                        <div
                          key={highlight.label}
                          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                              <highlight.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">
                                {highlight.value}
                              </div>
                              <div className="text-sm text-gray-600">{highlight.label}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button className="gap-2">
                        <Download className="w-4 h-4" />
                        Download Full Report
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        View Executive Summary
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              2023 Financial Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how your contributions are used to maximize community impact
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  How We Use Your Donations
                </h3>
                <div className="space-y-4">
                  {financialBreakdown.expenses.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <span className="font-bold text-teal-600">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-600 h-3 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-6 leading-relaxed">
                  72% of every dollar directly supports our volunteer programs and community
                  initiatives, ensuring maximum impact for the communities we serve.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Sources</h3>
                <div className="space-y-4">
                  {financialBreakdown.revenue.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <span className="font-bold text-teal-600">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-6 leading-relaxed">
                  Our diverse funding sources ensure financial sustainability and allow us to
                  maintain independence in our community-focused mission.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Committed to Transparency
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                All our financial reports are independently audited and publicly available. We
                believe in complete transparency with our donors, volunteers, and community
                partners.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="gap-2">
                  <FileText className="w-4 h-4" />
                  View Audited Financials
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Tax Information
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
