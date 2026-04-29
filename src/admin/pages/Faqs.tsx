import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface FaqRow { id: string; question: string; answer: string; category: string; sort_order: number; published: boolean; }
const EMPTY: Omit<FaqRow, 'id'> = { question: '', answer: '', category: '', sort_order: 0, published: true };

export default function AdminFaqs() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FaqRow, 'id'>>(EMPTY);

  async function load() {
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    setRows((data ?? []) as FaqRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editing === 'new') await supabase.from('faqs').insert([form]);
    else if (editing) await supabase.from('faqs').update(form).eq('id', editing);
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    await supabase.from('faqs').update({ published: v }).eq('id', id);
    load();
  }

  function startEdit(r: FaqRow) {
    setEditing(r.id);
    setForm({ question: r.question, answer: r.answer, category: r.category, sort_order: r.sort_order, published: r.published });
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Question</label><input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Answer</label><textarea value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} rows={3} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Category</label><input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inp} /></div>
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
      <AdminPageHeader title="FAQs" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add FAQ</button>
      } />
      <div className="p-8 space-y-3">
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  {r.category && <div className="text-xs font-medium text-primary-600 mb-0.5">{r.category}</div>}
                  <div className="font-semibold text-sm text-gray-900">{r.question}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.answer}</div>
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
