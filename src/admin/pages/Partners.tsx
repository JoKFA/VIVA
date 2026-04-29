import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface PartnerRow { id: string; name: string; logo_url: string; website_url?: string; sort_order: number; published: boolean; }
const EMPTY: Omit<PartnerRow, 'id'> = { name: '', logo_url: '', website_url: '', sort_order: 0, published: true };

export default function AdminPartners() {
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PartnerRow, 'id'>>(EMPTY);

  async function load() {
    const { data } = await supabase.from('partners').select('*').order('sort_order');
    setRows((data ?? []) as PartnerRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editing === 'new') await supabase.from('partners').insert([form]);
    else if (editing) await supabase.from('partners').update(form).eq('id', editing);
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this partner?')) return;
    await supabase.from('partners').delete().eq('id', id); load();
  }

  async function togglePublish(id: string, v: boolean) {
    await supabase.from('partners').update({ published: v }).eq('id', id); load();
  }

  function startEdit(r: PartnerRow) {
    setEditing(r.id);
    setForm({ name: r.name, logo_url: r.logo_url, website_url: r.website_url ?? '', sort_order: r.sort_order, published: r.published });
  }

  const FormFields = () => (
    <div className="grid grid-cols-2 gap-3">
      {(['name', 'logo_url', 'website_url'] as const).map(k => (
        <div key={k}>
          <label className="block text-xs text-gray-500 mb-1">{k.replace(/_/g, ' ')}</label>
          <input value={String(form[k] ?? '')} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
      ))}
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
