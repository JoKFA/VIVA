import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';

interface TeamRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linked_in_url: string;
  is_executive: boolean;
  sort_order: number;
  published: boolean;
}

const EMPTY: Omit<TeamRow, 'id'> = {
  name: '', role: '', bio: '', image_url: '', linked_in_url: '',
  is_executive: false, sort_order: 0, published: true,
};

export default function AdminTeam() {
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeamRow, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('team_members').select('*').order('sort_order');
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as TeamRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    if (form.linked_in_url && !form.linked_in_url.startsWith('https://')) {
      setError('LinkedIn URL must start with https://');
      setSaving(false);
      return;
    }
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('team_members').insert([form]));
    else if (editing) ({ error: err } = await supabase.from('team_members').update(form).eq('id', editing));
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setEditing(null); setForm(EMPTY); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this team member?')) return;
    setError(null);
    const { error: err } = await supabase.from('team_members').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('team_members').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: TeamRow) {
    setEditing(r.id);
    setForm({ name: r.name, role: r.role, bio: r.bio, image_url: r.image_url, linked_in_url: r.linked_in_url, is_executive: r.is_executive, sort_order: r.sort_order, published: r.published });
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Role</label><input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} className={inp} /></div>
        <MediaUpload label="Portrait Image" kind="image" folder="team" value={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} previewAlt={form.name} />
        <div><label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label><input value={form.linked_in_url} onChange={e => setForm(p => ({ ...p, linked_in_url: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className={inp} /></div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="is_exec" checked={form.is_executive} onChange={e => setForm(p => ({ ...p, is_executive: e.target.checked }))} className="rounded" />
          <label htmlFor="is_exec" className="text-sm text-gray-700">Is Executive</label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} />
        <span className="text-xs text-gray-500">Published</span>
        <button onClick={save} disabled={saving} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg disabled:opacity-60"><Check size={14} />{saving ? 'Saving…' : 'Save'}</button>
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Team Members" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Member</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && (
          <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">
            {FormFields()}
          </div>
        )}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? (
              FormFields()
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {r.image_url
                    ? <img src={r.image_url} alt={r.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                    : <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold">{r.name[0]}</div>
                  }
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.role}</div>
                    {r.is_executive && <span className="text-xs text-primary-600 font-medium">Executive</span>}
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
