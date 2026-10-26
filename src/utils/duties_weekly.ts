import { HOSPITALITY_NOT_NEEDED } from '@constants/duties';
import type { AssignmentFieldType } from '@definition/assignment';
import type {
  AssignmentCongregation,
  DutyPositionsType,
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
  changes: Record<string, unknown>
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

/** A no-hospitality choice handles every host slot, independently per data view. */
export const dutiesHospitalityRecords = (
  positions: DutyPositionsType,
  position: keyof DutyPositionsType,
  value: string,
  dataView: string,
  updatedAt: string
): DutyPositionsType => {
  const next = structuredClone(positions);
  for (const key of Object.keys(next) as (keyof DutyPositionsType)[]) {
    const previous = next[key].find(
      (record) => record.type === dataView
    )?.value;
    if (
      value === HOSPITALITY_NOT_NEEDED ||
      previous === HOSPITALITY_NOT_NEEDED
    ) {
      next[key] = dutiesAssignRecords(
        next[key],
        value === HOSPITALITY_NOT_NEEDED ? HOSPITALITY_NOT_NEEDED : '',
        dataView,
        updatedAt
      );
    }
  }
  if (value !== HOSPITALITY_NOT_NEEDED) {
    next[position] = dutiesAssignRecords(
      next[position],
      value,
      dataView,
      updatedAt
    );
  }
  return next;
};
