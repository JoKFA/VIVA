import { Download } from 'lucide-react';
import { useAnnualReports } from '../hooks/useAnnualReports';
import { SafeImage } from '../components/ui/SafeImage';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const REPORT_FALLBACK = 'https://picsum.photos/180/240?grayscale&random=reports';

export default function AnnualReports() {
  const { settings: siteSettings } = useSiteSettings();
  const { data: annualReports } = useAnnualReports();
  const sorted = [...annualReports].sort((a, b) => b.year - a.year);

  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Transparency</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Annual Reports
            </h1>
          </div>
        </div>
      </div>

      {/* Intro blurb */}
      <section className="bg-white py-12 px-8 border-b border-warm-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-warm-600 text-[0.9375rem] leading-relaxed max-w-2xl">
            We believe in complete transparency with our community, donors, and partners. These reports
            document our programs, impact, and financial stewardship — year by year.
          </p>
        </div>
      </section>

      {/* Reports — clean download list, not card grid */}
      <section className="bg-warm-50 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {sorted.length > 0 ? (
            <div className="border-t border-warm-200">
              {sorted.map((report) => (
                <div key={report.id}
                  className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr_auto] items-start gap-6 py-8 border-b border-warm-200 bg-white px-6">
                  {/* Year */}
                  <div className="text-center md:text-left w-20 flex-shrink-0">
                    <p className="font-impact text-[3rem] text-primary-600 leading-none">{report.year}</p>
                  </div>

                  <SafeImage
                    src={report.coverImageUrl || REPORT_FALLBACK}
                    fallbackSrc={REPORT_FALLBACK}
                    alt={`${report.title} cover`}
                    className="h-28 w-20 rounded bg-warm-100 object-cover"
                    loading="lazy"
                  />

                  {/* Info */}
                  <div>
                    <h3 className="font-display font-bold text-lg text-warm-900 mb-1">{report.title}</h3>

                    {/* Key stats — small inline */}
                    {(report.totalVolunteers || report.totalHours || report.totalEvents) && (
                      <div className="flex flex-wrap gap-4 text-xs text-warm-500 mb-3">
                        {report.totalVolunteers && (
                          <span><strong className="text-warm-700">{report.totalVolunteers.toLocaleString()}</strong> volunteers</span>
                        )}
                        {report.totalHours && (
                          <span><strong className="text-warm-700">{report.totalHours.toLocaleString()}</strong> hours served</span>
                        )}
                        {report.totalEvents && (
                          <span><strong className="text-warm-700">{report.totalEvents}</strong> events</span>
                        )}
                      </div>
                    )}

                    {/* Highlights */}
                    {report.highlights && report.highlights.length > 0 && (
                      <ul className="space-y-1">
                        {report.highlights.map((h: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-warm-600">
                            <span className="w-1 h-1 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Download */}
                  <div className="flex-shrink-0">
                    {report.pdfUrl ? (
                      <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-700 text-sm font-semibold rounded-lg hover:bg-warm-100 hover:border-warm-400 transition-colors">
                        <Download className="w-4 h-4" /> Download PDF
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-200 text-warm-400 text-sm font-semibold rounded-lg">
                        PDF unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-t border-warm-200 py-20 text-center text-warm-400">
              <p className="text-sm">Annual reports will be published here. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Request info */}
      <section className="bg-white py-12 px-8 border-t border-warm-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <p className="text-warm-600 text-sm">
            Need financial statements or additional data for grant applications?
          </p>
          <a href={`mailto:${siteSettings.email}`}
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">
            Email us →
          </a>
        </div>
      </section>
    </div>
  );
}
