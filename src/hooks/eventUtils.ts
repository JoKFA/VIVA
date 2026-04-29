/**
 * Shared utility: convert a Supabase events row to the frontend Event type.
 */
import type { Event } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRowToEvent(r: Record<string, any>): Event {
  const today = new Date().toISOString().split('T')[0];
  const isPast =
    r.is_past_override !== null && r.is_past_override !== undefined
      ? Boolean(r.is_past_override)
      : (r.date as string) < today;

  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    description: r.description as string,
    date: r.date as string,
    endDate: r.end_date as string | undefined,
    time: r.time as string,
    location: r.location as string,
    address: r.address as string | undefined,
    type: r.type as Event['type'],
    tags: (r.tags as string[]) ?? [],
    capacity: r.capacity as number,
    registered: r.registered as number,
    status: r.status as Event['status'],
    imageUrl: r.image_url as string | undefined,
    leadContact: r.lead_contact as Event['leadContact'],
    partners: r.partners as Event['partners'],
    agenda: r.agenda as string[] | undefined,
    whatYouWillDo: r.what_you_will_do as string[] | undefined,
    isPast,
    recap: r.recap as Event['recap'],
  };
}
