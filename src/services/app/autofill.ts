// services/app/autofill.ts
import { MeetingType } from '@definition/app';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { PersonType } from '@definition/person';
import { AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { SettingsType } from '@definition/settings';
import { LivingAsChristiansType, SourceWeekType } from '@definition/sources';
import { Week } from '@definition/week_type';
import {
  ASSIGNMENT_DEFAULTS,
  ASSIGNMENT_PATH,
  ASSIGNMENT_PATH_KEYS,
  AssignmentPathKey,
  STUDENT_ASSIGNMENT,
  WEEK_TYPE_ASSIGNMENT_PATH_KEYS,
} from '@constants/index';
import { store } from '@states/index';
import { personsByViewState } from '@states/persons';
import {
  assignmentsHistoryState,
  isPublicTalkCoordinatorState,
  schedulesState,
} from '@states/schedules';
import {
  JWLangLocaleState,
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { addDays } from '@utils/date';
import { sourcesState } from '@states/sources';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { formatDate } from '@utils/date';
import {
  getCorrespondingStudentOrAssistant,
  hasAssignmentConflict,
  isValidAssistantForStudent,
  sortCandidatesMultiLevel,
} from './assignment_selection';
import {
  AssignmentStatisticsView,
  DataViewKey,
  getAssignmentsWithStats,
  getEligiblePersonsPerDataViewAndCode,
  getPersonsAssignmentMetrics,
} from './assignments_with_stats';
import { hanldeIsPersonAway, personIsElder } from './persons';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
} from './schedules';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from './sources';
import {
  handleDownloadDebugCSV,
  downloadAnalysisCSV,
} from './assignments_schedule_export';

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

const getWeekType = (
  schedule: SchedWeekType,
  dataView: string,
  meeting_type: MeetingType
): Week => {
  const weekTypeRecord =
    meeting_type === 'midweek'
      ? schedule.midweek_meeting.week_type.find((w) => w.type === dataView)
      : schedule.weekend_meeting.week_type.find((w) => w.type === dataView);

  // Fallback to NORMAL if nothing found
  const currentWeekTypeView = weekTypeRecord
    ? weekTypeRecord.value
    : Week.NORMAL;

  return currentWeekTypeView;
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

  const dateObj = addDays(weekOf, meetingDay);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

type AssignmentSettingsResult = {
  ignoredKeysByDataView: Record<string, string[]>;
  linkedAssignments: Record<string, Record<string, string>>;
  fixedAssignments: Record<string, Record<string, string>>;
};

/**
 * Processes congregation settings to derive configuration rules for the assignment autofill.
 *
 * This function iterates through the Midweek and Weekend meeting settings for all data views
 * (e.g., Main congregation, language groups) and generates three key maps used to control the autofill logic:
 *
 * 1. **Ignored Keys:** Tasks that should be skipped by the autofill algorithm.
 * - Includes tasks that are manually handled (e.g., Substitute Speaker).
 * - Includes tasks that are strictly linked to others (e.g., Prayer linked to Chairman).
 * - Includes restricted tasks (e.g., Public Talk parts if the user is not the Coordinator).
 *
 * 2. **Linked Assignments:** Defines dependencies where one assignment dictates another.
 * - Example: If the opening prayer is linked to the Chairman, this map records that relationship
 * so the autofill knows to copy the person from the "master" assignment.
 *
 * 3. **Fixed Assignments:** Identifies tasks that are permanently assigned to a specific person.
 * - Example: Default Watchtower Study Conductor or Auxiliary Class Counselor.
 *
 * @param settings - The global application settings containing meeting configurations.
 * @param isPublicTalkCoordinator - Flag indicating if the current user has permission to manage Public Talks.
 * @returns An object containing maps for ignored keys, linked assignments, and fixed assignments, grouped by DataView.
 */
export const processAssignmentSettings = (
  settings: SettingsType,
  isPublicTalkCoordinator: boolean
): AssignmentSettingsResult => {
  const ignoredKeysByDataView: Record<string, string[]> = {};
  const linkedAssignments: Record<string, Record<string, string>> = {};
  const fixedAssignments: Record<string, Record<string, string>> = {};

  // Process Midweek Meeting settings
  if (settings.cong_settings.midweek_meeting) {
    settings.cong_settings.midweek_meeting.forEach((meeting) => {
      const viewKey = meeting.type;
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

  // Process Weekend Meeting settings
  if (settings.cong_settings.weekend_meeting) {
    settings.cong_settings.weekend_meeting.forEach((meeting) => {
      const viewKey = meeting.type;
      const keysToIgnore: string[] = [];
      const fixedAssignmentsForView = fixedAssignments[viewKey] || {};
      const linkedAssignmentsForView = linkedAssignments[viewKey] || {};

      keysToIgnore.push('WM_SubstituteSpeaker');
      keysToIgnore.push('WM_Speaker_Outgoing');

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

  return {
    ignoredKeysByDataView,
    linkedAssignments,
    fixedAssignments,
  };
};

/**
 * Filters the list of possible assignments based on the specific week type.
 *
 * This function ensures that only valid assignments are generated for special weeks
 * (e.g., Assemblies, CO Visits). It checks a predefined whitelist of allowed keys
 * for each week type.
 *
 * Logic:
 * 1. If the week is `Week.NORMAL`, all input keys are returned (no filtering).
 * 2. If the week is special (e.g., Convention), it retrieves the allowed keys from `WEEK_TYPE_ASSIGNMENT_PATH_KEYS`.
 * - If no configuration exists for that type (e.g., Regional Convention), all assignments are blocked.
 * - Otherwise, it filters the keys to match the allowed list.
 * 3. **CO Visit Sync:** If the main congregation has a Circuit Overseer visit, specific filtering rules
 * are applied to ensure language groups align with the main schedule constraints.
 *
 * @param assignmentPathKeys - The initial list of potential assignment keys to filter.
 * @param currentWeekTypeView - The week type for the current data view (e.g., Language Group or Main).
 * @param mainWeekType - The week type of the main congregation (used for synchronization logic).
 * @returns The filtered array of allowed assignment keys, or an empty array if the week type blocks all tasks.
 */
const filterAssignmentKeysByWeektype = (
  assignmentPathKeys: AssignmentPathKey[],
  currentWeekTypeView: Week,
  mainWeekType: Week
): AssignmentPathKey[] => {
  let relevantAssignmentKeys = assignmentPathKeys;
  if (currentWeekTypeView !== Week.NORMAL) {
    // If it is NOT a normal week (e.g. Convention, CO visit),
    // we check the whitelist if this code is allowed.

    const allowedAssignmentPathKeys =
      WEEK_TYPE_ASSIGNMENT_PATH_KEYS.get(currentWeekTypeView);

    // A) If no codes are defined for this type (e.g. Regional Convention) -> Block everything
    if (!allowedAssignmentPathKeys) return [];

    // B) If the code is not in the list of allowed codes -> filter
    relevantAssignmentKeys = assignmentPathKeys.filter((key) => {
      return allowedAssignmentPathKeys.has(key);
    });

    // in case of COVisit in main same assignments are missed in language group
    const COWeekMain = mainWeekType === Week.CO_VISIT;
    if (COWeekMain) {
      relevantAssignmentKeys = relevantAssignmentKeys.filter((key) => {
        return WEEK_TYPE_ASSIGNMENT_PATH_KEYS.get(Week.CO_VISIT).has(key);
      });
    }
  }

  return relevantAssignmentKeys;
};

/**
 * Filters the list of weekend meeting assignments based on the public talk type.
 *
 * This function checks the schedule to determine if the public talk is handled by a local speaker.
 * If the talk type is NOT 'localSpeaker' (e.g., it is a visiting speaker), the standard
 * assignment keys for the Public Talk Speaker (`WM_Speaker_Part1`, `WM_Speaker_Part2`)
 * are removed from the list.
 *
 * This prevents the autofill algorithm from attempting to assign a local publisher
 * to a slot that is already reserved for an external or visiting speaker.
 *
 * @param assignmentPathKeys - The initial list of potential assignment keys.
 * @param schedule - The schedule for the week containing the public talk configuration.
 * @param dataView - The specific data view (e.g., 'main') to check settings for.
 * @returns The filtered array of assignment keys, excluding speaker parts if applicable.
 */
const filterAssignmentKeysByPublicTalkType = (
  assignmentPathKeys: AssignmentPathKey[],
  schedule: SchedWeekType,
  dataView: DataViewKey
): AssignmentPathKey[] => {
  let relevantAssignmentKeys = assignmentPathKeys;

  const publicTalkType =
    schedule.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    )?.value || 'localSpeaker';
  if (publicTalkType !== 'localSpeaker') {
    relevantAssignmentKeys = relevantAssignmentKeys.filter(
      (key) => !['WM_Speaker_Part1', 'WM_Speaker_Part2'].includes(key)
    );
  }

  return relevantAssignmentKeys;
};

/**
 * Determines the assignment code and permissions for an assistant role in the "Apply Yourself to the Field Ministry" section.
 *
 * This function validates whether a specific AYF part actually requires an assistant.
 *
 * Logic:
 * 1. **Identification:** Extracts the part index (e.g., Part 1, Part 2) from the assignment key.
 * 2. **Type Check:** Retrieves the source type (e.g., Bible Reading, Return Visit) from the source data.
 * 3. **Talk Exclusion:** Checks if the part is a "Talk" (which never has an assistant).
 * - Special handling for "Explaining Beliefs": It checks the source text to distinguish between a "Talk" (solo) and a "Discussion" (with assistant).
 * 4. **Validation:** If the task is a valid student assignment and NOT a talk, it returns the standard assistant code.
 *
 * @param key - The assignment key string (e.g., 'MM_AYFPart1_Assistant').
 * @param source - The source data object for the current week.
 * @param lang - The language key (e.g., 'X') to retrieve the correct source type.
 * @param sourceLocale - The locale used for text-based analysis (e.g. to detect "Discussion").
 * @returns An object containing the `AssignmentCode.MM_AssistantOnly` and `elderOnly: false` if valid, otherwise undefined.
 */
const getCodeAndElderOnlyAssistant = (
  key: AssignmentPathKey,
  source: SourceWeekType,
  lang: string,
  sourceLocale: string
): { code: AssignmentCode | undefined; elderOnly: boolean } => {
  // 1. Extract Part Index from key (AYFPart1, AYFPart2...)
  const partMatch = key.match(/AYFPart(\d+)/);
  if (!partMatch) return;
  const partIndex = partMatch[1];

  // 2. Get data from source
  // We need the type and source text (for talk check)
  const ayfSourceData = source.midweek_meeting[`ayf_part${partIndex}`];

  if (!ayfSourceData) return;

  const sourceType = ayfSourceData.type[lang];
  const sourceSrc = ayfSourceData.src[lang];

  // 3. Check: Is it a talk?
  // For "Explaining Beliefs" it can be a talk or a discussion.
  const isTalk =
    sourceType === AssignmentCode.MM_ExplainingBeliefs
      ? sourcesCheckAYFExplainBeliefsAssignment(sourceSrc, sourceLocale)
      : false;
  const isValidAssistantPart =
    STUDENT_ASSIGNMENT.includes(sourceType) && !isTalk;

  // If the task does not need an assistant (e.g. pure talk), we abort.
  if (!isValidAssistantPart) return;
  // If we are here, it is a valid assistant task.
  const code = AssignmentCode.MM_AssistantOnly;
  const elderOnly = false;

  return { code, elderOnly };
};

/**
 * Determines whether a specific "Living as Christians" (LC) part is restricted to Elders.
 *
 * This function analyzes the source material (title and description) to decide if the assignment
 * requires specific qualifications (Elder) or if it is a standard part assignable to Ministerial Servants.
 *
 * Logic:
 * 1. **Data Retrieval:**
 * - **Part 3 (Local Needs):** Fetches the custom title/description specifically for the current DataView.
 * - **Parts 1 & 2:** Fetches the standard source data, prioritizing DataView-specific overrides.
 * 2. **Filtering:**
 * - Checks if the part requires an assignment at all (e.g., filters out pure video playbacks) using `sourcesCheckLCAssignments`.
 * 3. **Qualification Check:**
 * - Uses `sourcesCheckLCElderAssignment` to analyze keywords in the title/description (e.g., "Local Needs") to determine if it is an Elder-only task.
 *
 * @param key - The assignment key (e.g., 'MM_LCPart1', 'MM_LCPart3').
 * @param source - The source data for the week.
 * @param dataView - The current view (e.g., 'main') to handle local overrides.
 * @param lang - The language code for default text.
 * @param sourceLocale - The locale used for text analysis.
 * @returns An object `{ code, elderOnly }` if a valid assignment exists, or `undefined` if the part requires no assignment (e.g., a video).
 */
const getCodeAndElderOnlyLCPart = (
  key: AssignmentPathKey,
  source: SourceWeekType,
  dataView: DataViewKey,
  lang: string,
  sourceLocale: string
): { code: AssignmentCode; elderOnly: boolean } | undefined => {
  let elderOnly = false;

  let title = '';
  let desc = '';

  if (key === 'MM_LCPart3') {
    title =
      source.midweek_meeting.lc_part3?.title?.find((m) => m.type === dataView)
        ?.value || '';
    desc =
      source.midweek_meeting.lc_part3?.desc?.find((m) => m.type === dataView)
        ?.value || '';
  } else {
    const partIndex = key.slice(-1);
    const propName = `lc_part${partIndex}`;
    const lcPart = source.midweek_meeting[propName] as
      | LivingAsChristiansType
      | undefined;
    if (!lcPart) return;

    const titleOverride =
      lcPart.title.override.find((record) => record.type === dataView)?.value ??
      '';

    const titleDefault = lcPart.title.default[lang] ?? '';
    title = titleOverride.length > 0 ? titleOverride : titleDefault;

    const descOverride =
      lcPart.desc.override.find((record) => record.type === dataView)?.value ??
      '';

    const descDefault = lcPart.desc.default[lang] ?? '';
    desc = descOverride.length > 0 ? descOverride : descDefault;
  }

  if (!title) return;
  // CHECK: Video / No assignment?
  const noAssign = sourcesCheckLCAssignments(title, sourceLocale);
  if (noAssign) return;

  // CHECK: Elders only?
  elderOnly = sourcesCheckLCElderAssignment(title, desc, sourceLocale);

  return { code: AssignmentCode.MM_LCPart, elderOnly };
};

/**
 * Resolves the specific assignment code and qualification requirements (Elder-only) for a given assignment key.
 *
 * This function acts as the central logic hub to determine *what* kind of task a specific slot represents
 * and *who* is qualified to handle it based on the weekly source data.
 *
 * Logic Flow:
 * 1. **Assistant Parts:** Delegates to `getCodeAndElderOnlyAssistant` to check if an assistant is actually needed.
 * 2. **Student Parts (AYF):** Extracts the source type directly from the weekly data.
 * 3. **Living as Christians (LC):** Uses `getCodeAndElderOnlyLCPart` to determine the code and checks for Elder requirements or if the part is a video (returns undefined).
 * 4. **Static Roles:** Looks up standard roles (Chairman, Prayer) in the `ASSIGNMENT_DEFAULTS` constant.
 *
 * @param key - The assignment path key (e.g., 'MM_Chairman', 'MM_AYFPart1_Student').
 * @param source - The source data for the week.
 * @param dataView - The current data view (e.g., 'main').
 * @param lang - The language key for source retrieval.
 * @param sourceLocale - The locale used for text analysis.
 * @returns An object `{ code, elderOnly }`, or `undefined` if the key is invalid or requires no assignment (e.g. LC video).
 */
const getCodeAndElderOnly = (
  key: string,
  source: SourceWeekType,
  dataView: string,
  lang: string,
  sourceLocale: string
): { code: AssignmentCode; elderOnly: boolean } | undefined => {
  let code: AssignmentCode | undefined;
  let elderOnly = false;

  // A Midweekmeeting treatment
  // Case 1: Assistant tasks
  //M_AssistantOnly code is used for assistant tasks
  if (key.includes('_Assistant_')) {
    const result = getCodeAndElderOnlyAssistant(
      key,
      source,
      lang,
      sourceLocale
    );
    if (result) {
      code = result.code;
      elderOnly = result.elderOnly;
    }
  }

  // ... Case 2: Student tasks ...
  // Case 2: Student tasks (AYF Parts - Speaker/Student); source must be evaluated additionally here
  else if (key.includes('AYFPart')) {
    const partIndex = key.split('AYFPart')[1].charAt(0);
    code = source.midweek_meeting[`ayf_part${partIndex}`].type[lang];
    if (code === AssignmentCode.MM_Discussion && key.includes('_B')) return;
    elderOnly = false;
  } else if (key.includes('LCPart')) {
    const result = getCodeAndElderOnlyLCPart(
      key,
      source,
      dataView,
      lang,
      sourceLocale
    );
    if (result) {
      code = result.code;
      elderOnly = result.elderOnly;
    }
  }

  // Case 3: Static defaults (e.g. Chairman, Prayer, BibleReading); corresponding code is directly clear here
  else if (ASSIGNMENT_DEFAULTS[key]) {
    code = ASSIGNMENT_DEFAULTS[key].code;
    elderOnly = !!ASSIGNMENT_DEFAULTS[key].elderOnly;
  }

  if (!code) return;

  return { code, elderOnly };
};

/**
 * Identifies if a specific person is mandatorily assigned to the current task based on congregation settings.
 *
 * This function bypasses the standard selection algorithm if a "forced" assignment rule exists.
 * It checks two types of rules:
 *
 * 1. **Linked Assignments:** Checks if the current task is tied to another assignment in the same week.
 * - Example: If "Opening Prayer" is linked to "Chairman", it looks up who was assigned as Chairman
 * in the `cleanHistory` and forces that same person for the prayer.
 *
 * 2. **Fixed Assignments:** Checks if the task is permanently assigned to a specific individual.
 * - Example: A specific elder is set as the default "Auxiliary Class Counselor".
 *
 * @param assignmentsSettingsResult - The processed settings containing linked and fixed assignment maps.
 * @param task - The current task being planned.
 * @param cleanHistory - The current assignment history (including assignments just made in this session) to resolve links.
 * @param persons - The list of all persons to retrieve the full person object.
 * @returns The `PersonType` of the forced assignee, or `undefined` if the task is open for dynamic selection.
 */
const getForcedPerson = (
  assignmentsSettingsResult: AssignmentSettingsResult,
  task: AssignmentTask,
  cleanHistory: AssignmentHistoryType[],
  persons: PersonType[]
): PersonType | undefined => {
  const { linkedAssignments, fixedAssignments } = assignmentsSettingsResult;

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
  return forcedPerson;
};

/**
 * Generates a flat list of all individual assignment tasks that need to be planned for the provided weeks.
 *
 * This function acts as the "Task Builder" pipeline. It transforms abstract schedule weeks into concrete,
 * fillable assignment slots by applying multiple layers of filtering and data resolution.
 *
 * Pipeline Steps:
 * 1. **Global Filtering:** Reduces the list of all possible assignment keys based on:
 * - Meeting Type (Midweek vs. Weekend).
 * - Class Count (removes 'B' school parts if only 1 class is active).
 * - Ignored Keys (removes manually handled or disabled tasks passed from settings).
 *
 * 2. **Week-Specific Filtering:** Iterates through each week and applies dynamic filters:
 * - **Week Type:** Removes standard tasks during special events (CO Visits, Assemblies) using `filterAssignmentKeysByWeektype`.
 * - **Public Talk:** Removes Speaker parts if the talk is handled by a guest (not 'localSpeaker').
 *
 * 3. **Task Resolution:**
 * - Resolves the specific `AssignmentCode` and requirements (e.g., Elder-only) using source data.
 * - Calculates a `sortIndex` based on the number of eligible candidates (Scarcity).
 * (Fewer candidates = Lower index = Higher priority in later sorting).
 *
 * @param weeksList - The list of schedule objects to generate tasks for.
 * @param sources - The source material for the corresponding weeks.
 * @param ignoredKeys - List of assignment keys to explicitly skip (from settings).
 * @param dataView - The current view (e.g., 'main' or language group).
 * @param assignmentsMetricsView - Statistics map used to determine candidate scarcity.
 * @param lang - Language key.
 * @param sourceLocale - Source locale.
 * @param settings - Global settings.
 * @param meeting_type - 'midweek' or 'weekend'.
 * @returns An array of `AssignmentTask` objects ready to be sorted and filled.
 */
const getTasksArray = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  ignoredKeys: AssignmentPathKey[],
  dataView: DataViewKey,
  assignmentsMetricsView: AssignmentStatisticsView,
  lang: string,
  sourceLocale: string,
  settings: SettingsType,
  meeting_type: MeetingType
): AssignmentTask[] => {
  const meetingSettings = settings.cong_settings.midweek_meeting.find(
    (record) => record.type === dataView
  );

  const classCount = meetingSettings?.class_count.value ?? 1;
  //only assignment keys relevant for the meeting type & deleting _B keys if class count is 1
  const assignmentKeys = ASSIGNMENT_PATH_KEYS.filter(
    (key) =>
      (!meeting_type ||
        (meeting_type === 'midweek'
          ? key.startsWith('MM_')
          : key.startsWith('WM_'))) &&
      (!key.endsWith('_B') || classCount === 2) &&
      !ignoredKeys.includes(key)
  );

  const tasks: AssignmentTask[] = [];

  weeksList.forEach((schedule) => {
    const weekTypeView = getWeekType(schedule, dataView, meeting_type);
    const mainWeekType = getWeekType(schedule, 'main', meeting_type);

    let relevantAssignmentKeys = assignmentKeys;

    relevantAssignmentKeys = filterAssignmentKeysByWeektype(
      relevantAssignmentKeys,
      weekTypeView,
      mainWeekType
    );
    relevantAssignmentKeys = filterAssignmentKeysByPublicTalkType(
      relevantAssignmentKeys,
      schedule,
      dataView
    );

    // Source contains the concrete task names and details in the respective language
    const source = sources.find((s) => s.weekOf === schedule.weekOf);
    if (!source) return;

    relevantAssignmentKeys.forEach((key) => {
      let code: AssignmentCode | undefined;
      let elderOnly = false;

      const codeCheckResult = getCodeAndElderOnly(
        key,
        source,
        dataView,
        lang,
        sourceLocale
      );
      if (codeCheckResult?.code) {
        code = codeCheckResult.code;
        elderOnly = codeCheckResult.elderOnly;
      }

      let sortIndex = 99999;
      if (code) {
        sortIndex =
          assignmentsMetricsView?.get(code)?.eligibleUIDS.size ?? 99999;

        const actualDate = getActualMeetingDate(
          schedule.weekOf,
          settings,
          dataView,
          meeting_type
        );

        tasks.push({
          schedule: schedule,
          targetDate: actualDate,
          path: ASSIGNMENT_PATH[key],
          assignmentKey: key,
          code,
          elderOnly,
          sortIndex,
          dataView,
          randomId: Math.random(),
        });
      }
    });
  });

  return tasks;
};

/**
 * Sorts the list of assignment tasks to establish the optimal processing order for the autofill algorithm.
 *
 * The sorting logic follows a "Sandwich Principle" to handle dependencies and scarcity effectively:
 *
 * 1. **Top Priority (Fixed Assignments):**
 * - Tasks that are manually fixed in settings (e.g., "Brother X always does the Watchtower Study") are moved to the very top.
 * - *Reason:* These require no calculation and should "lock" the assigned person immediately to prevent double-booking.
 *
 * 2. **Bottom Priority (Dependent Tasks):**
 * - Tasks that rely on another assignment are moved to the very bottom.
 * - Includes: Assistants (need a Student first), Part 2 (needs Part 1 first), and Linked tasks (e.g., Prayer linked to Chairman).
 * - *Reason:* We cannot fill these until their "Master" task has been successfully assigned.
 *
 * 3. **Middle Ground (Scarcity Sorting):**
 * - All remaining "Standard Tasks" are sorted by their `sortIndex` (number of eligible candidates) in ascending order.
 * - *Reason:* "Hard-to-fill" tasks (few candidates) are processed before "Easy-to-fill" tasks. This prevents versatile publishers from being used up by easy tasks, leaving bottlenecks empty.
 *
 * @param tasks - The unsorted list of assignment tasks.
 * @param specialAssignments - Configuration object containing fixed and linked assignment rules.
 * @returns The sorted array of tasks, ready for sequential processing.
 */
const getSortedTasks = (
  tasks: AssignmentTask[],
  specialAssignments: AssignmentSettingsResult
) => {
  const fixedAssignments = specialAssignments.fixedAssignments;
  const linkedAssignments = specialAssignments.linkedAssignments;
  return tasks.sort((a, b) => {
    // 1. Definition: Is task A or B fixed?
    const isFixedA = !!fixedAssignments[a.dataView]?.[a.assignmentKey];
    const isFixedB = !!fixedAssignments[b.dataView]?.[b.assignmentKey];

    // RULE A: Fixed tasks ALWAYS come first
    if (isFixedA !== isFixedB) {
      return isFixedA ? -1 : 1;
    }

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
    if (isDependentA !== isDependentB) {
      return isDependentA ? 1 : -1;
    }

    const diff = a.sortIndex - b.sortIndex;
    if (diff !== 0) {
      return diff;
    }
  });
};

/* const getSortedTasks = (
  tasks: AssignmentTask[],
  specialAssignments: AssignmentSettingsResult
) => {
  const fixedAssignments = specialAssignments.fixedAssignments;
  const linkedAssignments = specialAssignments.linkedAssignments;

  return tasks.sort((a, b) => {
    // --- 0. PRIORITY: Chronological Order ---
    // Wir müssen zwingend Woche für Woche abarbeiten, damit die Historie
    // für die darauffolgenden Wochen korrekt ist.
    if (a.schedule.weekOf !== b.schedule.weekOf) {
      return a.schedule.weekOf < b.schedule.weekOf ? -1 : 1;
    }

    // 1. Definition: Is task A or B fixed?
    const isFixedA = !!fixedAssignments[a.dataView]?.[a.assignmentKey];
    const isFixedB = !!fixedAssignments[b.dataView]?.[b.assignmentKey];

    // RULE A: Fixed tasks ALWAYS come first (within the same week)
    if (isFixedA !== isFixedB) {
      return isFixedA ? -1 : 1;
    }

    // 2. Definition: Is task dependent?
    const isAssistantA = a.code === AssignmentCode.MM_AssistantOnly;
    const isAssistantB = b.code === AssignmentCode.MM_AssistantOnly;

    const isPart2A = a.assignmentKey === 'WM_Speaker_Part2';
    const isPart2B = b.assignmentKey === 'WM_Speaker_Part2';

    const isLinkedA = !!linkedAssignments[a.dataView]?.[a.assignmentKey];
    const isLinkedB = !!linkedAssignments[b.dataView]?.[b.assignmentKey];

    const isDependentA = isAssistantA || isLinkedA || isPart2A;
    const isDependentB = isAssistantB || isLinkedB || isPart2B;

    // RULE B: Dependent tasks come last (within the same week)
    if (isDependentA !== isDependentB) {
      return isDependentA ? 1 : -1;
    }

    // 3. Fallback: SortIndex (Hierarchy of the task itself)
    const diff = a.sortIndex - b.sortIndex;
    if (diff !== 0) {
      return diff;
    }
    
    return 0;
  });
}; */

/**
 * Determines if a second speaker assignment (`WM_Speaker_Part2`) is required for the current week.
 *
 * This function implements the logic to distinguish between a standard 30-minute Public Talk (single speaker)
 * and a Symposium (multiple speakers). It relies on the qualification of the person assigned to Part 1.
 *
 * Logic:
 * 1. **Dependency Check:** Looks up the person currently assigned to `WM_Speaker_Part1` in the provided history.
 * - If Part 1 is empty (not assigned yet), Part 2 cannot be scheduled (returns `false`).
 * 2. **Qualification Check:** Verifies if the person assigned to Part 1 holds the `WM_SpeakerSymposium` assignment code.
 * 3. **Decision:**
 * - If Speaker 1 is a **Symposium Speaker**, it implies the talk is split, so Part 2 is necessary (returns `true`).
 * - If Speaker 1 is a standard speaker, they cover the full time slot, so Part 2 is skipped (returns `false`).
 *
 * @param cleanHistory - The current assignment history (including recent autofill additions) to find Speaker 1.
 * @param persons - List of persons to check the assigned speaker's qualifications.
 * @param dataView - The current data view context.
 * @param weekOf - The ISO date string of the target week.
 * @returns `true` if Part 2 should be filled, `false` if it should be skipped.
 */
const checkSpeaker2Necessary = (
  cleanHistory: AssignmentHistoryType[],
  persons: PersonType[],
  dataView: DataViewKey,
  weekOf: string
): boolean => {
  // 2. Find Speaker 1
  const speaker1Entry = cleanHistory.find(
    (entry) =>
      entry.weekOf === weekOf &&
      entry.assignment.key === 'WM_Speaker_Part1' && // Suche Part 1
      entry.assignment.dataView === dataView
  );

  if (!speaker1Entry) {
    // If Part 1 is not assigned yet, we cannot check Part 2 -> Abort for this task
    return false;
  }

  const speaker1UID = speaker1Entry.assignment.person;

  // 3. Check: Is Speaker 1 a Symposium Speaker?
  const speaker1IsSymposium = persons
    .find((person) => person.person_uid === speaker1UID)
    ?.person_data.assignments.find((entry) => entry.type === dataView)
    ?.values.includes(AssignmentCode.WM_SpeakerSymposium);

  // If Speaker 1 has NO Symposium, Speaker 2 must not be filled (there is only 1 talk)
  if (!speaker1IsSymposium) return false;
  return true;
};

/**
 * Filters the global list of persons to determine the set of valid candidates for a specific assignment task.
 *
 * This function applies a comprehensive set of rules to exclude anyone who is not qualified, available, or suitable
 * for the current task.
 *
 * Filter Logic (in order of execution):
 * 1. **Base Eligibility:** Retrieves the initial pool of UIDs from the pre-calculated `eligibilityMapView`.
 * - *Special Case (WM_Speaker_Part1):* Merges "Standard Speakers" and "Symposium Speakers" lists, as both are valid for the first part of the weekend meeting.
 *
 * 2. **Forced Assignment Check:**
 * - If a person is "forced" via settings (Fixed Assignment) or dependencies (Linked Assignment), **only** that person is returned. All other checks are bypassed.
 *
 * 3. **Candidate Validation (Iterative):**
 * - **Permission:** Must be in the `allowedUIDs` set.
 * - **Elder Status:** If `task.elderOnly` is true, the candidate must be an Elder.
 * - **Assistant Compatibility:** If filling an assistant slot, checks against the assigned student using `isValidAssistantForStudent` (Gender/Family rules) and ensures the assistant is not the student themselves.
 * - **Availability:** Checks `hanldeIsPersonAway` to exclude those absent on the target date.
 * - **Conflicts:** Checks `hasAssignmentConflict` to prevent double-booking or forbidden combinations (e.g., Chairman cannot have a Student part).
 *
 * @param persons - The full list of persons to filter.
 * @param task - The specific assignment task being planned.
 * @param cleanHistory - The current assignment history used for conflict and dependency checks.
 * @param eligibilityMapView - A map of assignment codes to eligible person UIDs.
 * @param checkAssignmentsSettingsResult - Settings for resolving forced assignments.
 * @returns An array of `PersonType` objects representing all valid candidates for the task.
 */
const filterCandidates = (
  persons: PersonType[],
  task: AssignmentTask,
  cleanHistory: AssignmentHistoryType[],
  eligibilityMapView: Map<AssignmentCode, Set<string>>,
  checkAssignmentsSettingsResult: AssignmentSettingsResult
) => {
  // 1. Get standard list
  let allowedUIDs = eligibilityMapView?.get(task.code);

  // --- SPECIAL CASE: WM_Speaker_Part1 ---
  // Here we allow 'WM_Speaker' AND 'WM_SpeakerSymposium'
  if (task.assignmentKey === 'WM_Speaker_Part1') {
    // List A: Normal Speakers (Code 120)
    const standardSpeakers =
      eligibilityMapView?.get(AssignmentCode.WM_Speaker) || new Set();

    // List B: Symposium Speakers
    const symposiumSpeakers =
      eligibilityMapView?.get(AssignmentCode.WM_SpeakerSymposium) || new Set();

    allowedUIDs = new Set([...standardSpeakers, ...symposiumSpeakers]);
  }
  // -------------------------------------

  // 1. Preparation: If it is an assistant, we search for the student BEFOREHAND
  const studentPersonUID = getCorrespondingStudentOrAssistant(
    task.assignmentKey,
    task.schedule.weekOf,
    cleanHistory,
    task.dataView
  );
  const studentPerson = persons.find((p) => p.person_uid === studentPersonUID);

  // 2. Linked Assignment Check (Chairman -> Prayer) and fixed assignments (e.g. Chairman B)
  const forcedPerson = getForcedPerson(
    checkAssignmentsSettingsResult,
    task,
    cleanHistory,
    persons
  );

  const candidates = persons.filter((p) => {
    if (forcedPerson) {
      return p.person_uid === forcedPerson.person_uid;
    }
    if (!allowedUIDs || !allowedUIDs.has(p.person_uid)) return false;
    if (task.elderOnly && !personIsElder(p)) return false;

    if (studentPerson) {
      // Does this candidate match the student?
      if (!isValidAssistantForStudent(studentPerson, p)) return false;
    }

    if (task.code === AssignmentCode.MM_AssistantOnly) {
      if (
        studentPerson.person_uid &&
        p.person_uid === studentPerson.person_uid
      ) {
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
  return candidates;
};

//MARK: MAIN FUNCTION
/**
 * Orchestrates the complete dynamic assignment autofill process.
 *
 * This is the main entry point for the "Weighted Distribution" algorithm. It manages the entire lifecycle
 * of generating assignments for a specified period, from data preparation to final execution.
 *
 * Workflow:
 * 1. **Data Snapshot:** Retrieves and clones all necessary state data (Persons, History, Settings, Sources) to ensure thread-safe operations on a stable dataset.
 *
 * 2. **Statistical Analysis:**
 * - Defines a "Lookback Period" of 112 days (16 weeks) prior to the start date.
 * - Calculates assignment frequencies and scarcity metrics (`assignmentsMetrics`) based on this history.
 * - Computes individual workload scores (`personsMetrics`) to identify who is under- or overworked.
 *
 * 3. **Task Generation & Sorting:**
 * - Generates all necessary tasks for the target weeks using `getTasksArray`.
 * - Sorts these tasks using `getSortedTasks` (Fixed -> Scarcity -> Dependent) to ensure optimal filling order.
 *
 * 4. **Sequential Assignment Loop:**
 * - Iterates through each task and applies `filterCandidates` to find valid publishers.
 * - Selects the best candidate using `sortCandidatesMultiLevel` (Recovery Tier > Wait Time > Workload).
 * - Immediately updates the local `cleanHistory` to ensure subsequent tasks verify conflicts against newly created assignments.
 *
 * @param start - Start date of the planning period (ISO string).
 * @param end - End date of the planning period (ISO string).
 * @param weeksList - The list of schedule objects to fill.
 * @param languageGroups - Configuration of field service groups (for DataView handling).
 * @param meeting_type - Optional filter to run only 'midweek' or 'weekend' assignments.
 */
export const handleDynamicAssignmentAutofill = (
  start: string,
  end: string,
  languageGroups: FieldServiceGroupType[],
  meeting_type?: MeetingType
): SchedWeekType[] => {
  // Get data from store
  const sources = structuredClone(store.get(sourcesState));
  const fullHistory = structuredClone(store.get(assignmentsHistoryState));
  const persons = structuredClone(store.get(personsByViewState));
  const schedules = structuredClone(store.get(schedulesState));
  const settings = structuredClone(store.get(settingsState));
  const dataView = store.get(userDataViewState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);
  const isPublicTalkCoordinator = store.get(isPublicTalkCoordinatorState);
  const weeksList = schedules.filter(
    (record) => record.weekOf >= start && record.weekOf <= end
  );

  if (weeksList.length === 0) return [];

  const cleanHistory = structuredClone(fullHistory);

  //MARK:
  // getting fixed and linked assignments from settings
  const checkAssignmentsSettingsResult = processAssignmentSettings(
    settings,
    isPublicTalkCoordinator
  );

  // Call statistics function
  // filtering relevant sources & schedules for statistics calculation
  const startDate = new Date(start);
  const historyLimitDate = new Date(startDate);
  historyLimitDate.setDate(historyLimitDate.getDate() - 112);
  const startStats = formatDate(historyLimitDate, 'yyyy/MM/dd');
  const sourceForStats = sources.filter((week) => week.weekOf >= startStats);
  const schedulesForStats = schedules.filter(
    (schedule) => schedule.weekOf >= startStats
  );

  const assignmentsMetrics = getAssignmentsWithStats(
    persons,
    sourceForStats,
    schedulesForStats,
    settings,
    languageGroups
  );
  const assignmentsMetricsView = assignmentsMetrics.get(dataView);
  const personsMetrics = getPersonsAssignmentMetrics(
    persons,
    assignmentsMetrics
  );
  const assistantFrequency =
    assignmentsMetricsView?.get(AssignmentCode.MM_AssistantOnly)?.frequency ||
    0;
  const assistantThreshold = Math.floor(
    assistantFrequency > 0 ? 1 / assistantFrequency : 0
  );
  // statistics end

  // Collection array for all tasks that have to be planed in the given schedules
  const unsortedTasks = getTasksArray(
    weeksList,
    sources,
    checkAssignmentsSettingsResult.ignoredKeysByDataView[dataView] || [],
    dataView,
    assignmentsMetricsView,
    lang,
    sourceLocale,
    settings,
    meeting_type
  );

  const tasks = getSortedTasks(unsortedTasks, checkAssignmentsSettingsResult);

  //TASKS-ITERATION
  const eligibilityMapView =
    getEligiblePersonsPerDataViewAndCode(persons).get(dataView);
  for (const task of tasks) {
    // WM_SPEAKER_PART2 depends on part 1 -> checking here wheter it is necesseray
    if (
      task.assignmentKey === 'WM_Speaker_Part2' &&
      !checkSpeaker2Necessary(
        cleanHistory,
        persons,
        dataView,
        task.schedule.weekOf
      )
    ) {
      continue;
    }

    const candidates = filterCandidates(
      persons,
      task,
      cleanHistory,
      eligibilityMapView,
      checkAssignmentsSettingsResult
    );

    if (candidates.length === 0) continue;

    const selectedPerson = sortCandidatesMultiLevel(
      candidates,
      task,
      cleanHistory,
      assistantThreshold,
      personsMetrics
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

  downloadAnalysisCSV(
    persons,
    languageGroups,
    sources,
    schedules,
    settings,
    cleanHistory,
    assignmentsMetrics
  );

  return schedules;
};

//MARK: schedulesStartAutofill
export const schedulesStartAutofill = async (
  start: string,
  end: string,
  meeting: 'midweek' | 'weekend',
  languageGroups: FieldServiceGroupType[]
) => {
  try {
    if (start.length === 0 || end.length === 0) return;

    const modifiedWeeks = handleDynamicAssignmentAutofill(
      start,
      end,
      languageGroups,
      meeting
    );

    if (!modifiedWeeks || modifiedWeeks.length === 0) return;

    await dbSchedBulkUpdate(modifiedWeeks);

    const newFullHistory = schedulesBuildHistoryList();
    store.set(assignmentsHistoryState, newFullHistory);
  } catch (error) {
    throw new Error(`autofill error: ${error.message}`);
  }

  handleDownloadDebugCSV();
};
