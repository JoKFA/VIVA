import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface StatRow { id: string; label: string; value: number; suffix?: string; prefix?: string; sort_order: number; published: boolean; }
const EMPTY: Omit<StatRow, 'id'> = { label: '', value: 0, suffix: '', prefix: '', sort_order: 0, published: true };

export default function AdminStats() {
  const [rows, setRows] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StatRow, 'id'>>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('stats').select('*').order('sort_order');
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as StatRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    let err;
    if (editing === 'new') {
      ({ error: err } = await supabase.from('stats').insert([form]));
    } else if (editing) {
      ({ error: err } = await supabase.from('stats').update(form).eq('id', editing));
    }
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setAdding(false); setForm(EMPTY);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this stat?')) return;
    setError(null);
    const { error: err } = await supabase.from('stats').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('stats').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: StatRow) {
    setEditing(r.id);
    setForm({ label: r.label, value: r.value, suffix: r.suffix ?? '', prefix: r.prefix ?? '', sort_order: r.sort_order, published: r.published });
    setAdding(false);
  }

  return (
    <div>
      <AdminPageHeader title="Stats" description="Homepage statistics counters"
        action={<button onClick={() => { setAdding(true); setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Stat</button>} />
      <div className="p-8">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? <div className="animate-pulse h-20 bg-gray-100 rounded-lg" /> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 border-b">{['Label','Value','Suffix','Prefix','Order','Published',''].map(h => <th key={h} className="pb-2 pr-4 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {adding && editing === 'new' && (
                <tr className="border-b bg-blue-50">
                  {(['label','value','suffix','prefix','sort_order'] as const).map(k => (
                    <td key={k} className="py-2 pr-2"><input type={k === 'value' || k === 'sort_order' ? 'number' : 'text'} value={String(form[k])} onChange={e => setForm(p => ({ ...p, [k]: k === 'value' || k === 'sort_order' ? Number(e.target.value) : e.target.value }))} className="w-full border rounded px-2 py-1 text-xs" /></td>
                  ))}
                  <td className="py-2 pr-2"><PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} /></td>
                  <td className="py-2 flex gap-1"><button onClick={save} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button><button onClick={() => { setAdding(false); setEditing(null); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={14} /></button></td>
                </tr>
              )}
              {rows.map(r => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  {editing === r.id ? (
                    <>
                      {(['label','value','suffix','prefix','sort_order'] as const).map(k => (
                        <td key={k} className="py-2 pr-2"><input type={k === 'value' || k === 'sort_order' ? 'number' : 'text'} value={String(form[k])} onChange={e => setForm(p => ({ ...p, [k]: k === 'value' || k === 'sort_order' ? Number(e.target.value) : e.target.value }))} className="w-full border rounded px-2 py-1 text-xs" /></td>
                      ))}
                      <td className="py-2 pr-2"><PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} /></td>
                      <td className="py-2 flex gap-1"><button onClick={save} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14} /></button><button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={14} /></button></td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 pr-4 font-medium text-gray-800">{r.label}</td>
                      <td className="py-2 pr-4 text-gray-600">{r.value}</td>
                      <td className="py-2 pr-4 text-gray-500">{r.suffix}</td>
                      <td className="py-2 pr-4 text-gray-500">{r.prefix}</td>
                      <td className="py-2 pr-4 text-gray-400">{r.sort_order}</td>
                      <td className="py-2 pr-4"><PublishToggle published={r.published} onToggle={v => togglePublish(r.id, v)} /></td>
                      <td className="py-2 flex gap-1"><button onClick={() => startEdit(r)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil size={14} /></button><button onClick={() => del(r.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
