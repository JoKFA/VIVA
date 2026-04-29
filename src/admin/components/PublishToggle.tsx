/** Toggle a row's published status directly in-table */
interface PublishToggleProps {
  published: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
}

export function PublishToggle({ published, onToggle, disabled = false }: PublishToggleProps) {
  return (
    <button
      onClick={() => onToggle(!published)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:opacity-50 ${
        published ? 'bg-green-500' : 'bg-gray-300'
      }`}
      title={published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          published ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}
