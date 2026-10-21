import type {
  AssignmentConflict,
  AssignmentConflictContext,
} from '@definition/assignment_conflicts';
import type { AssignmentHistoryType } from '@definition/schedules';
import {
  ASSIGNMENT_WORKLOAD,
  PART_DURATION_FALLBACKS,
} from '@constants/assignmentConflicts';

const isDuty = (key: string) => key.startsWith('HC_');
const meetingOf = (key: string) =>
  key.startsWith('HC_') ? key.slice(3, 6) : key.slice(0, 3);

// Stable source keys, never translated titles, identify where someone serves.
export const assignmentPartKey = (key: string): string | undefined => {
  if (key.includes('OpeningPrayer')) return 'opening_prayer';
  if (key.includes('ClosingPrayer')) return 'closing_prayer';
  if (key === 'MM_Chairman_A' || key === 'WM_Chairman') return 'chairman';
  if (key === 'MM_Chairman_B') return 'aux_counselor';
  if (key === 'MM_TGWTalk') return 'tgw_talk';
  if (key === 'MM_TGWGems') return 'tgw_gems';
  if (key.startsWith('MM_TGWBibleReading')) return 'tgw_bible_reading';
  const student = key.match(/^MM_AYFPart(\d)_/);
  if (student) return `ayf_part${student[1]}`;
  const living = key.match(/^MM_LCPart(\d)$/);
  if (living) return `lc_part${living[1]}`;
  if (key.startsWith('MM_LCCBS')) return 'lc_cbs';
  if (key.startsWith('WM_Speaker_Part')) return 'public_talk';
  if (key.startsWith('WM_WTStudy_')) return 'w_study';
  return undefined;
};

// Only source timings and the fixed Bible-reading duration are display values.
// Workload estimates for chairmen, prayers or duties are not part lengths.
export const assignmentPartDuration = (
  key: string,
  minutes: Record<string, number>
) => {
  const phase = assignmentPartKey(key);
  if (!phase) return undefined;
  const duration =
    minutes[phase] ??
    (phase === 'tgw_bible_reading'
      ? PART_DURATION_FALLBACKS[phase]
      : undefined);
  return duration && duration > 0 ? duration : undefined;
};

export const formatAssignmentConflict = (
  conflict: AssignmentConflict,
  durationLabel: (minutes: number) => string
) =>
  conflict.details
    .map((detail) =>
      detail.minutes
        ? `${detail.title} ${durationLabel(detail.minutes)}`
        : detail.title
    )
    .join(' · ');

const partLoad = (
  phase: string | undefined,
  context: AssignmentConflictContext
) =>
  phase
    ? (context.minutes[phase] ??
      PART_DURATION_FALLBACKS[phase] ??
      ASSIGNMENT_WORKLOAD.unknownPart)
    : ASSIGNMENT_WORKLOAD.unknownPart;

const assessesHeld = (
  held: AssignmentHistoryType['assignment'],
  context: AssignmentConflictContext
) => {
  const key = held.key ?? '';
  const targetCleaning = context.assignment.startsWith('HC_');
  const heldDuty = isDuty(key);
  const phase = assignmentPartKey(key);
  let penalty = heldDuty
    ? ASSIGNMENT_WORKLOAD.wholeMeeting
    : partLoad(phase, context);
  let blocked = false;

  if (targetCleaning) {
    // Cleaning follows the meeting. Workload matters, but a meeting part does
    // not happen at the same time. Two positions in that cleaning do overlap.
    blocked =
      key === context.assignment && held.schedule_id !== context.scheduleId;
  }
  if (blocked) penalty += ASSIGNMENT_WORKLOAD.overlap;
  return { penalty, blocked, isDuty: heldDuty };
};

// Shared by the cleaning picker and autofill so warnings and workload agree.
export const collectAssignmentConflicts = (
  context: AssignmentConflictContext
) => {
  const result = new Map<string, AssignmentConflict>();
  const titles = new Map<string, Set<string>>();
  const details = new Map<
    string,
    Map<string, AssignmentConflict['details'][number]>
  >();
  const counted = new Set<string>();
  const prefixes =
    context.assignment.startsWith('HC_') && context.wholeWeek
      ? ['MM_', 'WM_']
      : [meetingOf(context.assignment)];
  for (const { weekOf, assignment: held } of context.history) {
    const key = held.key ?? '';
    if (weekOf !== context.week || !held.person) continue;
    if (
      !prefixes.some((prefix) => key.startsWith(prefix)) &&
      key !== context.assignment
    )
      continue;
    if (
      held.dataView === context.dataView &&
      key === context.assignment &&
      held.schedule_id === context.scheduleId
    )
      continue;
    if (
      context.assignment === 'HC_Yearly_Dynamic' &&
      key !== context.assignment
    )
      continue;
    const assessment = assessesHeld(held, context);
    const previous = result.get(held.person);
    const personTitles = titles.get(held.person) ?? new Set<string>();
    if (held.title) personTitles.add(held.title);
    titles.set(held.person, personTitles);
    // Linked/duplicated history records of the same role must not inflate load.
    const identity = `${held.person}|${held.dataView}|${key}|${held.schedule_id ?? ''}`;
    const personDetails = details.get(held.person) ?? new Map();
    if (held.title)
      personDetails.set(identity, {
        title: held.title,
        minutes: isDuty(key)
          ? undefined
          : assignmentPartDuration(key, context.minutes),
      });
    details.set(held.person, personDetails);
    const penalty = counted.has(identity) ? 0 : assessment.penalty;
    counted.add(identity);
    result.set(held.person, {
      title: [...personTitles].join(' · '),
      details: [...personDetails.values()],
      isDuty: Boolean(previous?.isDuty || assessment.isDuty),
      blocked: Boolean(previous?.blocked || assessment.blocked),
      penalty: (previous?.penalty ?? 0) + penalty,
    });
  }
  return result;
};

export const assignmentConflictGroup = (conflict?: AssignmentConflict) =>
  !conflict ? 0 : conflict.isDuty ? 2 : 1;
