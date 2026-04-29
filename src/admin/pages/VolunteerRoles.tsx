import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';

interface RoleRow {
  id: string;
  title: string;
  program: string;
  description: string;
  commitment: string;
  skills: string[];
  tags: string[];
  published: boolean;
}

const EMPTY: Omit<RoleRow, 'id'> = {
  title: '', program: '', description: '', commitment: '', skills: [], tags: [], published: true,
};

type FormState = Omit<RoleRow, 'id' | 'skills' | 'tags'> & { skills: string; tags: string };

function toForm(r: Omit<RoleRow, 'id'>): FormState {
  return { ...r, skills: r.skills.join(', '), tags: r.tags.join(', ') };
}
function fromForm(f: FormState): Omit<RoleRow, 'id'> {
  return {
    ...f,
    skills: f.skills ? f.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    tags: f.tags ? f.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
  };
}

export default function AdminVolunteerRoles() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(toForm(EMPTY));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('volunteer_roles').select('*');
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as RoleRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    const payload = fromForm(form);
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('volunteer_roles').insert([payload]));
    else if (editing) ({ error: err } = await supabase.from('volunteer_roles').update(payload).eq('id', editing));
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setForm(toForm(EMPTY)); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this volunteer role?')) return;
    setError(null);
    const { error: err } = await supabase.from('volunteer_roles').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('volunteer_roles').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: RoleRow) {
    setEditing(r.id);
    setForm(toForm({ title: r.title, program: r.program, description: r.description, commitment: r.commitment, skills: r.skills ?? [], tags: r.tags ?? [], published: r.published }));
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Program</label><input value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Commitment</label><input value={form.commitment} onChange={e => setForm(p => ({ ...p, commitment: e.target.value }))} placeholder="e.g. 4 hrs/week" className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Skills (comma-sep)</label><input value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Tags (comma-sep)</label><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={inp} /></div>
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
      <AdminPageHeader title="Volunteer Roles" action={
        <button onClick={() => { setEditing('new'); setForm(toForm(EMPTY)); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Role</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm text-gray-900">{r.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.program} · {r.commitment}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(r.tags ?? []).map(t => <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{t}</span>)}
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
