import type { Territory, TerritoryAssignment } from '@definition/territory';

// dd.mm.yyyy, as stored; kept here so the notes have no app imports
const dayOf = (value?: string) => {
  const [day, month, year] = (value ?? '').split('.').map(Number);
  if (!day || !month || !year) return 0;

  return new Date(year, month - 1, day).getTime();
};

// the newest return that came with a note: what the last publisher found
export const latestReturnNote = (assignments: TerritoryAssignment[]) =>
  [...assignments]
    .filter((item) => item.returnedOn && item.note?.trim())
    .sort((a, b) => dayOf(b.returnedOn) - dayOf(a.returnedOn))
    .at(0);

// a note on one line, for a list row
export const noteLine = (note: string) =>
  note
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' · ');

// an assignment's finding joins the standing notes, a blank line apart
export const appendNote = (notes: string | undefined, note: string) => {
  const existing = notes?.trim() ?? '';
  const added = note.trim();
  if (!added || `\n\n${existing}\n\n`.includes(`\n\n${added}\n\n`))
    return existing;
  return [existing, added].filter(Boolean).join('\n\n');
};

export const hasNewNote = (territory: Territory) =>
  !!territory.reviewNeeded && !!latestReturnNote(territory.assignments);

// Omitted means unchanged; an explicitly blank input clears the assignment note.
export const assignmentNoteUpdate = (note?: string) =>
  note === undefined ? {} : { note: note.trim() || undefined };

export const currentAssignmentNote = (territory: Territory) =>
  territory.assignments.find(
    (item) => !item.returnedOn && item.publisher === territory.holder
  )?.note;
