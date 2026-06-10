/**
 * Minimal iCalendar (.ics) helpers for exporting a single event so it can be
 * imported into the user's installed calendar app.
 */

const pad = (value: number) => String(value).padStart(2, '0');

/** Format a Date as an iCalendar UTC timestamp (YYYYMMDDTHHMMSSZ). */
const toICSDate = (date: Date): string =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
    date.getUTCSeconds()
  )}Z`;

/** Escape text per RFC 5545 (commas, semicolons, backslashes, newlines). */
const escapeICSText = (value: string): string =>
  (value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

export type CalendarEventInput = {
  uid: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  summary: string;
  description?: string;
  location?: string;
};

/** Build a VCALENDAR string containing a single VEVENT. */
export const buildCalendarEvent = (event: CalendarEventInput): string => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const stamp = toICSDate(start);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Organized//Field Service Meetings//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.uid}@organized-app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICSText(event.summary)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  }
  if (event.location) {
    lines.push(`LOCATION:${escapeICSText(event.location)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
};

/** Trigger a download of the given iCalendar content. */
export const downloadCalendarEvent = (
  content: string,
  filename = 'meeting.ics'
): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
