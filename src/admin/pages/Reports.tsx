import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';

interface ReportRow {
  id: string;
  year: number;
  title: string;
  highlights: string[];
  cover_image_url: string;
  pdf_url: string;
  total_volunteers: number;
  total_hours: number;
  total_events: number;
  published: boolean;
}

const EMPTY: Omit<ReportRow, 'id'> = {
  year: new Date().getFullYear(), title: '', highlights: [], cover_image_url: '',
  pdf_url: '', total_volunteers: 0, total_hours: 0, total_events: 0, published: true,
};

type FormState = Omit<ReportRow, 'id' | 'highlights'> & { highlights: string };

function toForm(r: Omit<ReportRow, 'id'>): FormState {
  return { ...r, highlights: r.highlights.join('\n') };
}
function fromForm(f: FormState): Omit<ReportRow, 'id'> {
  return { ...f, highlights: f.highlights ? f.highlights.split('\n').map(h => h.trim()).filter(Boolean) : [] };
}

export default function AdminReports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(toForm(EMPTY));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error: err } = await supabase.from('annual_reports').select('*').order('year', { ascending: false });
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as ReportRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    const payload = fromForm(form);
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('annual_reports').insert([payload]));
    else if (editing) ({ error: err } = await supabase.from('annual_reports').update(payload).eq('id', editing));
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setForm(toForm(EMPTY)); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this report?')) return;
    setError(null);
    const { error: err } = await supabase.from('annual_reports').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('annual_reports').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  function startEdit(r: ReportRow) {
    setEditing(r.id);
    setForm(toForm({ year: r.year, title: r.title, highlights: r.highlights ?? [], cover_image_url: r.cover_image_url, pdf_url: r.pdf_url, total_volunteers: r.total_volunteers, total_hours: r.total_hours, total_events: r.total_events, published: r.published }));
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Year</label><input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Title</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} /></div>
        <MediaUpload label="Cover Image" kind="image" folder="reports/covers" value={form.cover_image_url} onChange={url => setForm(p => ({ ...p, cover_image_url: url }))} previewAlt={form.title} />
        <MediaUpload label="Report PDF" kind="pdf" folder="reports/pdfs" value={form.pdf_url} onChange={url => setForm(p => ({ ...p, pdf_url: url }))} />
        <div><label className="block text-xs text-gray-500 mb-1">Total Volunteers</label><input type="number" value={form.total_volunteers} onChange={e => setForm(p => ({ ...p, total_volunteers: Number(e.target.value) }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Total Hours</label><input type="number" value={form.total_hours} onChange={e => setForm(p => ({ ...p, total_hours: Number(e.target.value) }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Total Events</label><input type="number" value={form.total_events} onChange={e => setForm(p => ({ ...p, total_events: Number(e.target.value) }))} className={inp} /></div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Highlights (one per line)</label>
          <textarea value={form.highlights} onChange={e => setForm(p => ({ ...p, highlights: e.target.value }))} rows={3} className={inp} placeholder="Highlight 1&#10;Highlight 2" />
        </div>
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
      <AdminPageHeader title="Annual Reports" action={
        <button onClick={() => { setEditing('new'); setForm(toForm(EMPTY)); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Report</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {r.cover_image_url && <img src={r.cover_image_url} alt={r.title} className="h-14 w-10 object-cover rounded bg-gray-100" />}
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{r.year} — {r.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{r.total_volunteers} volunteers · {r.total_hours} hrs · {r.total_events} events</div>
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
