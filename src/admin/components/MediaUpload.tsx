import { useId, useState } from 'react';
import { FileUp, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type UploadKind = 'image' | 'pdf';

interface MediaUploadProps {
  label: string;
  value: string;
  kind: UploadKind;
  folder: string;
  onChange: (url: string) => void;
  previewAlt?: string;
}

const ACCEPT: Record<UploadKind, string> = {
  image: 'image/jpeg,image/png',
  pdf: 'application/pdf',
};

const LABEL: Record<UploadKind, string> = {
  image: 'JPG or PNG',
  pdf: 'PDF',
};

const EXTENSIONS: Record<UploadKind, string[]> = {
  image: ['jpg', 'jpeg', 'png'],
  pdf: ['pdf'],
};

const MAX_BYTES: Record<UploadKind, number> = {
  image: 5 * 1024 * 1024,
  pdf: 10 * 1024 * 1024,
};

function isAllowed(file: File, kind: UploadKind) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!EXTENSIONS[kind].includes(ext)) return false;
  if (kind === 'image') return ['image/jpeg', 'image/png'].includes(file.type);
  return file.type === 'application/pdf';
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
}

export function MediaUpload({ label, value, kind, folder, onChange, previewAlt }: MediaUploadProps) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!isAllowed(file, kind)) {
      setError(`Only ${LABEL[kind]} files are allowed.`);
      return;
    }
    if (file.size > MAX_BYTES[kind]) {
      setError(`${LABEL[kind]} files must be ${kind === 'image' ? '5 MB' : '10 MB'} or smaller.`);
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || (kind === 'pdf' ? 'pdf' : 'jpg');
    const path = `${folder}/${crypto.randomUUID()}-${safeName(file.name) || `upload.${ext}`}`;
    try {
      const { error: uploadError } = await supabase.storage
        .from('viva-media')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('viva-media').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <FileUp size={15} />
          {uploading ? 'Uploading...' : `Upload ${LABEL[kind]}`}
        </label>
        <input
          id={id}
          type="file"
          accept={ACCEPT[kind]}
          className="hidden"
          disabled={uploading}
          onChange={e => {
            handleFile(e.target.files?.[0]);
            e.currentTarget.value = '';
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {value && (
        <div className="mt-2">
          {kind === 'image' ? (
            <img src={value} alt={previewAlt || label} className="h-20 w-28 rounded-lg object-cover bg-gray-100 border border-gray-200" />
          ) : (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View uploaded PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
