// services/app/autofill_new.ts
import { ASSIGNMENT_PATH, STUDENT_ASSIGNMENT } from '@constants/index';
import { ASSIGNMENT_DEFAULTS } from '@constants/index';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import { SchedWeekType } from '@definition/schedules';
import { SourceWeekType } from '@definition/sources';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
} from './schedules';
import { AssignmentFieldType } from '@definition/assignment';
import { AssignmentHistoryType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  getCorrespondingStudentOrAssistant,
  sortCandidatesMultiLevel,
} from './assignment_selection';
import { getEligiblePersonsPerDataViewAndCode } from './assignments_with_stats';
import { store } from '@states/index';
import { getAssignmentsWithStats } from './assignments_with_stats';
import { sourcesState } from '@states/sources';
import { personsByViewState } from '@states/persons';
import {
  assignmentsHistoryState,
  isPublicTalkCoordinatorState,
} from '@states/schedules';
import { settingsState, userDataViewState } from '@states/settings';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { exportScheduleToCSV } from './assignments_schedule_export';
import { schedulesState } from '@states/schedules';
import { SettingsType } from '@definition/settings';
import { Week } from '@definition/week_type';
import { hasAssignmentConflict } from './assignment_selection';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from './sources';
import { JWLangState, JWLangLocaleState } from '@states/settings';
import { personIsElder } from './persons';
import { midweekMeetingClassCountState } from '@states/settings';
import { buildEligibilityCountMap } from './assignments_with_stats';
import { isValidAssistantForStudent } from './assignment_selection';
import { MeetingType } from '@definition/app';
import { formatDate } from '@utils/date';
import { WEEK_TYPE_ASSIGNMENT_CODES } from '@constants/index';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { hanldeIsPersonAway } from './persons';

export type AssignmentTask = {
  schedule: SchedWeekType;
  targetDate: string;
  path: string;
  assignmentKey: string;
  code: AssignmentCode;
  elderOnly: boolean;
  sortIndex: number;
  dataView: string;
  randomId: number;
};

const handleGetWeekType = (
  schedule: SchedWeekType,
  dataView: string
): number => {
  return (
    schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value ?? Week.NORMAL
  );
};

const addDaysHelper = (dateStr: string, days: number): Date => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date;
};

const getActualMeetingDate = (
  weekOf: string,
  settings: SettingsType,
  dataView: string,
  meeting_type: MeetingType
): string => {
  const meetingDay =
    meeting_type === 'midweek'
      ? settings.cong_settings.midweek_meeting.find(
          (record) => record.type === dataView
        )?.weekday.value
      : settings.cong_settings.weekend_meeting.find(
          (record) => record.type === dataView
        )?.weekday.value;

  const dateObj = addDaysHelper(weekOf, meetingDay);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

//MARK: MAIN FUNCTION
export const handleDynamicAssignmentAutofill = (
  start: string,
  end: string,
  weeksList: SchedWeekType[],
  languageGroups: FieldServiceGroupType[],
  meeting_type?: MeetingType
) => {
  // Get data from store
  // 1. Decouple complex data structures (Important for performance & bug avoidance)
  const sources = structuredClone(store.get(sourcesState));
  const fullHistory = structuredClone(store.get(assignmentsHistoryState));
  const persons = structuredClone(store.get(personsByViewState));
  const schedules = structuredClone(store.get(schedulesState));
  const settings = structuredClone(store.get(settingsState));

  const dataView = store.get(userDataViewState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);
  const classCount = store.get(midweekMeetingClassCountState);
  const isPublicTalkCoordinator = store.get(isPublicTalkCoordinatorState);

  const linkedAssignments: Record<string, Record<string, string>> = {};
  const fixedAssignments: Record<string, Record<string, string>> = {};

  //only assignment keys relevant for the meeting type & deleting _B keys if class count is 1
  const assignmentKeys = Object.keys(ASSIGNMENT_PATH).filter(
    (key) =>
      (!meeting_type ||
        (meeting_type === 'midweek'
          ? key.startsWith('MM_')
          : key.startsWith('WM_'))) &&
      (!key.endsWith('_B') || classCount === 2)
  );
  const assignmentsToIgnoreInCO_Visit = new Set([
    'MM_LCCBSConductor',
    'MM_LCCBSReader',
    'WM_WTStudy_Reader',
    'WM_Speaker_Part2',
    ...assignmentKeys.filter((key) => key.endsWith('_B')),
  ]);

  //since the original code didn't reassign if there was already an assignment we don't have to clean the history
  const cleanHistory = structuredClone(fullHistory);
  // MARK: CLEAN HISTORY
  // 1. CLEANING: We identify the weeks we are rescheduling and remove them from history so they are "empty" for rescheduling
  //MARK: DELETE WEEKS LATER instead of just filtering!!!
  /*  const planningWeeks = new Set(weeksList.map((week) => week.weekOf));
  const cleanHistory = fullHistory.filter((entry) => {
    if (!planningWeeks.has(entry.weekOf)) {
      return true;
    }
    // B) Keep entries from other DataView! (To detect conflicts with other groups)
    const entryDataView = entry.assignment.dataView || 'main';
    if (entryDataView !== dataView) {
      return true;
    }
    if (
      MM_ASSIGNMENT_CODES.includes(entry.assignment.code) &&
      meeting_type !== 'midweek'
    ) {
      return true;
    }
    if (
      WM_ASSIGNMENT_CODES.includes(entry.assignment.code) &&
      meeting_type !== 'weekend'
    ) {
      return true;
    }
    // C) The entry lies in the planning week AND belongs to the current view.
    // -> Discard (False), as we want to redistribute these tasks now.
    return false;
  }); */

  // MARK: CHECKING SETTINGS
  const ignoredKeysByDataView: Record<string, string[]> = {};
  // ---------------------------------------------------------
  // A. Midweek Meeting
  // ---------------------------------------------------------
  if (settings.cong_settings.midweek_meeting) {
    settings.cong_settings.midweek_meeting.forEach((meeting) => {
      const viewKey = meeting.type; // DataView Key
      const keysToIgnore: string[] = [];
      const linkedAssignmentsForView: Record<string, string> = {};
      const fixedAssignmentsForView: Record<string, string> = {};

      if (meeting.aux_class_counselor_default.person.value) {
        fixedAssignmentsForView['MM_Chairman_B'] =
          meeting.aux_class_counselor_default.person.value;
        fixedAssignments[viewKey] = fixedAssignmentsForView;
      }

      // Opening Prayer
      if (meeting.opening_prayer_linked_assignment.value !== '') {
        keysToIgnore.push('MM_OpeningPrayer');
        linkedAssignmentsForView['MM_OpeningPrayer'] =
          meeting.opening_prayer_linked_assignment.value;
      }

      // Closing Prayer
      if (meeting.closing_prayer_linked_assignment.value !== '') {
        keysToIgnore.push('MM_ClosingPrayer');
        linkedAssignmentsForView['MM_ClosingPrayer'] =
          meeting.closing_prayer_linked_assignment.value;
      }

      if (keysToIgnore.length > 0) {
        ignoredKeysByDataView[viewKey] = keysToIgnore;
        linkedAssignments[viewKey] = linkedAssignmentsForView;
      }
    });
  }

  // ---------------------------------------------------------
  // B. Weekend Meeting
  // ---------------------------------------------------------
  if (settings.cong_settings.weekend_meeting) {
    settings.cong_settings.weekend_meeting.forEach((meeting) => {
      const viewKey = meeting.type;
      const keysToIgnore: string[] = [];
      const fixedAssignmentsForView = fixedAssignments[viewKey] || {};
      const linkedAssignmentsForView = linkedAssignments[viewKey] || {};

      keysToIgnore.push('WM_SubstituteSpeaker'); // for now always ignore substitute speaker
      keysToIgnore.push('WM_Speaker_Outgoing'); // for now always ignore outgoing speaker

      if (meeting.w_study_conductor_default.value) {
        fixedAssignmentsForView['WM_WTStudy_Conductor'] =
          meeting.w_study_conductor_default.value;
        fixedAssignments[viewKey] = fixedAssignmentsForView;
      }

      if (meeting.opening_prayer_auto_assigned.value) {
        keysToIgnore.push('WM_OpeningPrayer');
        linkedAssignmentsForView['WM_OpeningPrayer'] = 'WM_Chairman';
      }

      if (!isPublicTalkCoordinator) {
        keysToIgnore.push('WM_Speaker_Part1');
        keysToIgnore.push('WM_Speaker_Part2');
      }

      if (keysToIgnore.length > 0) {
        ignoredKeysByDataView[viewKey] = keysToIgnore;
        linkedAssignments[viewKey] = linkedAssignmentsForView;
      }
    });
  }

  //MARK: STATISTICS
  // ---------------------------------------------------------
  // C. Call statistics function
  // ---------------------------------------------------------

  const startDate = new Date(start);
  const historyLimitDate = new Date(startDate);
  historyLimitDate.setDate(historyLimitDate.getDate() - 112);
  const startStats = formatDate(historyLimitDate, 'yyyy/MM/dd');
  const sourceForStats = sources.filter((week) => week.weekOf >= startStats);
  const schedulesForStats = schedules.filter(
    (schedule) => schedule.weekOf >= startStats
  );

  const freqMap = getAssignmentsWithStats(
    sourceForStats,
    schedulesForStats,
    settings,
    languageGroups
  );
  const eligibilityCountMap = buildEligibilityCountMap(persons);
  const eligibilityMap =
    getEligiblePersonsPerDataViewAndCode(persons)[dataView];

  // Collection array for all tasks that have to be planed in the given schedules
  const tasks: AssignmentTask[] = [];
  //MARK: TASK BUILDING & ASSIGNMENT
  weeksList.forEach((schedule) => {
    //MARK: EVENTUELL HIER NOCH WEEKTYPE MEHR BERÜCKSICHTIGEN
    // Determine week type (CO visit etc.) for the main hall
    const COWeek = handleGetWeekType(schedule, 'main') === Week.CO_VISIT;
    if (COWeek && dataView !== 'main') return;

    // Source contains the concrete task names and details in the respective language
    const source = sources.find((s) => s.weekOf === schedule.weekOf);
    if (!source) return;

    // 1. Date & Source Check
    const actualDateMidweek = getActualMeetingDate(
      schedule.weekOf,
      settings,
      dataView,
      'midweek'
    );
    const actualDateWeekend = getActualMeetingDate(
      schedule.weekOf,
      settings,
      dataView,
      'weekend'
    );

    assignmentKeys.forEach((key) => {
      // Goal: 1) filter relevant keys 2) determine associated code
      if (COWeek && assignmentsToIgnoreInCO_Visit.has(key)) return;

      let code: AssignmentCode | undefined;
      let elderOnly = false;

      // A Midweekmeeting treatment
      // Case 1: Assistant tasks
      if (key.includes('_Assistant_')) {
        // 1. Extract Part Index from key (AYFPart1, AYFPart2...)
        const partMatch = key.match(/AYFPart(\d+)/);
        if (!partMatch) return; // Sollte nicht passieren
        const partIndex = partMatch[1];

        // 2. Get data from source
        // We need the type and source text (for talk check)
        const ayfSourceData = source.midweek_meeting[`ayf_part${partIndex}`];

        if (!ayfSourceData) return;

        const sourceType = ayfSourceData.type[lang];
        const sourceSrc = ayfSourceData.src[lang];

        // 3. Check: Is it a talk?
        // For "Explaining Beliefs" it can be a talk or a discussion.
        // The function returns true if it is a talk.
        const isTalk =
          sourceType === AssignmentCode.MM_ExplainingBeliefs
            ? sourcesCheckAYFExplainBeliefsAssignment(sourceSrc, sourceLocale)
            : false;
        const isValidAssistantPart =
          STUDENT_ASSIGNMENT.includes(sourceType) && !isTalk;

        // If the task does not need an assistant (e.g. pure talk), we abort.
        if (!isValidAssistantPart) return;
        // If we are here, it is a valid assistant task.
        code = AssignmentCode.MM_AssistantOnly;
        elderOnly = false;
      }

      // ... Case 2: Student tasks ...
      // Case 2: Student tasks (AYF Parts - Speaker/Student); source must be evaluated additionally here
      else if (key.includes('AYFPart')) {
        const partIndex = key.split('AYFPart')[1].charAt(0);
        code = source.midweek_meeting[`ayf_part${partIndex}`].type[lang];
        elderOnly = false;
      }

      // Case 3: Static defaults (e.g. Chairman, Prayer, BibleReading); corresponding code is directly clear here
      else if (ASSIGNMENT_DEFAULTS[key]) {
        code = ASSIGNMENT_DEFAULTS[key].code;
        elderOnly = !!ASSIGNMENT_DEFAULTS[key].elderOnly;
      }

      if (!code) return;
      // SECTION DETERMINE CODE END

      // ============================================================
      // WEEK TYPE CHECK (FILTER)
      // ============================================================

      // 1. Determine: Is this a midweek or weekend task?
      const isMidweekTask = key.startsWith('MM_');

      // 2. Get WeekType for THIS DataView and THIS meeting
      const weekTypeRecord = isMidweekTask
        ? schedule.midweek_meeting.week_type.find((w) => w.type === dataView)
        : schedule.weekend_meeting.week_type.find((w) => w.type === dataView);

      // Fallback auf NORMAL, falls nichts gefunden wird
      const currentWeekType = weekTypeRecord
        ? weekTypeRecord.value
        : Week.NORMAL;

      // Fallback to NORMAL if nothing found
      if (currentWeekType !== Week.NORMAL) {
        // If it is NOT a normal week (e.g. Convention, CO visit),
        // we check the whitelist if this code is allowed.

        const allowedCodes = WEEK_TYPE_ASSIGNMENT_CODES[currentWeekType];

        // A) If no codes are defined for this type (e.g. Regional Convention) -> Block everything
        if (!allowedCodes) return;

        // B) If the code is not in the list of allowed codes -> Block
        if (!allowedCodes.includes(code)) return;
      }
      // ============================================================

      // B) LIVING AS CHRISTIANS (LC Parts)
      if (code === AssignmentCode.MM_LCPart) {
        let title = '';
        let desc = '';

        if (key === 'MM_LCPart3') {
          title =
            source.midweek_meeting.lc_part3?.title?.find(
              (m) => m.type === dataView
            )?.value || '';
          desc =
            source.midweek_meeting.lc_part3?.desc?.find(
              (m) => m.type === dataView
            )?.value || '';
        } else {
          const part = source.midweek_meeting;
          title =
            (key === 'MM_LCPart1'
              ? part.lc_part1?.title?.default?.[lang]
              : part.lc_part2?.title?.default?.[lang]) || '';
          desc =
            (key === 'MM_LCPart1'
              ? part.lc_part1?.desc?.default?.[lang]
              : part.lc_part2?.desc?.default?.[lang]) || '';
        }

        // If source is incomplete and we have no title -> Skip
        if (!title) return;
        // CHECK: Video / No assignment?
        const noAssign = sourcesCheckLCAssignments(title, sourceLocale);
        if (noAssign) return;

        // CHECK: Elders only?
        if (sourcesCheckLCElderAssignment(title, desc, sourceLocale)) {
          elderOnly = true;
        }
      }

      const actualDate = key.startsWith('MM_')
        ? actualDateMidweek
        : actualDateWeekend;

      const mapForView = eligibilityCountMap.get(dataView);
      const sortIndex = mapForView?.get(code!) ?? 99999;

      tasks.push({
        schedule: schedule,
        targetDate: actualDate,
        path: ASSIGNMENT_PATH[key as keyof typeof ASSIGNMENT_PATH],
        assignmentKey: key,
        code,
        elderOnly,
        sortIndex,
        dataView,
        randomId: Math.random(),
      });
    });
  });

  // MARK: TASK SORTING
  tasks.sort((a, b) => {
    // ---------------------------------------------------------
    // RULE 0: Chronology (Plan week by week)
    // ---------------------------------------------------------
    /* if (a.schedule.weekOf !== b.schedule.weekOf) {
      return a.schedule.weekOf.localeCompare(b.schedule.weekOf);
    }
 */
    // =========================================================
    // From here we are in the SAME week.
    // Priority now applies: Fixed > Master > Slave > Difficulty
    // =========================================================

    // 1. Definition: Is task A or B fixed?
    const isFixedA = !!fixedAssignments[a.dataView]?.[a.assignmentKey];
    const isFixedB = !!fixedAssignments[b.dataView]?.[b.assignmentKey];

    // RULE A: Fixed tasks ALWAYS come first (within the week)
    if (isFixedA !== isFixedB) {
      return isFixedA ? -1 : 1; // Who is fixed comes first (-1)
    }

    // ---------------------------------------------------------
    // From here, either BOTH are fixed or NEITHER.
    // We now take care of the "Dependents".
    // ---------------------------------------------------------

    // 2. Definition: Is task dependent?
    const isAssistantA = a.code === AssignmentCode.MM_AssistantOnly;
    const isAssistantB = b.code === AssignmentCode.MM_AssistantOnly;

    const isPart2A = a.assignmentKey === 'WM_Speaker_Part2';
    const isPart2B = b.assignmentKey === 'WM_Speaker_Part2';

    const isLinkedA = !!linkedAssignments[a.dataView]?.[a.assignmentKey];
    const isLinkedB = !!linkedAssignments[b.dataView]?.[b.assignmentKey];

    const isDependentA = isAssistantA || isLinkedA || isPart2A;
    const isDependentB = isAssistantB || isLinkedB || isPart2B;

    // RULE B: Dependent tasks come last
    // (Master before Slave)
    if (isDependentA !== isDependentB) {
      return isDependentA ? 1 : -1; // Dependent (Slave) to back (1)
    }

    // ---------------------------------------------------------
    // RULE C: Standard sorting by scarcity (SortIndex)
    // ---------------------------------------------------------
    const diff = a.sortIndex - b.sortIndex;
    if (diff !== 0) {
      return diff;
    }

    // ---------------------------------------------------------
    // RULE D: Random as tie-breaker
    // (Prevents always same task types coming first)
    // ---------------------------------------------------------
    return a.randomId - b.randomId;
  });
  for (const task of tasks) {
    // 1. Get standard list
    let allowedUIDs = eligibilityMap[task.code];

    // --- SPECIAL CASE: WM_Speaker_Part1 ---
    // Here we allow 'WM_Speaker' AND 'WM_SpeakerSymposium'
    if (task.assignmentKey === 'WM_Speaker_Part1') {
      // List A: Normal Speakers (Code 120)
      const standardSpeakers =
        eligibilityMap[AssignmentCode.WM_Speaker] || new Set();

      // List B: Symposium Speakers (Code ??? - probably 121 or similar, please check!)
      // Type "AssignmentCode." and check enum name for Symposium
      const symposiumSpeakers =
        eligibilityMap[AssignmentCode.WM_SpeakerSymposium] || new Set();

      // Combine BOTH lists (Merge)
      allowedUIDs = new Set([...standardSpeakers, ...symposiumSpeakers]);
    }
    // -------------------------------------

    // 1. Preparation: If it is an assistant, we search for the student BEFOREHAND
    //let studentPerson: PersonType | undefined = undefined;

    const studentPersonUID = getCorrespondingStudentOrAssistant(
      task.assignmentKey,
      task.schedule.weekOf,
      cleanHistory,
      task.dataView
    );
    const studentPerson = persons.find(
      (p) => p.person_uid === studentPersonUID
    );

    // 2. Linked Assignment Check (Chairman -> Prayer)
    let forcedPerson: PersonType | undefined = undefined;

    const linkedKey = linkedAssignments[task.dataView]?.[task.assignmentKey];
    if (linkedKey) {
      const linkedEntry = cleanHistory.find(
        (entry) =>
          entry.weekOf === task.schedule.weekOf &&
          entry.assignment.key === linkedKey &&
          entry.assignment.dataView === task.dataView
      );

      if (linkedEntry) {
        forcedPerson = persons.find(
          (p) => p.person_uid === linkedEntry.assignment.person
        );
      }
    }

    const fixedPersonId = fixedAssignments[task.dataView]?.[task.assignmentKey];
    if (fixedPersonId) {
      forcedPerson = persons.find((p) => p.person_uid === fixedPersonId);
    }

    const candidates = persons.filter((p) => {
      // A) FORCED CHECK
      if (forcedPerson) {
        return p.person_uid === forcedPerson.person_uid;
      }

      // B) Base Checks
      if (!allowedUIDs || !allowedUIDs.has(p.person_uid)) return false;
      if (task.elderOnly && !personIsElder(p)) return false;

      // B) Assistant Check (only if we found a student)
      if (studentPerson) {
        // Does this candidate match the student?
        if (!isValidAssistantForStudent(studentPerson, p)) return false;
      }

      if (task.code === AssignmentCode.MM_AssistantOnly) {
        if (studentPersonUID && p.person_uid === studentPersonUID) {
          return false; // Assistent cannot be the same person as the student
        }
      }

      if (hanldeIsPersonAway(p, task.targetDate)) return false;
      if (
        hasAssignmentConflict(
          p,
          task.schedule.weekOf,
          task.code,
          cleanHistory,
          task.dataView
        )
      )
        return false;

      return true;
    });

    // --- B) WEEKEND MEETING TREATMENT (CORRECTED) ---
    if (task.assignmentKey === 'WM_Speaker_Part2') {
      //MARK: FIX IS NEEDED HERE

      // 1. Check if Talk Type is "localSpeaker"
      const publicTalkType =
        task.schedule.weekend_meeting.public_talk_type.find(
          (record) => record.type === dataView
        )?.value;

      // If not a local speaker (e.g. visiting speaker), skip Part 2 autofill
      if (publicTalkType !== 'localSpeaker') continue; // continue statt return!

      // 2. Find Speaker 1
      const speaker1Entry = cleanHistory.find(
        (entry) =>
          entry.weekOf === task.schedule.weekOf &&
          entry.assignment.key === 'WM_Speaker_Part1' && // Suche Part 1
          entry.assignment.dataView === dataView
      );

      if (!speaker1Entry) {
        // If Part 1 is not assigned yet, we cannot check Part 2 -> Abort for this task
        continue;
      }

      const speaker1UID = speaker1Entry.assignment.person;

      // 3. Check: Is Speaker 1 a Symposium Speaker?
      const speaker1IsSymposium = persons
        .find((person) => person.person_uid === speaker1UID)
        ?.person_data.assignments.find((entry) => entry.type === dataView)
        ?.values.includes(AssignmentCode.WM_SpeakerSymposium);

      // If Speaker 1 has NO Symposium, Speaker 2 must not be filled (there is only 1 talk)
      if (!speaker1IsSymposium) continue;
    }
    // --- END WEEKEND TREATMENT ---

    if (candidates.length === 0) continue;

    const selectedPerson = sortCandidatesMultiLevel(
      candidates,
      task,
      cleanHistory,
      freqMap,
      eligibilityCountMap
    )[0];

    if (selectedPerson)
      schedulesAutofillSaveAssignment({
        schedule: task.schedule,
        assignment: task.assignmentKey as AssignmentFieldType,
        value: selectedPerson,
        history: cleanHistory,
        dataView: dataView,
      });
  }

  handleDownloadDebugCSV();

  downloadAnalysisCSV(
    persons,
    languageGroups,
    sources,
    schedules,
    settings,
    cleanHistory
  );
};

export const downloadAnalysisCSV = (
  persons: PersonType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  history: AssignmentHistoryType[]
) => {
  const csvContent = generateDeepAnalysisCSV(
    persons,
    history,
    languageGroups,
    sources,
    schedules,
    settings
  );

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `analysis_export_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleAutofillMidweekNew = async (
  start: string,
  end: string,
  weeksList: SchedWeekType[],
  languageGroups: FieldServiceGroupType[]
) => {
  handleDynamicAssignmentAutofill(
    start,
    end,
    weeksList,
    languageGroups,
    'midweek'
  );

  await dbSchedBulkUpdate(weeksList);

  const newFullHistory = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, newFullHistory);
};

export const handleAutofillWeekendNew = async (
  start: string,
  end: string,
  weeksList: SchedWeekType[],
  languageGroups: FieldServiceGroupType[]
) => {
  handleDynamicAssignmentAutofill(
    start,
    end,
    weeksList,
    languageGroups,
    'weekend'
  );

  await dbSchedBulkUpdate(weeksList);

  const newFullHistory = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, newFullHistory);
};

export const handleDownloadDebugCSV = () => {
  const weeks = store.get(schedulesState);
  const sources = store.get(sourcesState);
  const persons = store.get(personsByViewState);

  const csvContent = exportScheduleToCSV(weeks, sources, persons);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `autofill_debug_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function: Calculates Min/Max distances in weeks from a list of date strings
const calculateIntervalMetrics = (dateStrings: string[]) => {
  if (dateStrings.length < 2) {
    return { min: Infinity, max: -Infinity };
  }

  // 1. Sort
  const timestamps = dateStrings
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  let minDiff = Infinity;
  let maxDiff = -Infinity;

  // 2. Measure distances
  for (let i = 1; i < timestamps.length; i++) {
    const diffMs = timestamps[i] - timestamps[i - 1];
    const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks < minDiff) minDiff = diffWeeks;
    if (diffWeeks > maxDiff) maxDiff = diffWeeks;
  }

  return { min: minDiff, max: maxDiff };
};

// 1. Get all numeric codes from Enum
const getAllAssignmentCodes = (): number[] => {
  return Object.values(AssignmentCode).filter(
    (v) => typeof v === 'number'
  ) as number[];
};

const isPersonEligible = (
  person: PersonType,
  code: number,
  dataView: string
): boolean => {
  return (
    person.person_data.assignments
      .find((e) => e.type === dataView)
      ?.values.includes(code) ?? false
  );
};
export const generateDeepAnalysisCSV = (
  persons: PersonType[],
  history: AssignmentHistoryType[],
  languageGroups: FieldServiceGroupType[],
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType
): string => {
  const relevantViews = new Set<string>();
  relevantViews.add('main');

  if (settings.cong_settings.language_groups.enabled) {
    languageGroups.forEach((g) => {
      if (g.group_data._deleted) return;

      const hasMeetings =
        g.group_data.midweek_meeting || g.group_data.weekend_meeting;

      if (hasMeetings) {
        relevantViews.add(g.group_id);
      }
    });
  }

  let totalWeeks = 1;
  if (history.length > 0) {
    const dates = history.map((h) => new Date(h.weekOf).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    totalWeeks = Math.max(
      1,
      Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24 * 7)) + 1
    );
  }

  const allCodes = getAllAssignmentCodes();

  const rows: string[] = [];
  rows.push(
    'Dataview;Name;Task;Code;Global Avg/Week;Target Avg/Week (Global/Eligible);Actual Avg/Week;Min Interval;Max Interval;Eligible Count;DEBUG_INFO'
  );

  const globalCodeFreq = getAssignmentsWithStats(
    sources,
    schedules,
    settings,
    languageGroups
  );
  const codeEligibilityCount = buildEligibilityCountMap(persons);
  relevantViews.forEach((viewKey) => {
    persons.forEach((person) => {
      const name = `${person.person_data.person_lastname.value}, ${person.person_data.person_firstname.value}`;

      // -------------------------------------------------------------
      // STEP A: Performance & Stability
      // We filter the history for this person ONCE beforehand.
      // -------------------------------------------------------------
      const personHistoryItems = history.filter((h) => {
        if (h.assignment.person !== person.person_uid) return false;

        const entryView = h.assignment.dataView || 'main';

        return entryView === viewKey;
      });
      // -------------------------------------------------------------

      // Collector for the "TOTAL" row
      let MMsumTheoretical = 0;
      let MMsumActual = 0;
      let MMsumGlobal = 0;
      let WMsumTheoretical = 0;
      let WMsumActual = 0;
      let WMsumGlobal = 0;
      const allDatesOfPerson: string[] = [];

      // We iterate through ALL codes
      allCodes.forEach((code) => {
        if (!isPersonEligible(person, code, viewKey)) return;

        const codeName = AssignmentCode[code];

        // A) Global Average
        const globalAvg = globalCodeFreq.get(viewKey)?.get(code) || 0;
        const numEligible = codeEligibilityCount.get(viewKey)?.get(code) || 0;

        // C) Target Average
        const theoreticalAvg = numEligible > 0 ? globalAvg / numEligible : 0;

        // D) Actual Average (Own History)
        const personEntries = personHistoryItems.filter(
          (h) => Number(h.assignment.code) === Number(code)
        );

        const actualCount = personEntries.length;

        // Safety check for totalWeeks (avoids division by 0 or nonsense)
        const safeTotalWeeks = totalWeeks < 1 ? 1 : totalWeeks;
        const actualAvg = actualCount / safeTotalWeeks;

        // E) Distances
        const dates = personEntries.map((e) => e.weekOf);
        const { min, max } = calculateIntervalMetrics(dates);
        const minStr = min === Infinity ? '-' : min.toString();
        const maxStr = max === -Infinity ? '-' : max.toString();

        // Add to sums
        // ... (Your existing code for sums remains identical) ...
        MMsumGlobal += MM_ASSIGNMENT_CODES.includes(code) ? globalAvg : 0;
        MMsumTheoretical += MM_ASSIGNMENT_CODES.includes(code)
          ? theoreticalAvg
          : 0;
        MMsumActual += MM_ASSIGNMENT_CODES.includes(code) ? actualAvg : 0;

        WMsumGlobal += WM_ASSIGNMENT_CODES.includes(code) ? globalAvg : 0;
        WMsumTheoretical += WM_ASSIGNMENT_CODES.includes(code)
          ? theoreticalAvg
          : 0;
        WMsumActual += WM_ASSIGNMENT_CODES.includes(code) ? actualAvg : 0;

        allDatesOfPerson.push(...dates);

        const debugHistoryCount = personHistoryItems.length;

        const rawStringMatchCount = personHistoryItems.filter(
          (h) => String(h.assignment.code) === String(code)
        ).length;

        rows.push(
          `${viewKey};` +
            `${name};${codeName};` +
            `${code};` +
            `${globalAvg.toFixed(4).replace('.', ',')};` +
            `${theoreticalAvg.toFixed(4).replace('.', ',')};` +
            `${actualAvg.toFixed(4).replace('.', ',')};` +
            `${minStr};${maxStr};` +
            `${numEligible};` +
            `DebugCount:${actualCount}|RawMatch:${rawStringMatchCount}|TotalHistory:${debugHistoryCount}|SafeWeeks:${safeTotalWeeks}`
        );
      });

      // TOTAL row for person
      const { min: gMin, max: gMax } =
        calculateIntervalMetrics(allDatesOfPerson);
      const gMinStr = gMin === Infinity ? '-' : gMin.toString();
      const gMaxStr = gMax === -Infinity ? '-' : gMax.toString();

      rows.push(
        `${viewKey};` +
          `${name};MM_Total;` +
          `999;` +
          `${MMsumGlobal.toFixed(4).replace('.', ',')};` +
          `${MMsumTheoretical.toFixed(4).replace('.', ',')};` +
          `${MMsumActual.toFixed(4).replace('.', ',')};` +
          `${gMinStr};${gMaxStr};'Debug`
      );

      rows.push(
        `${viewKey};` +
          `${name};WM_Total;` +
          `999;` +
          `${WMsumGlobal.toFixed(4).replace('.', ',')};` +
          `${WMsumTheoretical.toFixed(4).replace('.', ',')};` +
          `${WMsumActual.toFixed(4).replace('.', ',')};` +
          `${gMinStr};${gMaxStr}`
      );
    });
  });

  return rows.join('\n');
};
