import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, ArrowRight } from 'lucide-react';
import { teamMembers } from '../data/mockData';

function Avatar({ src, alt, size = 56 }: { src: string; alt: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="img-placeholder" style={{ width: size, height: size, flexShrink: 0 }} />
  );
  return <img src={src} alt={alt} width={size} height={size} onError={() => setErr(true)} />;
}

const founders = [
  {
    name: 'Leaf Alifu',
    role: 'Founder',
    bio: 'Founded VIVA in 2018 with a vision to connect Metro Vancouver\'s diverse communities through meaningful volunteer work and to empower youth to become globally minded leaders.',
    img: 'https://picsum.photos/320/400?grayscale&random=70',
    linkedin: '#',
  },
  {
    name: 'Lynne Chen',
    role: 'Co-Founder & President',
    bio: 'Co-founded VIVA and serves as President, overseeing all programming, organizational operations, and strategic direction. Passionate about building inclusive volunteer pipelines for youth and newcomers across British Columbia.',
    img: 'https://picsum.photos/320/400?grayscale&random=71',
    linkedin: '#',
  },
];

export default function BoardOfExecutives() {
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);
  const executives = sortedMembers.filter((m) => m.isExecutive);
  const boardMembers = sortedMembers.filter((m) => !m.isExecutive);

  return (
    <div>
      {/* Page Header — Option 2 */}
      <div className="page-header pt-28">
        <div className="page-header-inner">
          <div className="page-header-bar" />
          <div>
            <p className="eyebrow">Leadership</p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,3rem)] text-warm-900 leading-tight">
              Board of Executives
            </h1>
          </div>
        </div>
      </div>

      {/* Founders — 2-up featured (large portrait + bio, NOT equal card grid) */}
      <section className="bg-warm-50 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow">Founders</p>
          <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-12">
            The People Who Started It All
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((f) => (
              <div key={f.name} className="flex gap-6 bg-white border border-warm-200 p-8">
                <div className="w-28 h-36 flex-shrink-0 overflow-hidden relative">
                  <Avatar src={f.img} alt={f.name} size={112} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-primary-600 mb-1">{f.role}</p>
                  <h3 className="font-display font-extrabold text-xl text-warm-900 mb-3">{f.name}</h3>
                  <p className="text-warm-600 text-sm leading-relaxed mb-4">{f.bio}</p>
                  {f.linkedin && (
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-600 hover:text-primary-600 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team — portrait rows */}
      {executives.length > 0 && (
        <section className="bg-white py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <p className="eyebrow">Executive Team</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-8">
              2025–2026 Executive Members
            </h2>

            <div className="border-t border-warm-200">
              {executives.map((member) => (
                <div key={member.id} className="board-row">
                  <div className="board-avatar flex-shrink-0">
                    <Avatar src={member.imageUrl || `https://picsum.photos/56/56?grayscale&random=${member.id}`} alt={member.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-[0.9375rem] text-warm-900">{member.name}</p>
                    <p className="text-sm text-warm-500">{member.role}</p>
                  </div>
                  {member.bio && (
                    <p className="text-sm text-warm-600 leading-relaxed max-w-lg hidden md:block">{member.bio}</p>
                  )}
                  {member.linkedInUrl && (
                    <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-warm-400 hover:text-primary-600 transition-colors flex-shrink-0"
                      aria-label={`${member.name} on LinkedIn`}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Board Members — portrait rows */}
      {boardMembers.length > 0 && (
        <section className="bg-warm-50 py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <p className="eyebrow">Board</p>
            <h2 className="font-display font-extrabold text-[clamp(1.75rem,3vw,2.25rem)] text-warm-900 mb-8">
              Board of Directors
            </h2>

            <div className="border-t border-warm-200 bg-white">
              {boardMembers.map((member) => (
                <div key={member.id} className="board-row px-6">
                  <div className="board-avatar flex-shrink-0">
                    <Avatar src={member.imageUrl || `https://picsum.photos/56/56?grayscale&random=${member.id}b`} alt={member.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-[0.9375rem] text-warm-900">{member.name}</p>
                    <p className="text-sm text-warm-500">{member.role}</p>
                  </div>
                  {member.bio && (
                    <p className="text-sm text-warm-600 leading-relaxed max-w-lg hidden md:block">{member.bio}</p>
                  )}
                  {member.linkedInUrl && (
                    <a href={member.linkedInUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-warm-400 hover:text-primary-600 transition-colors flex-shrink-0"
                      aria-label={`${member.name} on LinkedIn`}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state if no members in mockData */}
      {executives.length === 0 && boardMembers.length === 0 && (
        <section className="bg-white py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-warm-200 py-16 text-center text-warm-400">
              <p className="text-sm">Board member profiles coming soon.</p>
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="gradient-hero py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2">Get Involved</p>
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">Interested in a leadership role?</h2>
            <p className="text-white/80 text-sm max-w-md">
              We're always looking for passionate community members to join our board and leadership team.
            </p>
          </div>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-warm-100 transition-colors flex-shrink-0">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
