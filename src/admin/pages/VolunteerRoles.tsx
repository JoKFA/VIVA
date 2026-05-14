import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';

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
interface WhyVolunteerForm {
  volunteer_why_heading: string;
  volunteer_why_body: string;
  volunteer_why_image_url: string;
}

const DEFAULT_WHY: WhyVolunteerForm = {
  volunteer_why_heading: 'Why Volunteer with VIVA',
  volunteer_why_body: 'Volunteering with VIVA allows you to create real impact by supporting those who need it most while actively shaping a stronger community. You will gain hands-on experience, connect with diverse cultures in Canada, and grow as a globally minded young leader. Together, we turn action into positive change and stories worth telling.',
  volunteer_why_image_url: '',
};

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
  const [whyForm, setWhyForm] = useState<WhyVolunteerForm>(DEFAULT_WHY);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [whySaving, setWhySaving] = useState(false);
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
  async function loadWhyVolunteer() {
    const { data, error: err } = await supabase
      .from('site_settings')
      .select('id, volunteer_why_heading, volunteer_why_body, volunteer_why_image_url')
      .maybeSingle();
    if (err) {
      setError(err.message);
      return;
    }
    if (data) {
      const r = data as Record<string, unknown>;
      setSettingsId(String(r.id));
      setWhyForm({
        volunteer_why_heading: String(r.volunteer_why_heading ?? DEFAULT_WHY.volunteer_why_heading),
        volunteer_why_body: String(r.volunteer_why_body ?? DEFAULT_WHY.volunteer_why_body),
        volunteer_why_image_url: String(r.volunteer_why_image_url ?? ''),
      });
    }
  }
  useEffect(() => { load(); loadWhyVolunteer(); }, []);

  async function saveWhyVolunteer() {
    setWhySaving(true);
    setError(null);
    const payload = { ...whyForm, updated_at: new Date().toISOString() };
    let err;
    if (settingsId) {
      ({ error: err } = await supabase.from('site_settings').update(payload).eq('id', settingsId));
    } else {
      const { data, error: insertError } = await supabase.from('site_settings').insert([payload]).select('id').single();
      err = insertError;
      if (data) setSettingsId(String((data as Record<string, unknown>).id));
    }
    setWhySaving(false);
    if (err) setError(err.message);
  }

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
        <section className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Why Volunteer Section</h2>
              <p className="text-xs text-gray-500 mt-0.5">Controls the public Volunteer page intro copy and image.</p>
            </div>
            <button onClick={saveWhyVolunteer} disabled={whySaving} className="btn-admin-primary text-sm">
              {whySaving ? 'Saving...' : 'Save Section'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Heading</label>
              <input value={whyForm.volunteer_why_heading} onChange={e => setWhyForm(p => ({ ...p, volunteer_why_heading: e.target.value }))} className={inp} />
            </div>
            <MediaUpload
              label="Section Image"
              kind="image"
              folder="volunteer"
              value={whyForm.volunteer_why_image_url}
              onChange={url => setWhyForm(p => ({ ...p, volunteer_why_image_url: url }))}
              previewAlt="Volunteer section"
            />
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Body</label>
              <textarea value={whyForm.volunteer_why_body} onChange={e => setWhyForm(p => ({ ...p, volunteer_why_body: e.target.value }))} rows={4} className={inp} />
            </div>
          </div>
        </section>
        {loading && <div className="animate-pulse h-20 bg-gray-100 rounded-lg" />}
        {editing === 'new' && <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">{FormFields()}</div>}
        {rows.map(r => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
            {editing === r.id ? FormFields() : (
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
