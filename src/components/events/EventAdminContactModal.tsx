import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, LockKeyhole, Mail, MapPin, MessageSquare, Users, X } from 'lucide-react';
import type { Event, EventVolunteerContact } from '../../types';

interface EventAdminContactModalProps {
  event: Event;
  contact: EventVolunteerContact;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function QrDisplay({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="block h-full w-full rounded-md object-cover" />;
  }

  return (
    <div
      aria-label={alt}
      className="relative block h-full w-full rounded-md bg-white"
      style={{
        backgroundImage:
          'linear-gradient(90deg, #111 6px, transparent 6px), linear-gradient(#111 6px, transparent 6px)',
        backgroundPosition: '7px 7px',
        backgroundSize: '17px 17px',
      }}
    >
      <div className="absolute inset-[40%] grid place-items-center rounded bg-warm-900 text-[8px] font-extrabold text-white">
        WeChat
      </div>
    </div>
  );
}

export default function EventAdminContactModal({ event, contact, onClose }: EventAdminContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);

  const submit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    setSubmitted(true);
  };

  const close = () => {
    setClosing(true);
    window.setTimeout(onClose, 170);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-y-auto bg-warm-900/72 px-3 py-3 backdrop-blur-sm sm:py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="mx-auto flex min-h-full items-center justify-center" style={{ maxWidth: 820 }}>
        <motion.section
          className="event-contact-modal relative max-h-[calc(100vh-22px)] w-full overflow-y-auto rounded-2xl border border-white/50 bg-white shadow-[0_30px_100px_-54px_rgba(0,0,0,0.82)]"
          style={{ maxWidth: 820 }}
          initial={{ opacity: 0, y: 18, scale: 0.965 }}
          animate={closing ? { opacity: 0, y: 10, scale: 0.975 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="relative overflow-hidden bg-[linear-gradient(135deg,#d22a31_0%,#b91f27_56%,#8f171e_100%)] px-5 py-4 text-white sm:px-6 sm:py-5">
            <img
              src="/images/event-admin-header-lineart.png"
              alt=""
              className="pointer-events-none absolute right-3 top-0 h-full w-[190px] object-contain opacity-25 mix-blend-multiply sm:right-7 sm:w-[280px]"
            />
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full border border-white/70 bg-white text-warm-900 transition-colors hover:bg-warm-100"
              aria-label="Close contact modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-[1]">
              <h2 className="mr-10 max-w-2xl font-display text-[clamp(1.25rem,2.6vw,1.75rem)] font-extrabold leading-tight tracking-tight">
                Contact the Event Volunteer Coordinator
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-semibold text-white/95 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {event.title}
                </span>
                <span className="inline-flex items-center gap-1.5 sm:border-l sm:border-white/45 sm:pl-3">
                  <Clock className="h-3 w-3" />
                  {formatDate(event.date)} - {event.time}
                </span>
                <span className="inline-flex items-center gap-1.5 sm:border-l sm:border-white/45 sm:pl-3">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
          </header>

          <div className="event-contact-modal__body bg-[#fffaf6]">
            <article className="event-contact-modal__card rounded-[14px] border border-[#eadfd9] bg-[linear-gradient(180deg,#fff_0%,#fffdfb_100%)] shadow-[0_14px_48px_-36px_rgba(51,35,26,0.55)]">
              <div className="mb-2.5 flex items-start gap-2.5">
                <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#45bb4a] text-white shadow-[0_8px_22px_-12px_rgba(69,187,74,0.7)]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="mt-0.5 font-display text-[17px] font-extrabold leading-tight text-warm-900">
                    Talk to the Coordinator on WeChat
                  </h3>
                  <div className="mt-1.5 h-[2px] w-5 rounded-full bg-primary-600" />
                </div>
              </div>
              <p className="mb-2.5 text-[13px] leading-relaxed text-warm-600 sm:ml-[42px]">
                Scan to contact the event admin on WeChat.
              </p>

              <div className="event-contact-modal__qr mx-auto mb-2.5 rounded-[9px] border border-[#ddd0c8] bg-white p-1.5">
                <div style={{ width: '100%', aspectRatio: '1 / 1' }}>
                  <QrDisplay src={contact.adminWechatQrUrl} alt={`${contact.adminName} WeChat QR code`} />
                </div>
              </div>

              <p className="text-center font-display text-lg font-extrabold leading-tight text-warm-900">{contact.adminName}</p>
              <p className="mt-1 text-center text-xs text-warm-500">{contact.adminRole}</p>

              <div className="mt-3 grid gap-2">
                <div className="event-contact-modal__note rounded-[10px] border border-[#f1e7df] bg-[#fffaf5] px-3 py-2 text-xs leading-relaxed text-warm-700">
                  <div className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <span>{contact.adminContactNote || 'When messaging, please mention this event name.'}</span>
                </div>
                <div className="event-contact-modal__note rounded-[10px] border border-[#f1e7df] bg-[#fffaf5] px-3 py-2 text-xs leading-relaxed text-warm-700">
                  <div className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-[#f4eadc] text-[#8a5d20]">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <span>Selected volunteers will be invited to the event group after confirmation.</span>
                </div>
              </div>
            </article>

            <article className="event-contact-modal__card rounded-[14px] border border-[#eadfd9] bg-[linear-gradient(160deg,#fffaf4_0%,#fffdfb_100%)] shadow-[0_14px_48px_-36px_rgba(51,35,26,0.55)]">
              <div className="mb-3 flex items-start gap-2.5">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[#f1e6d4] text-[#8a5d20]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-extrabold leading-snug text-warm-900">
                    Can't scan right now?<br />Leave a message
                  </h3>
                  <div className="mt-1.5 h-[2px] w-5 rounded-full bg-primary-600" />
                </div>
              </div>

              {submitted ? (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-sm leading-relaxed text-green-800">
                  Message captured for this event. The admin team will follow up using your contact details.
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-2.5">
                  <input
                    required
                    name="name"
                    placeholder="Name"
                    className="w-full rounded-lg border-[1.5px] border-[#dccfc6] bg-white px-3.5 py-2.5 text-sm text-warm-900 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10"
                  />
                  <input
                    required
                    name="contact"
                    placeholder="Email or WeChat ID"
                    className="w-full rounded-lg border-[1.5px] border-[#dccfc6] bg-white px-3.5 py-2.5 text-sm text-warm-900 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10"
                  />
                  <textarea
                    name="message"
                    placeholder="Message / Questions"
                    className="min-h-[78px] w-full resize-y rounded-lg border-[1.5px] border-[#dccfc6] bg-white px-3.5 py-2.5 text-sm text-warm-900 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10"
                  />

                  <p className="flex items-start gap-2 text-[11px] leading-relaxed text-warm-500">
                    <LockKeyhole className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    Your information is only used to contact you about this event.
                  </p>

                  <button
                    type="submit"
                    className="mt-1 w-full rounded-lg border-[1.5px] border-primary-600 bg-white px-5 py-2.5 text-sm font-extrabold text-primary-700 transition-colors hover:bg-primary-600 hover:text-white"
                  >
                    Send to admin
                  </button>
                </form>
              )}
            </article>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
