import { formatDate } from '@utils/date';
import { updateHallCleaningGroupEntry } from '@utils/hall_cleaning_groups';
import { getAssignmentConflicts } from '@services/app/assignment_conflicts';
import { runHallCleaningUpdate } from '@services/app/hall_cleaning_queue';
import {
  addHallCleaningLoad,
  compareHallCleaningLoad,
  hallCleaningActiveAssignees,
  hallCleaningGroupLoad,
  resolveHallCleaningConfig,
  mergeHallCleaningWeeks,
} from '@utils/hall_cleaning';
import type {
  HallCleaningConfig,
  HallCleaningLoad,
} from '@definition/hall_cleaning';
import { AssignmentCode } from '@definition/assignment';
import {
  AssignmentCongregation,
  AssignmentHistoryType,
  SchedWeekType,
} from '@definition/schedules';
import { dbHallCleaningWeeksUpdate } from '@services/dexie/hall_cleaning';
import {
  fieldGroupsState,
  fieldServiceGroupsState,
} from '@states/field_service_groups';
import { store } from '@states/index';
import { personsActiveState } from '@states/persons';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import {
  hallCleaningState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { getEligiblePersonsPerDataViewAndCode } from './assignments_with_stats';
import { isPersonBlockedOnDate } from './persons';
import {
  HALL_CLEANING_CONGREGATION_PREFIX,
  type CleaningFieldDefinitionType,
  HallCleaningSlotType,
  schedulesBuildHistoryList,
  schedulesCleaningPersonAllowed,
  schedulesCleaningMeetingHeld,
  schedulesResolveMeetingDate,
  schedulesHallCleaningGroups,
  schedulesHallCleaningGroupName,
  schedulesHallCleaningMode,
  schedulesHallCleaningPersons,
  schedulesHallCleaningSlots,
} from './schedules';

// the meeting a cleaning follows, for clashes and time away
const slotMeetings = (
  slot: HallCleaningSlotType,
  wholeWeek: boolean
): ('midweek' | 'weekend')[] => {
  if (slot === 'yearly') return [];
  if (slot === 'weekend') return ['weekend'];

  return wholeWeek ? ['midweek', 'weekend'] : ['midweek'];
};

export const hallCleaningStartAutofill = async (start: string, end: string) => {
  const requestedView = store.get(userDataViewState);
  return runHallCleaningUpdate(async () => {
    if (store.get(userDataViewState) !== requestedView)
      throw new Error('error_app_generic-desc');
    const config = store.get(hallCleaningState);

    if (!config) return 0;

    const dataView = store.get(userDataViewState);
    const persons = store.get(personsActiveState);
    const personsById = new Map(
      persons.map((person) => [person.person_uid, person])
    );
    const groups = store.get(fieldGroupsState);
    const history = store.get(assignmentsHistoryState);
    const schedules = store.get(schedulesState);

    const languageGroups = store
      .get(fieldServiceGroupsState)
      .filter(
        (group) => group.group_data.language_group && !group.group_data._deleted
      );

    const eligibility =
      getEligiblePersonsPerDataViewAndCode(persons, languageGroups).get(
        dataView
      ) ?? new Map<AssignmentCode, Set<string>>();

    const personLoad: HallCleaningLoad = new Map();
    const historyByWeek = new Map<string, AssignmentHistoryType[]>();

    for (const entry of history) {
      const weekEntries = historyByWeek.get(entry.weekOf) ?? [];
      weekEntries.push(entry);
      historyByWeek.set(entry.weekOf, weekEntries);
      const { key, person } = entry.assignment;

      if (!key?.startsWith('HC_') || entry.assignment.dataView !== dataView) {
        continue;
      }

      if (person) addHallCleaningLoad(personLoad, person, entry.weekOf);
    }

    const knownGroups = new Set(groups.map((group) => group.group_id));

    const groupLoad = hallCleaningGroupLoad(
      schedules.map((schedule) => ({
        weekOf: schedule.weekOf,
        groups: schedulesHallCleaningSlots(config, schedule)
          .filter((slot) => slot !== 'yearly')
          .flatMap((slot) =>
            schedulesHallCleaningGroups(schedule, slot, config).map(
              (group) => group.value
            )
          )
          .filter((group) => knownGroups.has(group)),
      }))
    );

    const weeks = schedules
      .filter((schedule) => schedule.weekOf >= start && schedule.weekOf <= end)
      .sort((a, b) => a.weekOf.localeCompare(b.weekOf));

    const modified: SchedWeekType[] = [];

    const fillGroups = (
      week: SchedWeekType,
      slot: HallCleaningSlotType,
      weekConfig: HallCleaningConfig,
      slots: HallCleaningSlotType[],
      groupPool: string[]
    ) => {
      const cleaning = week.hall_cleaning;
      if (!cleaning) return false;
      let changed = false;
      let selectedGroups = schedulesHallCleaningGroups(week, slot, weekConfig);
      for (let index = 0; index < selectedGroups.length; index++) {
        if (selectedGroups[index].value || groupPool.length === 0) continue;
        const usedGroups = new Set(
          selectedGroups.map((group) => group.value).filter(Boolean)
        );
        const weekGroups = slots
          .filter((other) => other !== slot)
          .flatMap((other) =>
            schedulesHallCleaningGroups(week, other, weekConfig).map(
              (group) => group.value
            )
          );
        const weekGroup = weekGroups.find(
          (id) => knownGroups.has(id) && !usedGroups.has(id)
        );
        const pick =
          weekGroup ??
          [...groupPool]
            .filter((id) => !usedGroups.has(id))
            .sort(compareHallCleaningLoad(groupLoad))[0];
        if (!pick) continue;
        const entries = updateHallCleaningGroupEntry(
          cleaning[slot].group ?? [],
          {
            type: dataView,
            value: pick,
            name: schedulesHallCleaningGroupName(pick),
            updatedAt: new Date().toISOString(),
          },
          index + 1
        );
        cleaning[slot] = { ...cleaning[slot], group: entries };
        if (!weekGroups.includes(pick))
          addHallCleaningLoad(groupLoad, pick, week.weekOf);
        selectedGroups = schedulesHallCleaningGroups(week, slot, weekConfig);
        changed = true;
      }
      return changed;
    };

    const fillPublishers = (
      week: SchedWeekType,
      slot: HallCleaningSlotType,
      weekConfig: HallCleaningConfig
    ) => {
      const cleaning = week.hall_cleaning;
      if (!cleaning || slot === 'yearly') return false;
      const mode = schedulesHallCleaningMode(weekConfig);
      const wholeWeek = weekConfig.period.value === 'week';
      let changed = false;
      const groupIds = schedulesHallCleaningGroups(week, slot, weekConfig)
        .map((group) => group.value)
        .filter(Boolean);
      // A neighbouring congregation names its own people.
      if (
        groupIds.some((group) =>
          group.startsWith(HALL_CLEANING_CONGREGATION_PREFIX)
        )
      )
        return false;
      if (
        mode === 'group_persons' &&
        !groupIds.some((id) => knownGroups.has(id))
      )
        return false;
      const fields = schedulesHallCleaningPersons(slot, weekConfig);
      if (fields.length === 0) return false;
      const groupMembers = groups
        .filter((record) => groupIds.includes(record.group_id))
        .flatMap((record) => record.group_data.members);
      const members = groupIds.length
        ? new Set(groupMembers.map((member) => member.person_uid))
        : undefined;

      const meetings = slotMeetings(slot, wholeWeek).filter((meeting) =>
        schedulesCleaningMeetingHeld(week, meeting, dataView, false)
      );

      const meetingDates = meetings.map((meeting) =>
        formatDate(
          schedulesResolveMeetingDate({
            settings: store.get(settingsState),
            schedule: week,
            meeting,
            dataView,
          }),
          'yyyy/MM/dd'
        )
      );

      const entries: AssignmentCongregation[] = [
        ...(cleaning[slot].persons ?? []),
      ];

      const used = hallCleaningActiveAssignees(
        entries,
        fields.map((field) => field.schedule_id ?? ''),
        dataView
      );

      const fillField = (field: CleaningFieldDefinitionType) => {
        const current = entries.find(
          (entry) => entry.type === dataView && entry.id === field.schedule_id
        );

        if (current?.value) return false;

        const pool = [...(eligibility.get(field.type) ?? [])].filter((uid) => {
          if ((members && !members.has(uid)) || used.has(uid)) return false;

          const person = personsById.get(uid);

          if (!person || !schedulesCleaningPersonAllowed(person, field.type)) {
            return false;
          }

          return !meetingDates.some(
            (date) => date && isPersonBlockedOnDate(person, date)
          );
        });

        if (pool.length === 0) return false;

        // the group overseer, else the assistant, leads, as when a group is
        // picked by hand; nobody with a part in that meeting comes first
        const leads =
          field.schedule_id === '1'
            ? [
                groupMembers.find((member) => member.isOverseer)?.person_uid,
                groupMembers.find((member) => member.isAssistant)?.person_uid,
              ]
            : [];

        const leadRank = (uid: string) => {
          const index = leads.indexOf(uid);
          return index === -1 ? leads.length : index;
        };

        const compareLoad = compareHallCleaningLoad(personLoad);
        const conflicts = getAssignmentConflicts({
          history: historyByWeek.get(week.weekOf) ?? [],
          week: week.weekOf,
          dataView,
          assignment: field.assignment,
          code: field.type,
          scheduleId: field.schedule_id,
          wholeWeek,
          schedule: week,
        });

        pool.sort((a, b) => {
          const workload =
            (conflicts.get(a)?.penalty ?? 0) - (conflicts.get(b)?.penalty ?? 0);
          if (workload !== 0) return workload;

          const leadDiff = leadRank(a) - leadRank(b);
          if (leadDiff !== 0) return leadDiff;

          return compareLoad(a, b);
        });

        const pick = pool[0];
        const updatedAt = new Date().toISOString();

        if (current) {
          current.value = pick;
          current.updatedAt = updatedAt;
        } else {
          entries.push({
            id: field.schedule_id,
            type: dataView,
            name: '',
            value: pick,
            updatedAt,
          });
        }

        used.add(pick);
        addHallCleaningLoad(personLoad, pick, week.weekOf);
        return true;
      };
      for (const field of fields) {
        if (fillField(field)) changed = true;
      }

      cleaning[slot] = { ...cleaning[slot], persons: entries };
      return changed;
    };

    for (const schedule of weeks) {
      const weekConfig = resolveHallCleaningConfig(schedule, config);
      const turnGroups = weekConfig.rotation_groups?.value ?? [];
      const groupPool = groups
        .filter(
          (group) =>
            turnGroups.length === 0 || turnGroups.includes(group.group_id)
        )
        .map((group) => group.group_id);
      const week = structuredClone(schedule);

      week.hall_cleaning = {
        midweek: {},
        weekend: {},
        yearly: {},
        ...week.hall_cleaning,
      };

      let changed = false;

      // Major cleanings are planned manually, including legacy dated events.
      const slots: HallCleaningSlotType[] = schedulesHallCleaningSlots(
        config,
        schedule
      ).filter((slot) => slot !== 'yearly');

      for (const slot of slots) {
        if (fillGroups(week, slot, weekConfig, slots, groupPool))
          changed = true;
        if (fillPublishers(week, slot, weekConfig)) changed = true;
      }

      if (changed) modified.push(week);
    }

    if (modified.length === 0) return 0;

    const saved = await dbHallCleaningWeeksUpdate(modified);

    store.set(schedulesState, (current) =>
      mergeHallCleaningWeeks(current, saved)
    );

    store.set(assignmentsHistoryState, schedulesBuildHistoryList());

    return modified.length;
  });
};
