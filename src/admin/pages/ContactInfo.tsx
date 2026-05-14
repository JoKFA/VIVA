import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface ContactRow { id: string; type: string; title: string; value: string; icon: string; sort_order: number; published: boolean; }
const EMPTY: Omit<ContactRow, 'id'> = { type: 'office', title: '', value: '', icon: '', sort_order: 0, published: true };

export default function AdminContactInfo() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ContactRow, 'id'>>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('contact_info').select('*').order('sort_order');
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as ContactRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('contact_info').insert([form]));
    else if (editing) ({ error: err } = await supabase.from('contact_info').update(form).eq('id', editing));
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this contact entry?')) return;
    setError(null);
    const { error: err } = await supabase.from('contact_info').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('contact_info').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: ContactRow) {
    setEditing(r.id);
    setForm({ type: r.type, title: r.title, value: r.value, icon: r.icon, sort_order: r.sort_order, published: r.published });
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inp}>
            {['office', 'email', 'phone', 'press'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1">Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Value</label><input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Icon (lucide name)</label><input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="MapPin" className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className={inp} /></div>
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
      <AdminPageHeader title="Contact Info" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Entry</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Site Settings controls the canonical address, phone, email, media email, and social links used across the site. This page is for optional ordered contact rows; keep duplicate values in sync when both are used.
        </div>
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">{FormFields()}</div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? FormFields() : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">{r.type}</span>
                    <span className="font-semibold text-sm text-gray-900">{r.title}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.value}</div>
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
