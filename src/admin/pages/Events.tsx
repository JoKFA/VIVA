import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface EventRow {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  status: string;
  is_past_override: boolean | null;
  recap: unknown;
  published: boolean;
}

function isPastRow(r: EventRow): boolean {
  if (r.is_past_override !== null && r.is_past_override !== undefined) return r.is_past_override;
  const today = new Date().toISOString().split('T')[0];
  return r.date < today;
}

const TYPE_COLORS: Record<string, string> = {
  workshop: 'bg-blue-100 text-blue-700',
  'community-service': 'bg-green-100 text-green-700',
  career: 'bg-purple-100 text-purple-700',
  social: 'bg-yellow-100 text-yellow-700',
  fundraiser: 'bg-orange-100 text-orange-700',
};

export default function AdminEvents() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setError(null);
    const { data, error: err } = await supabase
      .from('events')
      .select('id,slug,title,date,type,status,is_past_override,recap,published')
      .order('date', { ascending: false });
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as EventRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setBusyId(id);
    setError(null);
    const { error: err } = await supabase.from('events').delete().eq('id', id);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await load();
  }

  async function togglePublish(id: string, v: boolean) {
    setBusyId(id);
    setError(null);
    const { error: err } = await supabase.from('events').update({ published: v }).eq('id', id);
    setBusyId(null);
    if (err) {
      setError(err.message);
      return;
    }
    await load();
  }

  return (
    <div>
      <AdminPageHeader title="Events" description="Manage upcoming and past events"
        action={
          <Link to="/admin/events/new" className="btn-admin-primary flex items-center gap-1.5 text-sm">
            <Plus size={14} />New Event
          </Link>
        }
      />
      <div className="p-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b">
                {['Date', 'Title', 'Type', 'Status', 'Past?', 'Recap', 'Published', ''].map(h => (
                  <th key={h} className="pb-2 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const past = isPastRow(r);
                const hasRecap = r.recap && typeof r.recap === 'object' && (r.recap as Record<string, unknown>).summary;
                return (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{r.date ?? '—'}</td>
                    <td className="py-2 pr-4">
                      <div className="font-medium text-gray-900">{r.title}</div>
                      <div className="text-xs text-gray-400">{r.slug}</div>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {r.type ?? '—'}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.status === 'open' ? 'bg-green-100 text-green-700' : r.status === 'waitlist' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status ?? '—'}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${past ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>
                        {past ? 'Past' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      {past && !hasRecap ? (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <AlertTriangle size={12} />Missing
                        </span>
                      ) : past ? (
                        <span className="text-xs text-green-600 font-medium">Done</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <PublishToggle published={r.published} disabled={busyId === r.id} onToggle={v => togglePublish(r.id, v)} />
                    </td>
                    <td className="py-2 flex gap-1 items-center">
                      <Link to={`/admin/events/${r.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Pencil size={14} />
                      </Link>
                      <button disabled={busyId === r.id} onClick={() => del(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-40">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-sm">No events yet. Add your first event.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
