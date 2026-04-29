import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';
import { INTERNAL_LINK_OPTIONS } from '../utils/routes';

interface ProgramRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  image_url: string;
  sort_order: number;
  published: boolean;
}

const EMPTY: Omit<ProgramRow, 'id'> = {
  title: '',
  description: '',
  icon: '',
  link: '/volunteer',
  image_url: '',
  sort_order: 0,
  published: true,
};

export default function AdminPrograms() {
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ProgramRow, 'id'>>(EMPTY);

  async function load() {
    const { data } = await supabase.from('programs').select('*').order('sort_order');
    setRows((data ?? []) as ProgramRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editing === 'new') await supabase.from('programs').insert([form]);
    else if (editing) await supabase.from('programs').update(form).eq('id', editing);
    setEditing(null);
    setForm(EMPTY);
    load();
  }

  async function del(id: string) {
    if (!confirm('Delete this program?')) return;
    await supabase.from('programs').delete().eq('id', id);
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    await supabase.from('programs').update({ published: v }).eq('id', id);
    load();
  }

  function startEdit(row: ProgramRow) {
    setEditing(row.id);
    setForm({
      title: row.title,
      description: row.description,
      icon: row.icon,
      link: row.link || '/volunteer',
      image_url: row.image_url ?? '',
      sort_order: row.sort_order,
      published: row.published,
    });
  }

  function FormFields() {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Icon</label>
          <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Link</label>
          <select
            value={form.link}
            onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
          >
            {INTERNAL_LINK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label} ({opt.value})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Order</label>
          <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} className="w-full border rounded px-2 py-1.5 text-sm" />
        </div>
        <div className="col-span-2">
          <MediaUpload
            label="Homepage Image"
            kind="image"
            folder="programs"
            value={form.image_url}
            onChange={url => setForm(p => ({ ...p, image_url: url }))}
            previewAlt={form.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Programs" action={
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Program</button>
      } />
      <div className="p-8 space-y-3">
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && (
          <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-3">
            <h3 className="font-semibold text-sm text-gray-800">New Program</h3>
            <FormFields />
            <div className="flex items-center gap-3 pt-1">
              <PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} />
              <span className="text-xs text-gray-500">Published</span>
              <button onClick={save} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><Check size={14} />Save</button>
              <button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button>
            </div>
          </div>
        )}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? (
              <div className="space-y-3">
                <FormFields />
                <div className="flex items-center gap-3">
                  <PublishToggle published={form.published} onToggle={v => setForm(p => ({ ...p, published: v }))} />
                  <span className="text-xs text-gray-500">Published</span>
                  <button onClick={save} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"><Check size={14} />Save</button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"><X size={14} />Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {r.image_url && <img src={r.image_url} alt={r.title} className="h-14 w-20 rounded-lg object-cover bg-gray-100" />}
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{r.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>
                    <div className="text-xs text-gray-400 mt-1">Icon: {r.icon} - Link: {r.link}</div>
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
