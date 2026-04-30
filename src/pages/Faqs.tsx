import { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useFaqs } from '../hooks/useFaqs';

export default function Faqs() {
  const { data: faqs, loading } = useFaqs();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const groupedFaqs = useMemo(() => {
    const groups = new Map<string, typeof faqs>();
    for (const faq of faqs) {
      const category = faq.category || 'General';
      groups.set(category, [...(groups.get(category) ?? []), faq]);
    }
    return Array.from(groups.entries());
  }, [faqs]);

  return (
    <div>
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Support</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Frequently Asked Questions
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-white py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-10">
            <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl text-warm-900 mb-2">
                Answers before you reach out
              </h2>
              <p className="text-warm-600 text-sm leading-relaxed">
                Find quick answers about volunteering, events, applications, donations, and getting involved with VIVA.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-16 animate-pulse rounded-lg bg-warm-100" />
              ))}
            </div>
          ) : groupedFaqs.length > 0 ? (
            <div className="space-y-10">
              {groupedFaqs.map(([category, items]) => (
                <div key={category}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-600">
                    {category.replace(/-/g, ' ')}
                  </h3>
                  <div className="border-t border-warm-200">
                    {items.map((faq) => (
                      <div key={faq.id} className="border-b border-warm-200">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                          className={`flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold transition-colors ${
                            openFaq === faq.id ? 'text-primary-600' : 'text-warm-900 hover:text-primary-600'
                          }`}
                          aria-expanded={openFaq === faq.id}
                        >
                          <span>{faq.question}</span>
                          <span className={`text-xl leading-none transition-transform ${openFaq === faq.id ? 'rotate-45' : ''}`}>
                            +
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                            openFaq === faq.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <p className="overflow-hidden pb-5 text-sm leading-relaxed text-warm-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-warm-200 bg-warm-50 px-5 py-4 text-sm text-warm-600">
              FAQs are coming soon.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
