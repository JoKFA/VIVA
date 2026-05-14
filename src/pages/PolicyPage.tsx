import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const PAGES: Record<string, { eyebrow: string; title: string; body: string[] }> = {
  'code-of-conduct': {
    eyebrow: 'Community Standards',
    title: 'Code of Conduct',
    body: [
      'VIVA expects volunteers, participants, partners, and staff to help create a respectful, inclusive, and safe community environment.',
      'Harassment, discrimination, intimidation, or unsafe conduct is not accepted at VIVA programs or events.',
      'Concerns can be shared with the VIVA team at info.vivahq@gmail.com.',
    ],
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    body: [
      'VIVA collects contact and application information only for volunteer coordination, event operations, communications, and related organizational purposes.',
      'We do not sell personal information. Access is limited to team members who need the information to support VIVA programs.',
      'Questions about privacy can be sent to info.vivahq@gmail.com.',
    ],
  },
  accessibility: {
    eyebrow: 'Accessibility',
    title: 'Accessibility',
    body: [
      'VIVA aims to make community participation welcoming and accessible.',
      'If you need an accommodation for a program, event, or website experience, contact us and we will work with you on reasonable support options.',
      'Accessibility requests can be sent to info.vivahq@gmail.com.',
    ],
  },
};

export default function PolicyPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, '');
  const page = useMemo(() => PAGES[slug] ?? PAGES.privacy, [slug]);

  return (
    <div>
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              {page.title}
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-white py-16 px-8">
        <div className="max-w-3xl mx-auto space-y-5 text-sm leading-relaxed text-warm-600">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
