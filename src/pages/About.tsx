import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { honours } from '../data/mockData';

const timeline = [
  { year: '2018', label: 'Founded', body: 'VIVA established in Burnaby, BC with a founding team of 12 volunteers.' },
  { year: '2019', label: 'First Cohort', body: 'Launched Youth Mentorship program — 40 students in the inaugural cohort.' },
  { year: '2021', label: 'VIVA EG', body: 'Environmental Group branch formed; first shoreline cleanup draws 200+ volunteers.' },
  { year: '2023', label: 'UBC Partnership', body: 'Formalized VIVA × UBC CLP partnership for the annual Career Fair.' },
  { year: '2026', label: 'Today', body: '2,500+ active volunteers, 120+ events annually, recognized by federal and provincial governments.' },
];

export default function About() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevLetter = () => setLightboxIdx((i) => (i! - 1 + honours.length) % honours.length);
  const nextLetter = () => setLightboxIdx((i) => (i! + 1) % honours.length);

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

      {/* Honours — A4 letter gallery */}
      <section className="bg-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Recognition</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-3">
            Recognized by Canada's Leaders
          </h2>
          <p className="text-warm-600 text-[0.9375rem] mb-10 max-w-lg">
            VIVA's impact has been acknowledged at the highest levels of government and academia. Click any letter to read in full.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {honours.map((h, i) => (
              <button
                key={h.id}
                onClick={() => openLightbox(i)}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
              >
                {/* A4 portrait card */}
                <div
                  className="relative bg-warm-50 border border-warm-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-soft-lg transition-shadow"
                  style={{ aspectRatio: '210 / 297' }}
                >
                  {/* Accent left bar */}
                  <div className="absolute top-0 left-0 w-1 h-full z-10" style={{ backgroundColor: h.accent }} />

                  {/* Letter scan or placeholder */}
                  {h.letterImageUrl ? (
                    <img
                      src={h.letterImageUrl}
                      alt={`Recognition letter from ${h.name}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
                      {/* Letterhead placeholder */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: h.accent }}
                      >
                        {h.initials}
                      </div>
                      <div className="w-3/4 space-y-1.5">
                        {[100, 85, 92, 70, 88, 60].map((w, j) => (
                          <div key={j} className="h-1.5 rounded bg-warm-200" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                      <p className="text-[9px] text-warm-400 text-center font-medium mt-2">
                        Full letter<br />coming soon
                      </p>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-warm-900/0 group-hover:bg-warm-900/40 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-warm-900 shadow-soft">
                      View letter
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-3 px-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: h.accent }}>
                    {h.tier}
                  </p>
                  <p className="font-display font-bold text-sm text-warm-900 leading-tight">{h.name}</p>
                  <p className="text-xs text-warm-500 mt-0.5">{h.organization}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prevLetter(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-h-[90vh]"
            style={{ aspectRatio: '210 / 297', maxWidth: 'min(420px, 90vw)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div
              className="absolute top-0 left-0 w-1.5 h-full z-10"
              style={{ backgroundColor: honours[lightboxIdx].accent }}
            />

            {honours[lightboxIdx].letterImageUrl ? (
              <img
                src={honours[lightboxIdx].letterImageUrl}
                alt={`Recognition letter from ${honours[lightboxIdx].name}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: honours[lightboxIdx].accent }}
                >
                  {honours[lightboxIdx].initials}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: honours[lightboxIdx].accent }}>
                    {honours[lightboxIdx].tier}
                  </p>
                  <p className="font-display font-bold text-warm-900 mb-1">{honours[lightboxIdx].name}</p>
                  <p className="text-sm text-warm-500 mb-6">{honours[lightboxIdx].organization}</p>
                  <blockquote className="text-warm-700 text-sm leading-relaxed italic border-l-2 pl-4 text-left" style={{ borderColor: honours[lightboxIdx].accent }}>
                    "{honours[lightboxIdx].quote}"
                  </blockquote>
                </div>
                <p className="text-xs text-warm-400 mt-4">Letter scan will be added soon.</p>
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextLetter(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {honours.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === lightboxIdx ? 'white' : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        </div>
      )}

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
