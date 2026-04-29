interface PublishToggleProps {
  published: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

export function PublishToggle({ published, onToggle, disabled = false, showLabel = false }: PublishToggleProps) {
  function handleClick() {
    if (published) {
      const ok = window.confirm('This will hide the item from the public website. It will remain editable in the CMS. Continue?');
      if (!ok) return;
    }
    onToggle(!published);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:opacity-50 ${
          published ? 'bg-green-500' : 'bg-gray-300'
        }`}
        title={published ? 'Visible on public website. Click to hide.' : 'Hidden from public website. Click to show.'}
        aria-label={published ? 'Hide from public website' : 'Show on public website'}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            published ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
      {showLabel && (
        <span className={`text-xs font-medium ${published ? 'text-green-700' : 'text-gray-400'}`}>
          {published ? 'Visible' : 'Hidden'}
        </span>
      )}
    </span>
  );
}
