import { AssignmentCode } from '@definition/assignment';
import { PersonType } from '@definition/person';
import {
  AssignmentHistoryType,
  DutiesGender,
  DutiesSectionType,
  SchedWeekType,
} from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { fieldServiceGroupsState } from '@states/field_service_groups';
import { store } from '@states/index';
import { personsActiveState } from '@states/persons';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { settingsState, userDataViewState } from '@states/settings';
import { formatDate } from '@utils/date';
import { getActualLoad, getDistanceInWeeks } from './assignment_selection';
import { getEligiblePersonsPerDataViewAndCode } from './assignments_with_stats';
import { dutiesSectionsShareTime, dutiesSourceId } from './duties';
import { isPersonBlockedOnDate } from './persons';
import {
  DutyFieldDefinitionType,
  MeetingDutiesConfigType,
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
  schedulesDutiesConfig,
  schedulesDutiesFieldList,
  schedulesDutiesGetFieldValue,
  schedulesDutiesMeetingHeld,
  schedulesDutiesSections,
  schedulesDutyAllowedForPerson,
  schedulesDutyRequiredCodes,
  schedulesIsDutyCode,
  schedulesResolveMeetingDate,
} from './schedules';

type DutiesMeeting = 'midweek' | 'weekend';

type DutyTask = {
  schedule: SchedWeekType;
  meeting: DutiesMeeting;
  field: DutyFieldDefinitionType;
  fields: DutyFieldDefinitionType[];
  sections: DutiesSectionType[];
  targetDate: string;
  order: number;
  paired?: DutyTask;
};

type DutyCandidateMeta = {
  dutiesThisWeek: number;
  dutiesPriority: number;
  codePriority: number;
  codeDistance: number;
  tieBreak: number;
};

type DutiesAutofillContext = {
  persons: PersonType[];
  dataView: string;
  eligibleByCode: Map<AssignmentCode, Set<string>>;
  sistersDuties: boolean;
  conflictPrevent: boolean;
  dutyHistory: AssignmentHistoryType[];
  otherHistoryByWeek: Map<string, AssignmentHistoryType[]>;
  expectedByCode: Map<AssignmentCode, number>;
};

const DUTY_CODES = Object.values(AssignmentCode).filter(
  (code): code is AssignmentCode =>
    typeof code === 'number' && schedulesIsDutyCode(code)
);

/**
 * The codes whose history counts towards a duty. The combined audio/video duty
 * takes a brother from both audio and video, so it counts towards each of
 * them, and each of them towards it.
 */
const dutyLoadCodes = (code: AssignmentCode): AssignmentCode[] => {
  if (code === AssignmentCode.DUTIES_AudioVideo) {
    return [
      AssignmentCode.DUTIES_Audio,
      AssignmentCode.DUTIES_Video,
      AssignmentCode.DUTIES_AudioVideo,
    ];
  }

  if (
    code === AssignmentCode.DUTIES_Audio ||
    code === AssignmentCode.DUTIES_Video
  ) {
    return [code, AssignmentCode.DUTIES_AudioVideo];
  }

  return [code];
};

/**
 * A stable pseudo-random order, so equally ranked persons are not always
 * picked in the order of the persons list.
 */
const hashOf = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index++) {
    hash ^= value.codePointAt(index) ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

/**
 * How far a person is below their expected share, as the ratio the meeting
 * assignments engine scores tiers with. Duties come up too rarely for its
 * rounded tiers, which would tie most persons, so the ratio is kept exact.
 */
const loadPriority = (expectedLoad: number, actualLoad: number) => {
  if (expectedLoad === 0) return 0;
  if (actualLoad === 0) return Infinity;

  return expectedLoad / actualLoad;
};

/**
 * The weeks in the range with at least one meeting that holds duties.
 */
const dutiesWeeksList = (start: string, end: string) =>
  store
    .get(schedulesState)
    .filter(
      (schedule) =>
        schedule.weekOf >= start &&
        schedule.weekOf <= end &&
        (schedulesDutiesMeetingHeld(schedule, 'midweek') ||
          schedulesDutiesMeetingHeld(schedule, 'weekend'))
    );

/**
 * Every duty field of the weeks, with the empty ones returned as tasks and
 * all of them counted, so the expected load reflects the whole schedule.
 */
const buildDutyTasks = ({
  weeks,
  config,
  settings,
  dataView,
}: {
  weeks: SchedWeekType[];
  config: MeetingDutiesConfigType;
  settings: SettingsType;
  dataView: string;
}) => {
  const tasks: DutyTask[] = [];
  const slotsByCode = new Map<AssignmentCode, number>();

  for (const schedule of weeks) {
    if (!schedule.duties) continue;

    const heldMeetings = (['midweek', 'weekend'] as const).filter((meeting) =>
      schedulesDutiesMeetingHeld(schedule, meeting)
    );
    const meetings = config.schedule_weekly?.value
      ? heldMeetings.slice(0, 1)
      : heldMeetings;
    for (const meeting of meetings) {
      const sections = schedulesDutiesSections(schedule.weekOf, meeting);
      const fields = schedulesDutiesFieldList(meeting, config, sections);

      const targetDate = formatDate(
        schedulesResolveMeetingDate({ settings, schedule, meeting, dataView }),
        'yyyy/MM/dd'
      );

      fields.forEach((field, order) => {
        const pairedMeeting = config.schedule_weekly?.value
          ? heldMeetings.find((item) => item !== meeting)
          : undefined;
        const pairedFields = pairedMeeting
          ? schedulesDutiesFieldList(pairedMeeting, config)
          : [];
        const pairedField = pairedFields[order];
        slotsByCode.set(
          field.type,
          (slotsByCode.get(field.type) ?? 0) + (pairedField ? 2 : 1)
        );

        if (
          schedulesDutiesGetFieldValue(schedule, field, dataView).length > 0 ||
          (pairedField &&
            schedulesDutiesGetFieldValue(schedule, pairedField, dataView)
              .length > 0)
        ) {
          return;
        }

        tasks.push({
          schedule,
          meeting,
          field,
          fields,
          sections,
          targetDate,
          order,
          paired:
            pairedMeeting && pairedField
              ? {
                  schedule,
                  meeting: pairedMeeting,
                  field: pairedField,
                  fields: pairedFields,
                  sections: [],
                  order,
                  targetDate: formatDate(
                    schedulesResolveMeetingDate({
                      settings,
                      schedule,
                      meeting: pairedMeeting,
                      dataView,
                    }),
                    'yyyy/MM/dd'
                  ),
                }
              : undefined,
        });
      });
    }
  }

  return { tasks, slotsByCode };
};

const eligibleUIDs = (
  eligibility: Map<AssignmentCode, Set<string>>,
  code: AssignmentCode
) => {
  const [first, ...rest] = schedulesDutyRequiredCodes(code).map(
    (required) => eligibility.get(required) ?? new Set<string>()
  );

  if (!first) return new Set<string>();

  return new Set([...first].filter((uid) => rest.every((set) => set.has(uid))));
};

/**
 * Two fields a person cannot hold at once: the positions of one duty stand
 * next to each other, while sections are shifts that only meet where they
 * share a part, and two custom duties are separate duties.
 */
const servedTogether = (
  task: DutyTask,
  first: DutyFieldDefinitionType,
  second: DutyFieldDefinitionType
) => {
  if (first.type !== second.type) return false;

  if (!first.schedule_id || !second.schedule_id) return true;

  const sectionOf = (scheduleId: string) =>
    task.sections.find((record) => record.id === dutiesSourceId(scheduleId));

  const firstSection = sectionOf(first.schedule_id);
  const secondSection = sectionOf(second.schedule_id);

  if (firstSection && secondSection) {
    return dutiesSectionsShareTime(firstSection, secondSection);
  }

  return (
    dutiesSourceId(first.schedule_id) === dutiesSourceId(second.schedule_id)
  );
};

const isServingAtTheTime = (
  task: DutyTask,
  person: PersonType,
  dataView: string
) =>
  task.fields.some(
    (field) =>
      field !== task.field &&
      servedTogether(task, field, task.field) &&
      schedulesDutiesGetFieldValue(task.schedule, field, dataView) ===
        person.person_uid
  );

/**
 * A meeting part or duty in another group's schedule of the same meeting
 * leaves the person unavailable, as the meeting assignments engine does.
 */
const servesInAnotherView = (
  task: DutyTask,
  person: PersonType,
  context: DutiesAutofillContext
) => {
  const { weekOf } = task.schedule;
  const prefix = task.meeting === 'midweek' ? 'MM_' : 'WM_';

  const isOtherViewEntry = (entry: AssignmentHistoryType) =>
    entry.weekOf === weekOf &&
    entry.assignment.person === person.person_uid &&
    entry.assignment.dataView !== context.dataView &&
    (entry.assignment.key ?? '').startsWith(prefix);

  return (
    (context.otherHistoryByWeek.get(weekOf) ?? []).some(isOtherViewEntry) ||
    context.dutyHistory.some(isOtherViewEntry)
  );
};

/**
 * Whether the person already has a part in the schedule of this meeting,
 * which conflict prevention avoids.
 */
const hasPartInMeeting = (
  task: DutyTask,
  person: PersonType,
  context: DutiesAutofillContext
) => {
  const meetings = task.paired
    ? [task.meeting, task.paired.meeting]
    : [task.meeting];
  return (context.otherHistoryByWeek.get(task.schedule.weekOf) ?? []).some(
    (entry) =>
      entry.assignment.person === person.person_uid &&
      entry.assignment.dataView === context.dataView &&
      meetings.some((meeting) =>
        (entry.assignment.key ?? '').startsWith(
          meeting === 'midweek' ? 'MM_' : 'WM_'
        )
      )
  );
};

const validCandidates = (task: DutyTask, context: DutiesAutofillContext) => {
  const allowed = context.eligibleByCode.get(task.field.type);

  return context.persons.filter(
    (person) =>
      allowed?.has(person.person_uid) &&
      schedulesDutyAllowedForPerson(
        person,
        task.field.type,
        context.sistersDuties
      ) &&
      (task.paired ? [task, task.paired] : [task]).every(
        (target) =>
          !isPersonBlockedOnDate(person, target.targetDate) &&
          !isServingAtTheTime(target, person, context.dataView) &&
          !servesInAnotherView(target, person, context)
      )
  );
};

const candidateMeta = (
  person: PersonType,
  task: DutyTask,
  context: DutiesAutofillContext
): DutyCandidateMeta => {
  const uid = person.person_uid;
  const { weekOf } = task.schedule;
  const code = task.field.type;
  const loadCodes = dutyLoadCodes(code);

  const dutiesThisWeek = context.dutyHistory.filter(
    (entry) =>
      entry.weekOf === weekOf &&
      entry.assignment.person === uid &&
      entry.assignment.dataView === context.dataView
  ).length;

  const expectedTotal = DUTY_CODES.reduce(
    (total, dutyCode) =>
      context.eligibleByCode.get(dutyCode)?.has(uid)
        ? total + (context.expectedByCode.get(dutyCode) ?? 0)
        : total,
    0
  );

  const dutiesPriority = loadPriority(
    expectedTotal,
    getActualLoad(uid, context.dutyHistory, weekOf, context.dataView)
  );

  const codePriority = loadPriority(
    context.expectedByCode.get(code) ?? 0,
    getActualLoad(uid, context.dutyHistory, weekOf, context.dataView, loadCodes)
  );

  const distance = getDistanceInWeeks(
    context.dutyHistory,
    uid,
    weekOf,
    context.dataView,
    loadCodes
  );

  return {
    dutiesThisWeek,
    dutiesPriority,
    codePriority,
    codeDistance: Math.min(Math.abs(distance.minPast), distance.minFuture),
    tieBreak: hashOf(
      `${uid}|${weekOf}|${task.field.assignment}|${task.field.schedule_id ?? ''}`
    ),
  };
};

const compareCandidates = (a: DutyCandidateMeta, b: DutyCandidateMeta) => {
  if (a.dutiesThisWeek !== b.dutiesThisWeek) {
    return a.dutiesThisWeek - b.dutiesThisWeek;
  }

  if (a.codePriority !== b.codePriority) {
    return b.codePriority > a.codePriority ? 1 : -1;
  }

  if (a.dutiesPriority !== b.dutiesPriority) {
    return b.dutiesPriority > a.dutiesPriority ? 1 : -1;
  }

  if (a.codeDistance !== b.codeDistance) {
    return b.codeDistance - a.codeDistance;
  }

  return a.tieBreak - b.tieBreak;
};

/**
 * The best person for a task. Brothers come before sisters, and with conflict
 * prevention on, candidates with a meeting part remain ineligible. An empty
 * field is preferable to silently creating a conflict.
 */
const selectDutyPerson = (task: DutyTask, context: DutiesAutofillContext) => {
  const candidates = validCandidates(task, context);

  const rounds: { gender: DutiesGender; freeOnly: boolean }[] = [
    { gender: 'male', freeOnly: context.conflictPrevent },
    { gender: 'female', freeOnly: context.conflictPrevent },
  ];

  for (const round of rounds) {
    const pool = candidates.filter(
      (person) =>
        person.person_data.male.value === (round.gender === 'male') &&
        (!round.freeOnly || !hasPartInMeeting(task, person, context))
    );

    if (pool.length === 0) continue;

    const ranked = pool
      .map((person) => ({ person, meta: candidateMeta(person, task, context) }))
      .sort((a, b) => compareCandidates(a.meta, b.meta));

    return ranked[0].person;
  }
};

/**
 * Fills the empty duties of the weeks with the fairness model of the meeting
 * assignments engine: weeks in order, the scarcest duties of a week first, and
 * each duty given to the person furthest below their expected share.
 */
const autofillDutyTasks = (
  tasks: DutyTask[],
  context: DutiesAutofillContext
) => {
  const weekOfs = [...new Set(tasks.map((task) => task.schedule.weekOf))].sort(
    (a, b) => a.localeCompare(b)
  );

  for (const weekOf of weekOfs) {
    const weekTasks = tasks
      .filter((task) => task.schedule.weekOf === weekOf)
      .map((task) => ({
        task,
        scarcity: validCandidates(task, context).length,
      }))
      .sort((a, b) => {
        if (a.scarcity !== b.scarcity) return a.scarcity - b.scarcity;

        if (a.task.meeting !== b.task.meeting) {
          return a.task.meeting === 'midweek' ? -1 : 1;
        }

        return a.task.order - b.task.order;
      });

    for (const { task } of weekTasks) {
      const selected = selectDutyPerson(task, context);

      if (!selected) continue;

      for (const target of task.paired ? [task, task.paired] : [task]) {
        schedulesAutofillSaveAssignment({
          schedule: target.schedule,
          assignment: target.field.assignment,
          value: selected,
          history: context.dutyHistory,
          schedule_id: target.field.schedule_id,
        });
      }
    }
  }
};

/**
 * Autofills the duties of the weeks in the range.
 *
 * @returns the number of weeks processed
 */
export const dutiesStartAutofill = async (start: string, end: string) => {
  const config = schedulesDutiesConfig();

  if (!config) return 0;

  const weeks = structuredClone(dutiesWeeksList(start, end));

  if (weeks.length === 0) return 0;

  const settings = store.get(settingsState);
  const dataView = store.get(userDataViewState);
  const persons = store.get(personsActiveState);

  const languageGroups = store
    .get(fieldServiceGroupsState)
    .filter(
      (group) => group.group_data.language_group && !group.group_data._deleted
    );

  const eligibility =
    getEligiblePersonsPerDataViewAndCode(persons, languageGroups).get(
      dataView
    ) ?? new Map<AssignmentCode, Set<string>>();

  const history = structuredClone(store.get(assignmentsHistoryState));

  const { tasks, slotsByCode } = buildDutyTasks({
    weeks,
    config,
    settings,
    dataView,
  });

  const eligibleByCode = new Map(
    DUTY_CODES.map((code) => [code, eligibleUIDs(eligibility, code)])
  );

  // the weekly slots of a duty shared among everyone qualified for it
  const expectedByCode = new Map<AssignmentCode, number>();

  for (const [code, slots] of slotsByCode) {
    const eligibleCount = eligibleByCode.get(code)?.size ?? 0;

    if (eligibleCount > 0) {
      expectedByCode.set(code, slots / weeks.length / eligibleCount);
    }
  }

  const otherHistoryByWeek = new Map<string, AssignmentHistoryType[]>();

  for (const entry of history) {
    if (schedulesIsDutyCode(entry.assignment.code)) continue;

    const entries = otherHistoryByWeek.get(entry.weekOf) ?? [];
    entries.push(entry);
    otherHistoryByWeek.set(entry.weekOf, entries);
  }

  autofillDutyTasks(tasks, {
    persons,
    dataView,
    eligibleByCode,
    sistersDuties: config.sisters_duties?.value ?? false,
    conflictPrevent: config.conflict_prevent.value,
    dutyHistory: history.filter((entry) =>
      schedulesIsDutyCode(entry.assignment.code)
    ),
    otherHistoryByWeek,
    expectedByCode,
  });

  await dbSchedBulkUpdate(weeks);

  const updatedWeeks = new Map(weeks.map((week) => [week.weekOf, week]));

  store.set(
    schedulesState,
    store
      .get(schedulesState)
      .map((schedule) => updatedWeeks.get(schedule.weekOf) ?? schedule)
  );

  store.set(assignmentsHistoryState, schedulesBuildHistoryList());

  return weeks.length;
};
