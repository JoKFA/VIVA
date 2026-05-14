export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateOnly(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateOnly(
  dateStr: string,
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = parseDateOnly(dateStr);
  if (!date) return 'Date TBD';
  return date.toLocaleDateString(locales, options);
}
