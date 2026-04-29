import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';

interface HonourRow {
  id: string;
  name: string;
  title: string;
  organization: string;
  tier: string;
  initials: string;
  accent: string;
  quote: string;
  letter_image_url: string;
  year: number;
  description: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: Omit<HonourRow, 'id'> = {
  name: '', title: '', organization: '', tier: '', initials: '', accent: '#c1272d',
  quote: '', letter_image_url: '', year: new Date().getFullYear(),
  description: '', sort_order: 0, published: true,
};

export default function AdminHonours() {
  const [rows, setRows] = useState<HonourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<HonourRow, 'id'>>(EMPTY);

  async function load() {
    const { data } = await supabase.from('honours_carousel_entries').select('*').order('sort_order');
    setRows((data ?? []) as HonourRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editing === 'new') await supabase.from('honours_carousel_entries').insert([form]);
    else if (editing) await supabase.from('honours_carousel_entries').update(form).eq('id', editing);
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this honour entry?')) return;
    await supabase.from('honours_carousel_entries').delete().eq('id', id);
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    await supabase.from('honours_carousel_entries').update({ published: v }).eq('id', id);
    load();
  }

  function startEdit(r: HonourRow) {
    setEditing(r.id);
    setForm({
      name: r.name, title: r.title, organization: r.organization, tier: r.tier,
      initials: r.initials, accent: r.accent, quote: r.quote,
      letter_image_url: r.letter_image_url ?? '', year: r.year, description: r.description ?? '',
      sort_order: r.sort_order, published: r.published,
    });
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Organization</label><input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Tier (e.g. Federal · 2025)</label><input value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Initials (2 letters)</label><input value={form.initials} maxLength={2} onChange={e => setForm(p => ({ ...p, initials: e.target.value }))} className={inp} /></div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Accent Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.accent} onChange={e => setForm(p => ({ ...p, accent: e.target.value }))} className="h-9 w-10 rounded border border-gray-200 cursor-pointer" />
            <input value={form.accent} onChange={e => setForm(p => ({ ...p, accent: e.target.value }))} className={inp} />
          </div>
        </div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Quote</label><textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} rows={2} className={inp} /></div>
        <div className="col-span-2">
          <MediaUpload label="Letter Image" kind="image" folder="honours/letters" value={form.letter_image_url} onChange={url => setForm(p => ({ ...p, letter_image_url: url }))} previewAlt={`${form.name} letter`} />
        </div>
        <div><label className="block text-xs text-gray-500 mb-1">Year</label><input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={inp} /></div>
      </div>
      <div className="flex items-center gap-3">
        <PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} />
        <span className="text-xs text-gray-500">Published</span>
        <button onClick={save} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg"><Check size={14} />Save</button>
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Honours Carousel" description="Recognition entries shown on the homepage carousel" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Entry</button>
      } />
      <div className="p-8 space-y-3">
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: r.accent }}>
                    {r.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.tier}</div>
                    <div className="text-xs text-gray-400">{r.organization}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PublishToggle published={r.published} onToggle={v => togglePublish(r.id, v)} />
                  <button onClick={() => startEdit(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil size={14} /></button>
                  <button onClick={() => del(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
