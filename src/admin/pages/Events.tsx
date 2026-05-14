import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';
import { localDateKey } from '../../utils/date';

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

interface GlobalContactForm {
  admin_name: string;
  admin_role: string;
  admin_wechat_id: string;
  admin_wechat_qr_url: string;
  admin_contact_note: string;
  published: boolean;
}

const EMPTY_CONTACT: GlobalContactForm = {
  admin_name: '',
  admin_role: 'Event Volunteer Coordinator',
  admin_wechat_id: '',
  admin_wechat_qr_url: '',
  admin_contact_note: '',
  published: true,
};

function isPastRow(r: EventRow): boolean {
  if (r.is_past_override !== null && r.is_past_override !== undefined) return r.is_past_override;
  const today = localDateKey();
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
  const [contact, setContact] = useState<GlobalContactForm>(EMPTY_CONTACT);
  const [contactSaving, setContactSaving] = useState(false);

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
  async function loadContact() {
    const { data, error: err } = await supabase
      .from('event_volunteer_contact_settings')
      .select('*')
      .maybeSingle();
    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      setContact({
        admin_name: String(data.admin_name ?? ''),
        admin_role: String(data.admin_role ?? ''),
        admin_wechat_id: String(data.admin_wechat_id ?? ''),
        admin_wechat_qr_url: String(data.admin_wechat_qr_url ?? ''),
        admin_contact_note: String(data.admin_contact_note ?? ''),
        published: Boolean(data.published ?? true),
      });
    }
  }
  useEffect(() => { load(); loadContact(); }, []);

  async function saveContact() {
    setContactSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from('event_volunteer_contact_settings')
      .upsert([{ id: true, ...contact }], { onConflict: 'id' });
    setContactSaving(false);
    if (err) setError(err.message);
  }

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
      <div className="p-8 space-y-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Global Join-as-Volunteer Contact</h2>
              <p className="text-xs text-gray-500 mt-0.5">Used by every upcoming event popup.</p>
            </div>
            <button onClick={saveContact} disabled={contactSaving} className="btn-admin-primary text-sm">
              {contactSaving ? 'Saving...' : 'Save Contact'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input value={contact.admin_name} onChange={e => setContact(p => ({ ...p, admin_name: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input value={contact.admin_role} onChange={e => setContact(p => ({ ...p, admin_role: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">WeChat ID</label>
              <input value={contact.admin_wechat_id} onChange={e => setContact(p => ({ ...p, admin_wechat_id: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
            </div>
            <MediaUpload label="WeChat QR Code" kind="image" folder="event-contact" value={contact.admin_wechat_qr_url} onChange={url => setContact(p => ({ ...p, admin_wechat_qr_url: url }))} previewAlt="WeChat QR code" />
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Contact Note</label>
              <textarea value={contact.admin_contact_note} onChange={e => setContact(p => ({ ...p, admin_contact_note: e.target.value }))} rows={2} className="w-full border rounded px-2 py-1.5 text-sm" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <PublishToggle published={contact.published} onToggle={v => setContact(p => ({ ...p, published: v }))} />
              <span className="text-xs text-gray-500">Show contact popup on upcoming events</span>
            </div>
          </div>
        </section>
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
