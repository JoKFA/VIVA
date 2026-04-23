import { Link } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';
import { awards } from '../data/mockData';

export default function Awards() {
  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Recognition</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Awards & Scholarships
            </h1>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="bg-white py-16 px-8 border-b border-warm-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-warm-600 text-[0.9375rem] leading-relaxed mb-4">
              VIVA celebrates outstanding volunteers and supports young leaders through our annual awards
              and scholarship programs. These recognitions honour those who demonstrate exceptional
              dedication, leadership, and community impact.
            </p>
            <p className="text-warm-600 text-[0.9375rem] leading-relaxed">
              Nominations open each spring — community members, partner organizations, and VIVA staff
              can all submit nominations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-warm-50 border border-warm-200 p-6 text-center">
              <p className="font-impact text-5xl text-primary-600 leading-none mb-1">7+</p>
              <p className="text-xs text-warm-500 font-medium">Years of Awards</p>
            </div>
            <div className="bg-warm-50 border border-warm-200 p-6 text-center">
              <p className="font-impact text-5xl text-primary-600 leading-none mb-1">50+</p>
              <p className="text-xs text-warm-500 font-medium">Recipients Honoured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards list */}
      {awards.length > 0 ? (
        <section className="bg-warm-50 py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <p className="eyebrow">Current Programs</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-10">
              Available Awards & Scholarships
            </h2>

            <div className="space-y-0 border-t border-warm-200">
              {awards.map((award, i) => (
                <div key={award.id} className={`border-b border-warm-200 py-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start
                  ${i % 2 === 0 ? 'bg-white px-8' : 'bg-warm-50 px-8'}`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="font-display font-extrabold text-xl text-warm-900">{award.name}</h3>
                      {award.years && award.years.map((yr: number | string) => (
                        <span key={yr} className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-primary-50 text-primary-600 rounded">
                          {yr}
                        </span>
                      ))}
                    </div>
                    <p className="text-warm-600 text-[0.9375rem] leading-relaxed mb-5 max-w-2xl">{award.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                      {award.eligibility && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400 mb-1">Eligibility</p>
                          <p className="text-sm text-warm-600">{award.eligibility}</p>
                        </div>
                      )}
                      {award.timeline && (
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400 mb-1">Timeline</p>
                          <p className="text-sm text-warm-600">{award.timeline}</p>
                        </div>
                      )}
                    </div>

                    {/* Past recipients — compact inline list */}
                    {award.pastRecipients && award.pastRecipients.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-warm-400 mb-2">Past Recipients</p>
                        <div className="flex flex-wrap gap-3">
                          {award.pastRecipients.map((r: { name: string; year: number | string; achievement?: string }) => (
                            <div key={r.name + r.year}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-warm-200 text-sm">
                              <span className="font-medium text-warm-900">{r.name}</span>
                              <span className="text-warm-400">·</span>
                              <span className="text-warm-500 text-xs">{r.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <a href={award.applicationUrl || '/contact'}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    {award.pdfUrl && (
                      <a href={award.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-700 text-sm font-semibold rounded-lg hover:bg-warm-100 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Guidelines PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-warm-50 py-20 px-8">
          <div className="max-w-7xl mx-auto text-center text-warm-400 py-12">
            <p className="text-sm">Award programs for the current cycle will be announced shortly. Check back soon.</p>
          </div>
        </section>
      )}

      {/* Nomination CTA */}
      <section className="bg-warm-900 py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-2">Nominations</p>
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">Know someone deserving?</h2>
            <p className="text-warm-400 text-sm max-w-md">
              Nominate a volunteer who has made an exceptional impact. Nominations are reviewed by an independent committee.
            </p>
          </div>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors flex-shrink-0">
            Submit Nomination <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
