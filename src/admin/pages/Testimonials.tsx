import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface TestimonialRow { id: string; quote: string; author: string; role: string; published: boolean; }
const EMPTY: Omit<TestimonialRow, 'id'> = { quote: '', author: '', role: '', published: true };

export default function AdminTestimonials() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TestimonialRow, 'id'>>(EMPTY);

  async function load() {
    const { data } = await supabase.from('testimonials').select('*');
    setRows((data ?? []) as TestimonialRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editing === 'new') await supabase.from('testimonials').insert([form]);
    else if (editing) await supabase.from('testimonials').update(form).eq('id', editing);
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    await supabase.from('testimonials').update({ published: v }).eq('id', id);
    load();
  }

  function startEdit(r: TestimonialRow) {
    setEditing(r.id);
    setForm({ quote: r.quote, author: r.author, role: r.role, published: r.published });
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Quote</label><textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} rows={3} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Author</label><input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Role</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inp} /></div>
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
      <AdminPageHeader title="Testimonials" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Testimonial</button>
      } />
      <div className="p-8 space-y-3">
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm text-gray-700 italic line-clamp-2">"{r.quote}"</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.author} · {r.role}</div>
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
