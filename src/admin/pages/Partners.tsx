import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { MediaUpload } from '../components/MediaUpload';
import { PublishToggle } from '../components/PublishToggle';

interface PartnerRow { id: string; name: string; logo_url: string; website_url?: string; sort_order: number; published: boolean; }
const EMPTY: Omit<PartnerRow, 'id'> = { name: '', logo_url: '', website_url: '', sort_order: 0, published: true };

export default function AdminPartners() {
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PartnerRow, 'id'>>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('partners').select('*').order('sort_order');
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as PartnerRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('partners').insert([form]));
    else if (editing) ({ error: err } = await supabase.from('partners').update(form).eq('id', editing));
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this partner?')) return;
    setError(null);
    const { error: err } = await supabase.from('partners').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('partners').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: PartnerRow) {
    setEditing(r.id);
    setForm({ name: r.name, logo_url: r.logo_url, website_url: r.website_url ?? '', sort_order: r.sort_order, published: r.published });
  }

  const FormFields = () => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Website URL</label>
        <input type="url" value={form.website_url ?? ''} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
      </div>
      <div className="col-span-2">
        <MediaUpload label="Partner Logo" kind="image" folder="partners/logos" value={form.logo_url} onChange={url => setForm(p => ({ ...p, logo_url: url }))} previewAlt={form.name} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Sort Order</label>
        <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full border rounded px-2 py-1.5 text-sm" />
      </div>
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Partners" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Partner</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && (
          <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-3">
            <FormFields />
            <div className="flex items-center gap-3"><PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} /><span className="text-xs text-gray-500">Published</span><button onClick={save} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg"><Check size={14} />Save</button><button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button></div>
          </div>
        )}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? (
              <div className="space-y-3"><FormFields /><div className="flex items-center gap-3"><PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} /><span className="text-xs text-gray-500">Published</span><button onClick={save} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg"><Check size={14} />Save</button><button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button></div></div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {r.logo_url && <img src={r.logo_url} alt={r.name} className="h-10 w-20 object-contain bg-gray-50 rounded p-1" />}
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                    {r.website_url && <a href={r.website_url} className="text-xs text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{r.website_url}</a>}
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
