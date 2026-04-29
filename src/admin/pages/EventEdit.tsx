import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface EventForm {
  slug: string;
  title: string;
  description: string;
  date: string;
  end_date: string;
  time: string;
  location: string;
  address: string;
  type: string;
  tags: string;           // comma-separated for editing
  capacity: number;
  registered: number;
  status: string;
  image_url: string;
  lead_contact_name: string;
  lead_contact_email: string;
  lead_contact_phone: string;
  is_past_override: string; // 'auto' | 'true' | 'false'
  recap_summary: string;
  recap_volunteers: number;
  recap_hours: number;
  recap_beneficiaries: number;
  published: boolean;
}

const EMPTY: EventForm = {
  slug: '', title: '', description: '', date: '', end_date: '', time: '',
  location: '', address: '', type: 'workshop', tags: '', capacity: 0,
  registered: 0, status: 'open', image_url: '',
  lead_contact_name: '', lead_contact_email: '', lead_contact_phone: '',
  is_past_override: 'auto', recap_summary: '', recap_volunteers: 0,
  recap_hours: 0, recap_beneficiaries: 0, published: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminEventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState<EventForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data, error: err } = await supabase.from('events').select('*').eq('id', id!).single();
      if (err || !data) { setError(err?.message ?? 'Not found'); setLoading(false); return; }
      const r = data as Record<string, unknown>;
      const recap = r.recap as Record<string, unknown> | null;
      setForm({
        slug: String(r.slug ?? ''),
        title: String(r.title ?? ''),
        description: String(r.description ?? ''),
        date: String(r.date ?? ''),
        end_date: String(r.end_date ?? ''),
        time: String(r.time ?? ''),
        location: String(r.location ?? ''),
        address: String(r.address ?? ''),
        type: String(r.type ?? 'workshop'),
        tags: ((r.tags as string[]) ?? []).join(', '),
        capacity: Number(r.capacity ?? 0),
        registered: Number(r.registered ?? 0),
        status: String(r.status ?? 'open'),
        image_url: String(r.image_url ?? ''),
        lead_contact_name: String((r.lead_contact as Record<string, unknown>)?.name ?? ''),
        lead_contact_email: String((r.lead_contact as Record<string, unknown>)?.email ?? ''),
        lead_contact_phone: String((r.lead_contact as Record<string, unknown>)?.phone ?? ''),
        is_past_override: r.is_past_override === null || r.is_past_override === undefined
          ? 'auto' : r.is_past_override ? 'true' : 'false',
        recap_summary: String(recap?.summary ?? ''),
        recap_volunteers: Number(recap?.volunteersCount ?? 0),
        recap_hours: Number(recap?.hoursServed ?? 0),
        recap_beneficiaries: Number(recap?.beneficiaries ?? 0),
        published: Boolean(r.published ?? true),
      });
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function set<K extends keyof EventForm>(key: K, value: EventForm[K]) {
    setForm(p => ({ ...p, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const override = form.is_past_override === 'auto' ? null
      : form.is_past_override === 'true';

    const payload: Record<string, unknown> = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      description: form.description,
      date: form.date || null,
      end_date: form.end_date || null,
      time: form.time,
      location: form.location,
      address: form.address,
      type: form.type,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      capacity: form.capacity,
      registered: form.registered,
      status: form.status,
      image_url: form.image_url || null,
      lead_contact: form.lead_contact_email ? {
        name: form.lead_contact_name,
        email: form.lead_contact_email,
        phone: form.lead_contact_phone || undefined,
      } : null,
      is_past_override: override,
      recap: form.recap_summary ? {
        summary: form.recap_summary,
        volunteersCount: form.recap_volunteers,
        hoursServed: form.recap_hours,
        beneficiaries: form.recap_beneficiaries,
        gallery: [],
        quotes: [],
      } : null,
      published: form.published,
    };

    let err;
    if (isNew) {
      ({ error: err } = await supabase.from('events').insert([payload]));
    } else {
      ({ error: err } = await supabase.from('events').update(payload).eq('id', id!));
    }

    if (err) { setError(err.message); setSaving(false); return; }
    navigate('/admin/events');
  }

  if (loading) return <div className="p-8 animate-pulse"><div className="h-20 bg-gray-100 rounded-lg" /></div>;

  const isPast = form.is_past_override === 'true'
    || (form.is_past_override === 'auto' && form.date < new Date().toISOString().split('T')[0]);

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'New Event' : 'Edit Event'}
        action={
          <button onClick={() => navigate('/admin/events')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
            <ChevronLeft size={16} />Back to Events
          </button>
        }
      />
      <div className="p-8 max-w-3xl space-y-8">
        {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</div>}

        {/* Basic */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <F label="Title *"><input value={form.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)); }} className={inp} /></F>
            <F label="Slug *"><input value={form.slug} onChange={e => set('slug', e.target.value)} className={inp} /></F>
          </div>
          <F label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inp} />
          </F>
          <div className="grid grid-cols-3 gap-4">
            <F label="Date"><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} /></F>
            <F label="End Date"><input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className={inp} /></F>
            <F label="Time"><input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 10:00 AM" className={inp} /></F>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F label="Location"><input value={form.location} onChange={e => set('location', e.target.value)} className={inp} /></F>
            <F label="Address"><input value={form.address} onChange={e => set('address', e.target.value)} className={inp} /></F>
          </div>
        </section>

        {/* Classification */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Classification</h2>
          <div className="grid grid-cols-3 gap-4">
            <F label="Type">
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                {['workshop', 'community-service', 'career', 'social', 'fundraiser'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </F>
            <F label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                {['open', 'waitlist', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </F>
            <F label="Past Override">
              <select value={form.is_past_override} onChange={e => set('is_past_override', e.target.value)} className={inp}>
                <option value="auto">Auto (from date)</option>
                <option value="false">Force Upcoming</option>
                <option value="true">Force Past</option>
              </select>
            </F>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <F label="Tags (comma-separated)">
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="volunteer, fundraiser" className={inp} />
            </F>
            <F label="Capacity"><input type="number" value={form.capacity} onChange={e => set('capacity', Number(e.target.value))} className={inp} /></F>
            <F label="Registered"><input type="number" value={form.registered} onChange={e => set('registered', Number(e.target.value))} className={inp} /></F>
          </div>
          <F label="Image URL"><input value={form.image_url} onChange={e => set('image_url', e.target.value)} className={inp} /></F>
        </section>

        {/* Lead Contact */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Contact</h2>
          <div className="grid grid-cols-3 gap-4">
            <F label="Name"><input value={form.lead_contact_name} onChange={e => set('lead_contact_name', e.target.value)} className={inp} /></F>
            <F label="Email"><input value={form.lead_contact_email} onChange={e => set('lead_contact_email', e.target.value)} className={inp} /></F>
            <F label="Phone"><input value={form.lead_contact_phone} onChange={e => set('lead_contact_phone', e.target.value)} className={inp} /></F>
          </div>
        </section>

        {/* Recap (shown when event is past) */}
        {isPast && (
          <section className="space-y-4 border border-amber-200 rounded-xl p-5 bg-amber-50">
            <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Event Recap</h2>
            <F label="Summary">
              <textarea value={form.recap_summary} onChange={e => set('recap_summary', e.target.value)} rows={3} className={inp} />
            </F>
            <div className="grid grid-cols-3 gap-4">
              <F label="Volunteers Count"><input type="number" value={form.recap_volunteers} onChange={e => set('recap_volunteers', Number(e.target.value))} className={inp} /></F>
              <F label="Hours Served"><input type="number" value={form.recap_hours} onChange={e => set('recap_hours', Number(e.target.value))} className={inp} /></F>
              <F label="Beneficiaries"><input type="number" value={form.recap_beneficiaries} onChange={e => set('recap_beneficiaries', Number(e.target.value))} className={inp} /></F>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <PublishToggle published={form.published} onToggle={v => set('published', v)} />
          <span className="text-xs text-gray-500">Published</span>
          <button onClick={save} disabled={saving} className="ml-auto btn-admin-primary flex items-center gap-1.5">
            <Check size={14} />{saving ? 'Saving…' : isNew ? 'Create Event' : 'Save Changes'}
          </button>
          <button onClick={() => navigate('/admin/events')} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
        </div>
      </div>
    </div>
  );
}
