/**
 * useEventWithContact — loads a single event by slug plus its volunteer
 * contact info (only when the event is upcoming AND contact is published).
 *
 * Past events never show volunteer contact — the contact section is omitted
 * from the UI entirely for past events.
 */
import { useEffect, useState } from 'react';
import type { Event, EventVolunteerContact } from '../types';
import { supabase } from '../lib/supabase';
import { events as mockEvents, eventVolunteerContacts } from '../data/mockData';
import { dbRowToEvent } from './eventUtils';

interface EventWithContact {
  event: Event | null;
  contact: EventVolunteerContact | null;
}

export function useEventWithContact(slug: string) {
  const mockEvent = mockEvents.find(e => e.slug === slug) ?? null;
  const mockContact = eventVolunteerContacts[slug] ?? null;

  const [data, setData] = useState<EventWithContact>({
    event: mockEvent,
    contact: mockContact,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetch() {
      try {
        // Fetch event
        const { data: eventRow, error: eventErr } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (cancelled) return;
        if (eventErr || !eventRow) {
          setError(eventErr?.message ?? 'Event not found');
          return;
        }

        const event = dbRowToEvent(eventRow);

        // Only fetch contact for upcoming events
        let contact: EventVolunteerContact | null = null;
        if (!event.isPast) {
          const { data: contactRow } = await supabase
            .from('event_volunteer_contacts')
            .select('*')
            .eq('event_slug', slug)
            .eq('published', true)
            .single();

          if (contactRow) {
            contact = {
              eventSlug: contactRow.event_slug as string,
              adminName: contactRow.admin_name as string,
              adminRole: contactRow.admin_role as string,
              adminWechatId: contactRow.admin_wechat_id as string | undefined,
              adminWechatQrUrl: contactRow.admin_wechat_qr_url as string | undefined,
              adminContactNote: contactRow.admin_contact_note as string | undefined,
            };
          }
        }

        if (!cancelled) setData({ event, contact });
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  return { ...data, loading, error };
}
