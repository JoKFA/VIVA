import { Award, Calendar, FileText, Users, Download } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Awards() {
  const awards = [
    {
      title: 'VIVA Volunteer Excellence Award',
      description:
        'Recognizes outstanding volunteers who have demonstrated exceptional commitment, leadership, and impact in their community service.',
      eligibility: [
        'Minimum 100 volunteer hours in the past year',
        'Active participation in at least 3 VIVA events',
        'Demonstrated leadership or mentorship',
        'Positive impact on community outcomes',
      ],
      deadline: 'March 31, 2024',
      prize: '$1,000 + Certificate',
      icon: Award,
    },
    {
      title: 'Youth Leadership Scholarship',
      description:
        'Supporting young volunteers pursuing post-secondary education who have shown remarkable dedication to community service.',
      eligibility: [
        'Age 16-24',
        'Enrolled or accepted to post-secondary institution',
        'Minimum 50 volunteer hours in the past year',
        'Essay submission required',
      ],
      deadline: 'April 15, 2024',
      prize: '$2,500 Scholarship',
      icon: Users,
    },
    {
      title: 'Community Impact Award',
      description:
        'Honors individuals or groups whose volunteer initiatives have created measurable, positive change in their communities.',
      eligibility: [
        'Led or co-led a community project',
        'Demonstrated measurable impact',
        'Innovation in addressing community needs',
        'Collaboration with community partners',
      ],
      deadline: 'May 1, 2024',
      prize: '$1,500 + Featured Story',
      icon: Award,
    },
  ];

  const pastWinners = [
    {
      year: 2023,
      name: 'Emily Tran',
      award: 'Volunteer Excellence Award',
      achievement: 'Led food security initiatives reaching 500+ families',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      year: 2023,
      name: 'Jordan Mitchell',
      award: 'Youth Leadership Scholarship',
      achievement: 'Created youth mentorship program with 100+ participants',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      year: 2023,
      name: 'Community Garden Collective',
      award: 'Community Impact Award',
      achievement: 'Transformed vacant lots into thriving community gardens',
      image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      year: 2022,
      name: 'Michael Santos',
      award: 'Volunteer Excellence Award',
      achievement: 'Organized 20+ environmental clean-up events',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      year: 2022,
      name: 'Aisha Rahman',
      award: 'Youth Leadership Scholarship',
      achievement: 'Built tutoring program for newcomer students',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      year: 2022,
      name: 'Senior Care Initiative',
      award: 'Community Impact Award',
      achievement: 'Connected 200+ seniors with companionship services',
      image: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-600 to-emerald-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Awards & Scholarships
            </h1>
            <p className="text-xl text-teal-50 leading-relaxed">
              Celebrating and supporting outstanding volunteers who make a difference in
              their communities. Apply now to be recognized for your dedication and impact.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              2024 Awards & Scholarships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Applications are now open for this year's recognition programs
            </p>
          </div>

          <div className="space-y-8">
            {awards.map((award) => (
              <Card key={award.title} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-white flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <award.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{award.title}</h3>
                    <Badge className="bg-white/20 text-white border-white/40 mb-4">
                      {award.prize}
                    </Badge>
                    <div className="flex items-center space-x-2 text-teal-100">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Deadline: {award.deadline}</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {award.description}
                    </p>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Eligibility Criteria:
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {award.eligibility.map((criteria, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2" />
                          <span className="text-gray-600">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-4">
                      <Button className="gap-2">
                        <FileText className="w-4 h-4" />
                        Apply Now
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download Guidelines
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Past Recipients</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the incredible volunteers who have been recognized for their
              outstanding contributions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastWinners.map((winner, idx) => (
              <Card key={idx}>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={winner.image}
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900">{winner.year}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Award className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-medium text-teal-600">
                      {winner.award}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {winner.name}
                  </h3>
                  <p className="text-gray-600">{winner.achievement}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Application Process
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Review Criteria</h3>
                  <p className="text-sm text-gray-600">
                    Read eligibility requirements and guidelines carefully
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
                  <p className="text-sm text-gray-600">
                    Complete the online form and upload required documents
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Selection Process</h3>
                  <p className="text-sm text-gray-600">
                    Our committee reviews all applications and announces winners
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                All applications are reviewed by our Awards Committee, which includes board
                members, community partners, and past recipients. Winners are announced at
                our Annual Volunteer Appreciation Event in June.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Questions about the application process? Contact our awards team at{' '}
                <a
                  href="mailto:awards@viva.org"
                  className="text-teal-600 hover:underline"
                >
                  awards@viva.org
                </a>
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
