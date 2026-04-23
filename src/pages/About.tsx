import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const timeline = [
  { year: '2018', label: 'Founded', body: 'VIVA established in Burnaby, BC with a founding team of 12 volunteers.' },
  { year: '2019', label: 'First Cohort', body: 'Launched Youth Mentorship program — 40 students in the inaugural cohort.' },
  { year: '2021', label: 'VIVA EG', body: 'Environmental Group branch formed; first shoreline cleanup draws 200+ volunteers.' },
  { year: '2023', label: 'UBC Partnership', body: 'Formalized VIVA × UBC CLP partnership for the annual Career Fair.' },
  { year: '2026', label: 'Today', body: '2,500+ active volunteers, 120+ events annually, recognized by federal and provincial governments.' },
];

const honours = [
  {
    name: 'Mark Carney',
    role: 'Prime Minister of Canada',
    tier: 'Federal · 2025',
    accent: '#c1272d',
    quote: '"VIVA\'s dedication to strengthening communities through volunteer service exemplifies the spirit of Canadian civic engagement."',
    img: 'https://picsum.photos/56/56?grayscale&random=60',
  },
  {
    name: 'Premier of British Columbia',
    role: 'Province of British Columbia',
    tier: 'Provincial · 2025',
    accent: '#1a5c9e',
    quote: '"British Columbia is proud to recognize VIVA for their outstanding contributions to youth development and community building."',
    img: 'https://picsum.photos/56/56?grayscale&random=61',
  },
  {
    name: 'Mayor of Burnaby',
    role: 'City of Burnaby',
    tier: 'Municipal · 2024',
    accent: '#15803d',
    quote: '"VIVA has become an essential part of our city\'s volunteer ecosystem — connecting thousands of residents with meaningful community work."',
    img: 'https://picsum.photos/56/56?grayscale&random=62',
  },
  {
    name: 'UBC Student Affairs',
    role: 'University of British Columbia',
    tier: 'Academic · 2025',
    accent: '#002145',
    quote: '"The VIVA × UBC partnership has given hundreds of international students a real pathway into Canadian professional life."',
    img: 'https://picsum.photos/56/56?grayscale&random=63',
  },
];

export default function About() {
  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Since 2018</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Our Story
            </h1>
          </div>
        </div>
      </div>

      {/* Mission pull quote */}
      <section className="bg-warm-900 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-impact text-[clamp(1.5rem,3vw,2.25rem)] text-white leading-relaxed tracking-wide">
            "We exist to connect passionate people with meaningful work — and to prove that community is built one volunteer at a time."
          </p>
          <p className="text-warm-500 text-sm mt-6 tracking-widest uppercase font-semibold">VIVA Founding Principle</p>
        </div>
      </section>

      {/* Mission + Vision — split, NOT equal floating cards */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 border border-warm-200">
          <div className="p-12 border-b lg:border-b-0 lg:border-r border-warm-200">
            <p className="eyebrow">Mission</p>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-5">Why We Exist</h2>
            <p className="text-warm-600 text-[0.9375rem] leading-relaxed">
              To connect passionate volunteers with meaningful opportunities that address critical community
              needs, foster personal growth, and build stronger, more resilient neighbourhoods across
              Metro Vancouver and British Columbia.
            </p>
          </div>
          <div className="p-12">
            <p className="eyebrow">Vision</p>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-5">Where We're Going</h2>
            <p className="text-warm-600 text-[0.9375rem] leading-relaxed">
              A thriving, inclusive community where every person has the opportunity to contribute their
              unique talents — where newcomers are welcomed, youth are empowered, and collective action
              drives sustainable change for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline — horizontal on desktop, vertical on mobile */}
      <section className="bg-warm-50 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Our Journey</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-12">
            Eight Years of Impact
          </h2>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start gap-0 relative">
            {/* connecting line */}
            <div className="absolute top-[28px] left-[5%] right-[5%] h-px bg-warm-300" />
            {timeline.map((item, i) => (
              <div key={item.year} className="flex-1 relative px-4 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 border-2
                  ${i === timeline.length - 1 ? 'bg-primary-600 border-primary-600' : 'bg-white border-warm-300'}`}>
                  <span className={`font-impact text-sm tracking-wide ${i === timeline.length - 1 ? 'text-white' : 'text-warm-600'}`}>
                    {item.year}
                  </span>
                </div>
                <p className="font-display font-bold text-[0.875rem] text-warm-900 mb-1">{item.label}</p>
                <p className="text-xs text-warm-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-0 border-l-2 border-warm-300 ml-6">
            {timeline.map((item, i) => (
              <div key={item.year} className="relative pl-8 pb-10">
                <div className={`absolute -left-[17px] w-8 h-8 rounded-full flex items-center justify-center
                  ${i === timeline.length - 1 ? 'bg-primary-600' : 'bg-white border-2 border-warm-300'}`}>
                  <span className={`font-impact text-[10px] ${i === timeline.length - 1 ? 'text-white' : 'text-warm-600'}`}>
                    {item.year.slice(2)}
                  </span>
                </div>
                <p className="font-impact text-warm-400 text-2xl leading-none mb-1">{item.year}</p>
                <p className="font-display font-bold text-warm-900 mb-1">{item.label}</p>
                <p className="text-sm text-warm-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honours — same carousel as home */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Recognition</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-3">
            Recognized by Canada's Leaders
          </h2>
          <p className="text-warm-600 text-[0.9375rem] mb-8 max-w-lg">
            VIVA's impact has been acknowledged at the highest levels of government and academia.
          </p>

          <div className="honours-track">
            {honours.map((h) => (
              <div
                key={h.name}
                className="honours-card bg-warm-50 border border-warm-200 border-l-4 p-8"
                style={{ borderLeftColor: h.accent }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-warm-200">
                    <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-[0.9375rem] text-warm-900">{h.name}</p>
                    <p className="text-sm text-warm-600">{h.role}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color: h.accent }}>{h.tier}</p>
                  </div>
                </div>
                <p className="text-warm-700 text-[0.9375rem] leading-relaxed italic">{h.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board CTA */}
      <section className="bg-warm-50 py-16 px-8 border-t border-warm-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-1">Meet the People Behind VIVA</h2>
            <p className="text-warm-600">Our board of executives and volunteer leadership team.</p>
          </div>
          <Link
            to="/about/board"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            Board of Executives <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
