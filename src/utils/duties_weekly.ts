import type { AssignmentFieldType } from '@definition/assignment';
import type {
  AssignmentCongregation,
  SchedWeekType,
} from '@definition/schedules';

export const dutyAssignmentForMeeting = (
  assignment: AssignmentFieldType,
  meeting: 'midweek' | 'weekend'
): AssignmentFieldType =>
  `${meeting === 'midweek' ? 'MM' : 'WM'}${assignment.slice(2)}` as AssignmentFieldType;

export const dutiesAssignRecords = (
  records: AssignmentCongregation[],
  value: string,
  dataView: string,
  updatedAt: string,
  id?: string
): AssignmentCongregation[] => {
  const next = structuredClone(records);
  const entry = next.find(
    (record) => record.type === dataView && (!id || record.id === id)
  );
  if (entry) {
    entry.value = value;
    entry.updatedAt = updatedAt;
    entry.name = '';
  } else {
    next.push({
      type: dataView,
      value,
      updatedAt,
      name: '',
      ...(id ? { id } : {}),
    });
  }
  return next;
};

/** Apply only the saved paths, retaining concurrent edits to other duties. */
export const dutiesPatchSchedule = (
  schedule: SchedWeekType,
  changes: Record<string, AssignmentCongregation[]>
): SchedWeekType => {
  const next = structuredClone(schedule);
  for (const [path, value] of Object.entries(changes)) {
    const parts = path.split('.');
    let target = next as unknown as Record<string, unknown>;
    for (const part of parts.slice(0, -1)) {
      target = target[part] as Record<string, unknown>;
    }
    target[parts.at(-1)!] = value;
  }
  return next;
};
