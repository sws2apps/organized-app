import { HOSPITALITY_NOT_NEEDED } from '@constants/duties';
import type { AssignmentFieldType } from '@definition/assignment';
import type {
  AssignmentCongregation,
  DutiesMeetingType,
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

const hostAssigned = (positions: DutyPositionsType, dataView: string) =>
  Object.values(positions).some((records) =>
    records.some((record) => record.type === dataView && record.value)
  );

/** A week marked as not needing Hospitality has no host in the view. */
export const dutiesHospitalityNotNeeded = (
  duties: Pick<DutiesMeetingType, 'hospitality' | 'hospitality_not_needed'>,
  dataView: string
) =>
  Boolean(
    duties.hospitality_not_needed?.find((record) => record.type === dataView)
      ?.value
  ) && !hostAssigned(duties.hospitality, dataView);

/** A no-hospitality choice clears every host slot, independently per data view. */
export const dutiesHospitalityRecords = (
  duties: Pick<DutiesMeetingType, 'hospitality' | 'hospitality_not_needed'>,
  position: keyof DutyPositionsType,
  value: string,
  dataView: string,
  updatedAt: string
) => {
  const notNeeded = value === HOSPITALITY_NOT_NEEDED;
  const positions = structuredClone(duties.hospitality);
  for (const key of Object.keys(positions) as (keyof DutyPositionsType)[]) {
    if (notNeeded || key === position) {
      positions[key] = dutiesAssignRecords(
        positions[key],
        notNeeded ? '' : value,
        dataView,
        updatedAt
      );
    }
  }
  const flags = duties.hospitality_not_needed ?? [];
  const flagged = flags.some(
    (record) => record.type === dataView && record.value
  );
  if (!notNeeded && !flagged) return { positions };
  return {
    positions,
    flags: [
      ...flags.filter((record) => record.type !== dataView),
      { type: dataView, value: notNeeded, updatedAt },
    ],
  };
};
