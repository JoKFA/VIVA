import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';

interface AwardRow {
  id: string;
  name: string;
  years: string[];
  description: string;
  eligibility: string;
  timeline: string;
  application_url: string;
  pdf_url: string;
  published: boolean;
}

const EMPTY: Omit<AwardRow, 'id'> = {
  name: '', years: [], description: '', eligibility: '', timeline: '',
  application_url: '', pdf_url: '', published: true,
};

type FormState = Omit<AwardRow, 'id' | 'years'> & { years: string };

function toFormState(r: Omit<AwardRow, 'id'>): FormState {
  return { ...r, years: r.years.join(', ') };
}
function fromFormState(f: FormState): Omit<AwardRow, 'id'> {
  return { ...f, years: f.years ? f.years.split(',').map(y => y.trim()).filter(Boolean) : [] };
}

export default function AdminAwards() {
  const [rows, setRows] = useState<AwardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(toFormState(EMPTY));
  const [error, setError] = useState<string | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [pageToggleBusy, setPageToggleBusy] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  async function load() {
    const [awardsRes, settingsRes] = await Promise.all([
      supabase.from('awards').select('*'),
      supabase.from('site_settings').select('id, awards_page_visible').maybeSingle(),
    ]);
    const { data, error: err } = awardsRes;
    if (err) {
      setError(err.message);
      setRows([]);
      setLoading(false);
      return;
    }
    if (!settingsRes.error && settingsRes.data) {
      setSettingsId(String(settingsRes.data.id));
      setPageVisible(Boolean(settingsRes.data.awards_page_visible ?? true));
    }
    setRows((data ?? []) as AwardRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    setError(null);
    const payload = fromFormState(form);
    let err;
    if (editing === 'new') ({ error: err } = await supabase.from('awards').insert([payload]));
    else if (editing) ({ error: err } = await supabase.from('awards').update(payload).eq('id', editing));
    if (err) {
      setError(err.message);
      return;
    }
    setEditing(null); setForm(toFormState(EMPTY)); load();
  }

  async function del(id: string) {
    if (!confirm('Delete this award?')) return;
    setError(null);
    const { error: err } = await supabase.from('awards').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePublish(id: string, v: boolean) {
    setError(null);
    const { error: err } = await supabase.from('awards').update({ published: v }).eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    load();
  }

  async function togglePageVisible(v: boolean) {
    setPageToggleBusy(true);
    setError(null);
    const payload = { awards_page_visible: v, updated_at: new Date().toISOString() };
    const { data, error: err } = settingsId
      ? await supabase.from('site_settings').update(payload).eq('id', settingsId).select('id').single()
      : await supabase.from('site_settings').insert([{ ...payload, published: true }]).select('id').single();
    setPageToggleBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setSettingsId(String(data.id));
    setPageVisible(v);
  }

  function startEdit(r: AwardRow) {
    setEditing(r.id);
    setForm(toFormState({ name: r.name, years: r.years, description: r.description, eligibility: r.eligibility, timeline: r.timeline, application_url: r.application_url, pdf_url: r.pdf_url, published: r.published }));
  }

  const inp = "w-full border border-gray-200 rounded px-2 py-1.5 text-sm";

  const FormFields = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-gray-500 mb-1">Name</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Years (comma-sep)</label><input value={form.years} onChange={e => setForm(p => ({ ...p, years: e.target.value }))} placeholder="2023, 2024" className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={inp} /></div>
        <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Eligibility</label><textarea value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} rows={2} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Timeline</label><input value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))} className={inp} /></div>
        <div><label className="block text-xs text-gray-500 mb-1">Application URL</label><input value={form.application_url} onChange={e => setForm(p => ({ ...p, application_url: e.target.value }))} className={inp} /></div>
        <MediaUpload label="Award PDF" kind="pdf" folder="awards/pdfs" value={form.pdf_url} onChange={url => setForm(p => ({ ...p, pdf_url: url }))} />
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
      <AdminPageHeader title="Awards" action={
        <button onClick={() => { setEditing('new'); setForm(toFormState(EMPTY)); }} className="btn-admin-primary flex items-center gap-1.5 text-sm"><Plus size={14} />Add Award</button>
      } />
      <div className="p-8 space-y-3">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <section className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Public Awards Page</h2>
            <p className="mt-0.5 text-xs text-gray-500">Controls navigation visibility and direct access for Awards & Scholarships.</p>
          </div>
          <div className="flex items-center gap-3">
            <PublishToggle published={pageVisible} disabled={pageToggleBusy} onToggle={togglePageVisible} />
            <span className={`text-xs font-medium ${pageVisible ? 'text-green-700' : 'text-gray-400'}`}>
              {pageVisible ? 'Shown' : 'Hidden'}
            </span>
          </div>
        </section>
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50"><FormFields /></div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? <FormFields /> : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.years?.join(', ')}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">{r.description}</div>
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
