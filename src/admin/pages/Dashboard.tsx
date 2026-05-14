/**
 * Admin Dashboard — quick stats + links to each content section.
 * Also surfaces past events that are missing a recap (prompts admin to write one).
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Trophy, FileText, AlertCircle, ExternalLink, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { localDateKey } from '../../utils/date';

interface DashboardCounts {
  events: number;
  team: number;
  awards: number;
  reports: number;
  eventsNeedingRecap: { id: string; title: string; slug: string; date: string }[];
}

const EMPTY: DashboardCounts = {
  events: 0, team: 0, awards: 0, reports: 0, eventsNeedingRecap: [],
};

export default function Dashboard() {
  const [counts, setCounts] = useState<DashboardCounts>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const today = localDateKey();

      const [eventsRes, teamRes, awardsRes, reportsRes, recapRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('awards').select('id', { count: 'exact', head: true }),
        supabase.from('annual_reports').select('id', { count: 'exact', head: true }),
        supabase
          .from('events')
          .select('id, title, slug, date')
          .or(`is_past_override.eq.true,and(is_past_override.is.null,date.lt.${today})`)
          .is('recap', null)
          .eq('published', true)
          .order('date', { ascending: false })
          .limit(10),
      ]);

      const firstError = [eventsRes, teamRes, awardsRes, reportsRes, recapRes].find(r => r.error)?.error;
      if (firstError) {
        setLoadError(firstError.message);
        setLoading(false);
        return;
      }

      setCounts({
        events: eventsRes.count ?? 0,
        team: teamRes.count ?? 0,
        awards: awardsRes.count ?? 0,
        reports: reportsRes.count ?? 0,
        eventsNeedingRecap: (recapRes.data ?? []) as DashboardCounts['eventsNeedingRecap'],
      });
      setLoading(false);
    }
    load();
  }, []);

  const tiles = [
    { label: 'Events', count: counts.events, to: '/admin/events', icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
    { label: 'Team Members', count: counts.team, to: '/admin/team', icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Awards', count: counts.awards, to: '/admin/awards', icon: Trophy, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Annual Reports', count: counts.reports, to: '/admin/reports', icon: FileText, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loadError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          <XCircle size={16} className="shrink-0" />
          Failed to load dashboard stats: {loadError}
        </div>
      )}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      ) : (
        <>
          {/* Count tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {tiles.map(({ label, count, to, icon: Icon, color }) => (
              <Link key={to} to={to} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </Link>
            ))}
          </div>

          {/* Past events needing recap */}
          {counts.eventsNeedingRecap.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-amber-600" />
                <h2 className="font-semibold text-amber-800 text-sm">
                  {counts.eventsNeedingRecap.length} past event{counts.eventsNeedingRecap.length > 1 ? 's' : ''} missing a recap
                </h2>
              </div>
              <div className="space-y-2">
                {counts.eventsNeedingRecap.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between text-sm">
                    <span className="text-amber-900">{ev.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-600">{ev.date}</span>
                      <Link
                        to={`/admin/events/${ev.id}/edit`}
                        className="flex items-center gap-1 text-amber-700 font-medium hover:text-amber-900"
                      >
                        Write recap <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
