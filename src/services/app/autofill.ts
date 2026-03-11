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
import {
  getCorrespondingStudentOrAssistant,
  hasAssignmentConflict,
  isValidAssistantForStudent,
  sortCandidatesMultiLevel,
} from './assignment_selection';
import {
  AssignmentStatisticsComplete,
  DataViewKey,
  getAssignmentsWithStats,
  getEligiblePersonsPerDataViewAndCode,
  getPersonsAssignmentMetrics,
  personsAssignmentMetrics,
  getDataViewsWithMeetings,
  getPersonsWeightingMetrics,
  personsWeightingMetrics,
} from './assignments_with_stats';
import { isPersonBlockedOnDate, personIsElder } from './persons';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
  schedulesGetData,
} from './schedules';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from './sources';
import { subMonths, format } from 'date-fns';
import { STUDENT_TASK_CODES } from '@constants/assignmentConflicts';

export type AssignmentTask = {
  schedule: SchedWeekType;
  targetDate: string;
  path: string;
  assignmentKey: string;
  code: AssignmentCode;
  elderOnly: boolean;
  requiresAssistant: boolean;
  sortIndex: number;
  dataView: string;
};

/**
 * Returns the configured week type for a given meeting (midweek/weekend) and data view.
 *
 * Looks up the matching entry in the schedule’s week_type list (by `type === dataView`) and
 * returns its value; if no matching entry exists, it falls back to `Week.NORMAL`.
 *
 * @param schedule - The schedule record containing midweek/weekend week-type configuration.
 * @param dataView - The data-view key used to select the correct week-type entry (matched against `w.type`).
 * @param meeting_type - Which meeting configuration to read from ("midweek" or "weekend").
 * @returns The resolved week type for the given meeting and data view, or `Week.NORMAL` if not found.
 */
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

/**
 * Calculates the exact meeting date from week start (`weekOf`) + configured weekday offset.
 *
 * Determines the meeting day-of-week from congregation settings based on meeting type and data view,
 * then adds that offset to the `weekOf` (Monday) date.
 *
 * **Output Format:** `YYYY/MM/DD` (e.g., `'2026/03/05'` for Thursday meeting)
 *
 * @param weekOf - Week start date (Monday) as ISO string (e.g., `'2026-03-02'`)
 * @param settings - Congregation settings with meeting weekday configurations
 * @param dataView - Group/view identifier (e.g., `'main'`, `'group_ID'`)
 * @param meeting_type - `'midweek'` or `'weekend'`
 *
 * @returns Meeting date string in `YYYY/MM/DD` format
 */
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
      : (settings.cong_settings.weekend_meeting.find(
          (record) => record.type === dataView
        )?.weekday.value ?? 0);

  const dateObj = addDays(weekOf, meetingDay ?? 0);
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
export type FixedAssignmentsByCode = Map<
  DataViewKey,
  Map<AssignmentCode, Set<string>>
>;

/**
 * Converts fixedAssignments (key-based) into a code-based lookup map.
 * Uses ASSIGNMENT_DEFAULTS to resolve the AssignmentCode for each fixed key.
 *
 * @param fixedAssignments - From processAssignmentSettings(): { dataView -> { assignmentKey -> personUID } }
 * @returns Map: dataView -> AssignmentCode -> personUID
 */
export const buildFixedAssignmentsByCode = (
  fixedAssignments: Record<string, Record<string, string>>
): FixedAssignmentsByCode => {
  const result: FixedAssignmentsByCode = new Map();

  for (const [viewKey, keysMap] of Object.entries(fixedAssignments)) {
    const codeMap = new Map<AssignmentCode, Set<string>>();

    for (const [assignmentKey, personUID] of Object.entries(keysMap)) {
      const code = ASSIGNMENT_DEFAULTS[assignmentKey]?.code;
      if (code !== undefined) {
        // Check if a Set already exists, otherwise create one
        if (!codeMap.has(code)) {
          codeMap.set(code, new Set<string>());
        }
        // Add UID to the set
        codeMap.get(code)!.add(personUID);
      }
    }

    if (codeMap.size > 0) {
      result.set(viewKey, codeMap);
    }
  }

  return result;
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
      const keysToIgnore: string[] = [
        ...(ignoredKeysByDataView[viewKey] || []),
      ];
      const fixedAssignmentsForView = fixedAssignments[viewKey] || {};
      const linkedAssignmentsForView = linkedAssignments[viewKey] || {};

      keysToIgnore.push('WM_SubstituteSpeaker', 'WM_Speaker_Outgoing');

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
  }
  // in case of COVisit in main same assignments are missed in language group
  const COWeekMain = mainWeekType === Week.CO_VISIT;
  if (COWeekMain) {
    const coVisitKeys = WEEK_TYPE_ASSIGNMENT_PATH_KEYS.get(Week.CO_VISIT);
    relevantAssignmentKeys = relevantAssignmentKeys.filter((key) => {
      return coVisitKeys?.has(key) ?? false;
    });
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
): { code: AssignmentCode; elderOnly: boolean } | undefined => {
  // 1. Extract Part Index from key (AYFPart1, AYFPart2...)
  const partMatch = key.match(/AYFPart(\d+)/);
  if (!partMatch) return undefined;
  const partIndex = partMatch[1];

  // 2. Get data from source
  // We need the type and source text (for talk check)
  const ayfSourceData = source.midweek_meeting[`ayf_part${partIndex}`];

  if (!ayfSourceData) return undefined;

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
  if (!isValidAssistantPart) return undefined;
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
export const getCodeAndElderOnlyLCPart = (
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
    if (!lcPart) return undefined;

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

  if (!title) return undefined;
  // CHECK: Video / No assignment?
  const noAssign = sourcesCheckLCAssignments(title, sourceLocale);
  if (noAssign) return undefined;

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
export const getCodeAndElderOnly = (
  key: AssignmentPathKey,
  source: SourceWeekType,
  dataView: string,
  lang: string,
  sourceLocale: string
): { code: AssignmentCode; elderOnly: boolean } | undefined => {
  let code: AssignmentCode | undefined;
  let elderOnly = false;

  // Midweek meeting handling
  // Case 1: Assistant tasks
  // MM_AssistantOnly code is used for assistant tasks
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

  // Case 2: Student tasks (AYF Parts - Speaker/Student); source must be evaluated additionally here
  else if (key.includes('AYFPart')) {
    const partIndex = key.split('AYFPart')[1].charAt(0);
    const ayfPart = source.midweek_meeting[`ayf_part${partIndex}`];
    if (!ayfPart) return undefined;
    code = ayfPart.type[lang];
    if (code === AssignmentCode.MM_Discussion && key.includes('_B'))
      return undefined;
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

  if (!code) return undefined;

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
 * - Class Count (removes '_B' school parts if only 1 class is active).
 * - Ignored Keys (removes manually handled or disabled tasks passed from settings).
 *
 * 2. **Week-Specific Filtering:** Iterates through each week and applies dynamic filters:
 * - **Week Type:** Removes standard tasks during special events (CO Visits, Assemblies) using `filterAssignmentKeysByWeektype`.
 * - **Public Talk:** Removes Speaker parts if the talk is handled by a guest (not 'localSpeaker').
 *
 * 3. **History Verification:**
 * - Checks the current assignment history (`fullHistory`) to ensure tasks that are already manually assigned are not overwritten.
 * - Skips task generation for slots that already have a valid person assigned.
 *
 * 4. **Task Resolution:**
 * - Resolves the specific `AssignmentCode` and requirements (e.g., Elder-only) using source data.
 * - Calculates a `sortIndex` using `getTaskSortIndex` based on candidate scarcity.
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
 * @param fullHistory - The current assignment history used to skip already assigned slots.
 * @returns An array of `AssignmentTask` objects representing only the empty slots ready to be filled.
 */

export const getTasksArray = (
  weeksList: SchedWeekType[],
  sources: SourceWeekType[],
  ignoredKeys: AssignmentPathKey[],
  dataView: DataViewKey,
  lang: string,
  sourceLocale: string,
  settings: SettingsType,
  meeting_type: MeetingType,
  fullHistory: AssignmentHistoryType[],
  persons: PersonType[],
  eligibilityMapView: Map<AssignmentCode, Set<string>>,
  checkAssignmentsSettingsResult: AssignmentSettingsResult
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
      const isAlreadyAssigned = fullHistory.some(
        (entry) =>
          entry.weekOf === schedule.weekOf &&
          entry.assignment.key === key &&
          entry.assignment.dataView === dataView &&
          entry.assignment.person !== ''
      );

      if (isAlreadyAssigned) {
        return;
      }

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

      if (code) {
        const actualDate = getActualMeetingDate(
          schedule.weekOf,
          settings,
          dataView,
          meeting_type
        );

        let requiresAssistant = false;

        if (key.includes('_Student_')) {
          const assistantKey = key.replace(
            '_Student_',
            '_Assistant_'
          ) as AssignmentPathKey;

          requiresAssistant = !!getCodeAndElderOnlyAssistant(
            assistantKey,
            source,
            lang,
            sourceLocale
          );
        }

        // 1. Create the task object with a temporary sortIndex placeholder
        const task: AssignmentTask = {
          schedule: schedule,
          targetDate: actualDate,
          path: ASSIGNMENT_PATH[key],
          assignmentKey: key,
          code,
          elderOnly,
          requiresAssistant,
          sortIndex: 99999,
          dataView,
        };

        // 2. Determine the base task used to derive scarcity for sorting
        let sortIndexTask = task; // By default, use the task itself as the sorting reference

        // A) For assistants, derive scarcity from the corresponding student part
        if (key.includes('Assistant')) {
          const studentKey = key.replace(
            'Assistant',
            'Student'
          ) as AssignmentPathKey;
          const studentCodeResult = getCodeAndElderOnly(
            studentKey,
            source,
            dataView,
            lang,
            sourceLocale
          );
          if (studentCodeResult?.code) {
            sortIndexTask = {
              ...task,
              assignmentKey: studentKey,
              code: studentCodeResult.code,
              elderOnly: studentCodeResult.elderOnly,
            };
          }
        }
        // B) For Speaker Part 2, derive scarcity from Speaker Part 1
        else if (key === 'WM_Speaker_Part2') {
          const speaker1Key = key.replace(
            'Part2',
            'Part1'
          ) as AssignmentPathKey;
          const speaker1CodeResult = getCodeAndElderOnly(
            speaker1Key,
            source,
            dataView,
            lang,
            sourceLocale
          );
          if (speaker1CodeResult?.code) {
            sortIndexTask = {
              ...task,
              assignmentKey: speaker1Key,
              code: speaker1CodeResult.code,
              elderOnly: speaker1CodeResult.elderOnly,
            };
          }
        }

        // 3. Calculate the actual number of valid candidates
        const validCandidates = filterCandidates(
          persons,
          sortIndexTask,
          fullHistory, // Required for same-week conflict checks
          eligibilityMapView,
          checkAssignmentsSettingsResult
        );

        // 4. Set the final precise sortIndex
        task.sortIndex = validCandidates.length;

        tasks.push(task);
      }
    });
  });

  return tasks;
};

/**
 * Sorts the list of assignment tasks to establish the optimal processing order for the autofill algorithm.
 *
 * The sorting logic prioritizes tasks to handle dependencies and scarcity effectively:
 *
 * 1. **Top Priority (Fixed Assignments):**
 * - Tasks that are manually fixed in settings (e.g., "Brother X always does the Watchtower Study") are moved to the very top.
 * - *Reason:* These require no calculation and should "lock" the assigned person immediately to prevent double-booking.
 *
 * 2. **Bottom Priority (Linked Assignments):**
 * - Tasks that are directly linked to another assignment (e.g., Prayer linked to Chairman) are moved to the very bottom.
 * - *Reason:* We cannot fill these until their "Master" task has been successfully assigned and saved to the history.
 *
 * 3. **Middle Ground (Scarcity & Paired Sorting):**
 * - All remaining "Standard Tasks" are sorted by their `sortIndex` (number of eligible candidates) in ascending order.
 * - *Reason:* "Hard-to-fill" tasks (few candidates) are processed before "Easy-to-fill" tasks.
 * - *Note on Pairs:* Dependent parts like Assistants or Speaker Part 2 inherit the `sortIndex` of their Master task during task generation. Due to stable sorting, they naturally fall immediately after their Master task, ensuring the pair is processed together.
 *
 * @param tasks - The unsorted list of assignment tasks.
 * @param specialAssignments - Configuration object containing fixed and linked assignment rules.
 * @returns The sorted array of tasks, ready for sequential processing.
 */

export const getSortedTasks = (
  tasks: AssignmentTask[],
  specialAssignments: AssignmentSettingsResult
) => {
  const fixedAssignments = specialAssignments.fixedAssignments;
  const linkedAssignments = specialAssignments.linkedAssignments;

  // Keep a shared sortIndex per task family
  const familySortIndex = new Map<string, number>();

  const getBaseKey = (t: AssignmentTask) => {
    let base = t.assignmentKey;
    if (base.includes('Assistant')) base = base.replace('Assistant', 'Student');
    if (base === 'WM_Speaker_Part2') base = 'WM_Speaker_Part1';
    return `${t.schedule.weekOf}-${t.dataView}-${base}`;
  };

  // Populate helper maps
  tasks.forEach((t) => {
    const baseId = getBaseKey(t);

    // 1. Store the shared family sortIndex using the strictest value
    if (!familySortIndex.has(baseId)) {
      familySortIndex.set(baseId, t.sortIndex);
    } else {
      familySortIndex.set(
        baseId,
        Math.min(familySortIndex.get(baseId)!, t.sortIndex)
      );
    }
  });

  return tasks.sort((a, b) => {
    // 0. Sort weeks chronologically
    if (a.schedule.weekOf !== b.schedule.weekOf) {
      return a.schedule.weekOf < b.schedule.weekOf ? -1 : 1;
    }

    // 1. Rule A: fixed tasks always come first
    const isFixedA = !!fixedAssignments[a.dataView]?.[a.assignmentKey];
    const isFixedB = !!fixedAssignments[b.dataView]?.[b.assignmentKey];
    if (isFixedA !== isFixedB) return isFixedA ? -1 : 1;

    // 2. Rule B: linked tasks always come last
    const isLinkedA = !!linkedAssignments[a.dataView]?.[a.assignmentKey];
    const isLinkedB = !!linkedAssignments[b.dataView]?.[b.assignmentKey];
    if (isLinkedA !== isLinkedB) return isLinkedA ? 1 : -1;

    // 3. Primary sort by scarcity using the shared family index
    const baseIdA = getBaseKey(a);
    const baseIdB = getBaseKey(b);
    const unifiedSortIndexA = familySortIndex.get(baseIdA)!;
    const unifiedSortIndexB = familySortIndex.get(baseIdB)!;

    if (unifiedSortIndexA !== unifiedSortIndexB) {
      return unifiedSortIndexA - unifiedSortIndexB;
    }

    // 4. Secondary sort for equal family sortIndex values
    if (baseIdA !== baseIdB) {
      return 0;
    }

    // 5. Tertiary sort within the same task family
    const isSubPartA =
      a.assignmentKey.includes('Assistant') ||
      a.assignmentKey === 'WM_Speaker_Part2';
    const isSubPartB =
      b.assignmentKey.includes('Assistant') ||
      b.assignmentKey === 'WM_Speaker_Part2';

    if (isSubPartA !== isSubPartB) {
      return isSubPartA ? 1 : -1; // Keep dependent sub-parts after the main part
    }

    return 0;
  });
};

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
  symposiumSpeakerUIDs: Set<string>,
  dataView: DataViewKey,
  weekOf: string
): boolean => {
  // 1. Find Speaker 1
  const speaker1Entry = cleanHistory.find(
    (entry) =>
      entry.weekOf === weekOf &&
      entry.assignment.key === 'WM_Speaker_Part1' &&
      entry.assignment.dataView === dataView
  );

  if (!speaker1Entry) return false;

  const speaker1UID = speaker1Entry.assignment.person;

  // 2. Check Is Speaker 1 a Symposium Speaker?
  const isSymposium = symposiumSpeakerUIDs.has(speaker1UID);

  return isSymposium;
};

/**
 * Validates whether a single person is a suitable candidate for a specific assignment task.
 *
 * This helper function runs a comprehensive series of checks including base eligibility,
 * role requirements, student/assistant compatibility, availability, and scheduling conflicts.
 *
 * Validation Checks:
 * 1. **Base Eligibility:** Checks if the person's UID is present in the `allowedUIDs` set.
 * 2. **Elder Status:** If `task.elderOnly` is true, ensures the person is an Elder.
 * 3. **Assistant Compatibility:** If a student is provided, validates if this person can assist them (e.g., gender rules) using `isValidAssistantForStudent`.
 * 4. **Self-Assignment:** Ensures the assistant is not the student themselves (specifically for `MM_AssistantOnly`).
 * 5. **Availability:** Checks if the person is blocked/away on the task date (`isPersonBlockedOnDate`).
 * 6. **Conflicts:** Verifies the person has no conflicting assignments in the same week (`hasAssignmentConflict`).
 *
 * @param person - The person object to evaluate.
 * @param task - The specific assignment task details.
 * @param allowedUIDs - A set of UIDs representing all persons generally eligible for this task type.
 * @param studentPerson - (Optional) The student person object, if this task involves assisting a student.
 * @param cleanHistory - The assignment history used to detect scheduling conflicts.
 * @returns `true` if the person passes all validation checks; otherwise `false`.
 */
const isCandidateValid = (
  person: PersonType,
  task: AssignmentTask,
  allowedUIDs: Set<string> | undefined,
  studentPerson: PersonType | undefined,
  cleanHistory: AssignmentHistoryType[]
): boolean => {
  // 1. Basic eligibility (Is the person generally allowed to perform this task?)
  if (!allowedUIDs?.has(person.person_uid)) return false;

  // 2. Elder check
  if (task.elderOnly && !personIsElder(person)) return false;

  // 3. Assistant logic (Is the assistant compatible with the student?)
  if (studentPerson) {
    if (!isValidAssistantForStudent(studentPerson, person)) return false;
  }

  // 4. Special case: MM_AssistantOnly (Assistant cannot be the student themselves)
  if (task.code === AssignmentCode.MM_AssistantOnly) {
    if (
      studentPerson?.person_uid &&
      person.person_uid === studentPerson.person_uid
    ) {
      return false;
    }
  }

  // 5. Availability check (Vacation, away dates, etc.)
  if (isPersonBlockedOnDate(person, task.targetDate)) return false;

  // 6. Conflict check (Does the person already have another assignment?)
  if (
    hasAssignmentConflict(
      person,
      task.schedule.weekOf,
      task.code,
      cleanHistory,
      task.dataView
    )
  ) {
    return false;
  }

  return true;
};

/**
 * Filters the global list of persons to determine valid candidates for a specific assignment task.
 *
 * Applies comprehensive qualification, availability, and compatibility rules.
 *
 * **Filter Logic:**
 * 1. **Base Eligibility:** UIDs from `eligibilityMapView[task.code]`
 *    - **WM_Speaker_Part1 Special Case:** Merges `WM_Speaker` + `WM_SpeakerSymposium`
 *
 * 2. **Forced Assignment Check (Priority + Fallback):**
 *    - `getForcedPerson()` from settings/links
 *    - **Valid** → Return `[forcedPerson]` only
 *    - **Invalid** → Continue to standard filtering
 *
 * 3. **Candidate Validation (`isCandidateValid`):**
 *    - Base eligibility (`allowedUIDs`)
 *    - Elder status (`task.elderOnly`)
 *    - Assistant compatibility (`isValidAssistantForStudent`)
 *    - Self-assignment block (`MM_AssistantOnly`)
 *    - Availability (`isPersonBlockedOnDate`)
 *    - Conflicts (`hasAssignmentConflict`)
 *
 * 4. **Student Tasks (additional):**
 *    - Creates mock `MM_AssistantOnly` task
 *    - Filters available assistants upfront
 *    - Student valid **only if** ≥1 compatible assistant exists
 *
 * @param persons - Full congregation list
 * @param task - Assignment task details
 * @param cleanHistory - History for conflicts/dependencies
 * @param eligibilityMapView - Precomputed eligible UIDs per code
 * @param checkAssignmentsSettingsResult - Fixed/linked assignment rules
 * @returns Array of valid `PersonType` candidates
 */
const filterCandidates = (
  persons: PersonType[],
  task: AssignmentTask,
  cleanHistory: AssignmentHistoryType[],
  eligibilityMapView: Map<AssignmentCode, Set<string>> | undefined,
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
  if (forcedPerson) {
    const isForcedValid = isCandidateValid(
      forcedPerson,
      task,
      allowedUIDs,
      studentPerson,
      cleanHistory
    );

    if (isForcedValid) {
      return [forcedPerson];
    }
  }

  const isStudentTask =
    task.assignmentKey.includes('_Student_') &&
    STUDENT_ASSIGNMENT.includes(task.code);

  let availableAssistants: PersonType[] = [];
  if (isStudentTask && task.requiresAssistant) {
    const mockAssistantTask: AssignmentTask = {
      ...task,
      assignmentKey: task.assignmentKey.replace('_Student_', '_Assistant_'),
      code: AssignmentCode.MM_AssistantOnly,
      elderOnly: false,
      requiresAssistant: false,
    };

    availableAssistants = persons.filter((potentialAssistant) => {
      const assistantAllowedUIDs = eligibilityMapView?.get(
        AssignmentCode.MM_AssistantOnly
      );
      return isCandidateValid(
        potentialAssistant,
        mockAssistantTask,
        assistantAllowedUIDs,
        undefined,
        cleanHistory
      );
    });
  }
  // -----------------------------------------------------------------------------
  return persons.filter((p) => {
    const valid = isCandidateValid(
      p,
      task,
      allowedUIDs,
      studentPerson,
      cleanHistory
    );

    if (!valid) return false;

    if (isStudentTask && task.requiresAssistant) {
      const hasValidAssistant = availableAssistants.some((assistant) => {
        return (
          assistant.person_uid !== p.person_uid &&
          isValidAssistantForStudent(p, assistant)
        );
      });

      if (!hasValidAssistant) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Converts symposium speaker permissions (`WM_SpeakerSymposium`) to standard
 * speaker permissions (`WM_Speaker`) for persons who are symposium speakers in
 * the active data view.
 *
 * The function first checks the assignment entry for the provided `dataView`
 * and records the UID of each person who has `WM_SpeakerSymposium` there.
 * For those persons, it then normalizes `person.person_data.assignments`
 * across all views by replacing `WM_SpeakerSymposium` with `WM_Speaker`
 * and removing duplicates in each assignment entry.
 *
 * Purpose:
 * - Keeps `symposiumSpeakerUIDs` limited to the active view for later
 *   `WM_Speaker_Part2` handling.
 * - Normalizes cloned assignment values across all views so cross-view
 *   weighting and scoring use consistent speaker codes.
 *
 * Side effect:
 * - Mutates `person.person_data.assignments` in place.
 *
 * @param persons - Full congregation person list; matching assignment entries are mutated.
 * @param dataView - Active data view used to detect which persons are symposium speakers.
 * @returns Set of person UIDs that had `WM_SpeakerSymposium` in the active data view.
 */
export const changeSymposiumToNormalSpeaker = (
  persons: PersonType[],
  dataView: string
): Set<string> => {
  const symposiumSpeakerUIDs = new Set<string>();

  persons.forEach((person) => {
    const activeViewEntry = person.person_data.assignments.find(
      (entry) => entry.type === dataView
    );

    const hasSymposiumInActiveView =
      activeViewEntry?.values.includes(AssignmentCode.WM_SpeakerSymposium) ??
      false;

    if (!hasSymposiumInActiveView) return;

    symposiumSpeakerUIDs.add(person.person_uid);

    person.person_data.assignments.forEach((assignmentEntry) => {
      assignmentEntry.values = assignmentEntry.values.map((code) =>
        code === AssignmentCode.WM_SpeakerSymposium
          ? AssignmentCode.WM_Speaker
          : code
      );

      assignmentEntry.values = Array.from(new Set(assignmentEntry.values));
    });
  });

  return symposiumSpeakerUIDs;
};

/**
 * Converts **all** `WM_SpeakerSymposium` assignments to standard `WM_Speaker` in assignment **history**.
 *
 * This **batch downgrade** function scans the complete `AssignmentHistoryType[]` and **mutates** every entry
 * where `entry.assignment.code === WM_SpeakerSymposium` (121) to `WM_Speaker` (120).
 *
 * **Use Case:** While autofill equal handling of symposium speakers and normal speakers is easier
 *
 * **Side Effects:**
 * - **Mutates input array** in-place (no return value)
 * - No data loss (both codes qualify for Part 1)
 * - No filtering (affects **all weeks/dataViews**)
 *
 * **Companion:** Works with `changeSymposiumToNormalSpeaker()` (preferences) for complete normalization.
 *
 * @param history - Assignment history array to mutate (all symposium entries downgraded)
 */
export const changeSymposiumSpeakerToNormalSpeakerHistory = (
  history: AssignmentHistoryType[]
) => {
  history.forEach((entry) => {
    if (entry.assignment.code === AssignmentCode.WM_SpeakerSymposium) {
      entry.assignment.code = AssignmentCode.WM_Speaker;
    }
  });
};

/**
 * Automatically grants assistant eligibility to persons who are assigned to student tasks.
 *
 * This function iterates through a list of persons and their respective assignments.
 * If a person has at least one student task code (defined by `STUDENTTASKCODES`)
 * but does not currently have the explicit assistant code (`MM_AssistantOnly`),
 * the assistant code is appended to their assignment values.
 *
 * Note: This function modifies the provided `persons` array in-place.
 *
 * @param {PersonType[]} persons - The list of persons whose assignments will be evaluated and updated.
 */
export const addImplicitAssistantEligibility = (persons: PersonType[]) => {
  persons.forEach((person) => {
    person.person_data.assignments.forEach((assignmentEntry) => {
      const values = assignmentEntry.values ?? [];
      const hasStudentTask = values.some((code) =>
        STUDENT_TASK_CODES.includes(code)
      );

      if (hasStudentTask && !values.includes(AssignmentCode.MM_AssistantOnly)) {
        assignmentEntry.values = [...values, AssignmentCode.MM_AssistantOnly];
      }
    });
  });
};

//MARK: MAIN FUNCTION
/**
 * Orchestrates the **2-Round Weighted Distribution** autofill algorithm for dynamic assignments.
 *
 * **Complete Workflow:**
 * 1. **Data Cloning** + **Symposium Normalization** (`121→120`)
 * 2. **4-Month Stats** (`getAssignmentsWithStats`) → `personsMetrics` → `weightingMetrics`
 * 3. **Task Pipeline:** `getTasksArray` → `getSortedTasks` (Fixed > Scarcity > Linked)
 * 4. **Round 1 (default):** `processingTasks(..., 'default')` → `targetTaskCounts`
 * 5. **Round 2 Prep:** `deleteTasksFromHistory()` → `adjustTasksSortIndex(newCandidatesPool)`
 * 6. **Round 2 (alternative):** `processingTasks(..., 'alternative', targetTaskCounts)`
 *
 * **Key Insights:**
 * - **Per-week processing** (`weekOfs` loop)
 * - **Immediate history updates** for conflict detection
 * - **Quota-driven Round 2** improves assignment distribution
 *
 * @param start - Planning period start (ISO)
 * @param end - Planning period end (ISO)
 * @param languageGroups - Active data views determination
 * @param meeting_type - `'midweek'` | `'weekend'`
 * @returns `{modifiedWeeks, updatedSchedules}` for bulk update
 */
export const handleDynamicAssignmentAutofill = (
  start: string,
  end: string,
  languageGroups: FieldServiceGroupType[],
  meeting_type: MeetingType
): {
  modifiedWeeks: SchedWeekType[];
  updatedSchedules: SchedWeekType[];
} => {
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

  const relevantViews = getDataViewsWithMeetings(settings, languageGroups);
  const weeksList = schedules.filter(
    (record) => record.weekOf >= start && record.weekOf <= end
  );

  if (weeksList.length === 0) {
    return {
      modifiedWeeks: [],
      updatedSchedules: schedules,
    };
  }
  //it is simpler to handle symposium speaker as normal speakers and just add the second speaker at the end if needed
  const symposiumSpeakerUIDs = changeSymposiumToNormalSpeaker(
    persons,
    dataView
  );
  changeSymposiumSpeakerToNormalSpeakerHistory(fullHistory);

  addImplicitAssistantEligibility(persons);

  // getting fixed and linked assignments from settings
  const checkAssignmentsSettingsResult = processAssignmentSettings(
    settings,
    isPublicTalkCoordinator
  );
  const fixedAssignmentsByCode = buildFixedAssignmentsByCode(
    checkAssignmentsSettingsResult.fixedAssignments
  );
  const startDateObj = new Date(start);
  const statsStartDateObj = subMonths(startDateObj, 4);
  const statsStartStr = format(statsStartDateObj, 'yyyy/MM/dd');

  const statsSchedules = schedules.filter(
    (record) => record.weekOf >= statsStartStr && record.weekOf <= end
  );

  const statsSources = sources.filter(
    (record) => record.weekOf >= statsStartStr && record.weekOf <= end
  );

  // Call statistics function with the FILTERED 4-month window
  const assignmentsMetrics = getAssignmentsWithStats(
    persons,
    statsSources,
    statsSchedules,
    settings,
    languageGroups,
    sourceLocale
  );

  const personsMetrics = getPersonsAssignmentMetrics(
    persons,
    relevantViews,
    assignmentsMetrics,
    fixedAssignmentsByCode
  );

  const weightingMetrics = getPersonsWeightingMetrics(
    persons,
    personsMetrics,
    assignmentsMetrics
  );

  const eligibilityMapView =
    getEligiblePersonsPerDataViewAndCode(persons).get(dataView) ??
    new Map<AssignmentCode, Set<string>>();

  // Collection array for all tasks to be planned in the given schedule weeks

  const unsortedTasks = [
    ...getTasksArray(
      weeksList,
      sources,
      checkAssignmentsSettingsResult.ignoredKeysByDataView[dataView] || [],
      dataView,
      lang,
      sourceLocale,
      settings,
      meeting_type,
      fullHistory,
      persons,
      eligibilityMapView,
      checkAssignmentsSettingsResult
    ),
  ];

  const weekOfs = [...new Set(weeksList.map((w) => w.weekOf))];
  const tasks = getSortedTasks(unsortedTasks, checkAssignmentsSettingsResult);

  //TASKS-ITERATION

  for (const weekOf of weekOfs) {
    const weekTasks = tasks.filter((t) => t.schedule.weekOf === weekOf);

    // 1. round
    const targetTaskCounts = processingTasks(
      weekTasks,
      checkAssignmentsSettingsResult,
      fullHistory,
      persons,
      dataView,
      eligibilityMapView,
      personsMetrics,
      weightingMetrics,
      assignmentsMetrics,
      symposiumSpeakerUIDs,
      'default'
    );

    const newCandidatesPool: PersonType[] = [];
    targetTaskCounts.forEach((value, key) => {
      const person = persons.find((p) => p.person_uid === key);
      if (person) {
        newCandidatesPool.push(person);
      }
    });

    // 2. Cleanup and preparation for round 2
    // Speaker and symposium speaker are not reassigned,
    // as otherwise someone who is a symposium speaker could be assigned as a regular speaker,
    // requiring an additional speaker

    deleteTasksFromHistory(weekTasks, fullHistory);

    adjustTasksSortIndex(weekTasks, newCandidatesPool, eligibilityMapView);

    // Second round for optimizing tasks distribution
    processingTasks(
      weekTasks,
      checkAssignmentsSettingsResult,
      fullHistory,
      persons,
      dataView,
      eligibilityMapView,
      personsMetrics,
      weightingMetrics,
      assignmentsMetrics,
      symposiumSpeakerUIDs,
      'alternative',
      targetTaskCounts
    );
  }

  return {
    modifiedWeeks: weeksList,
    updatedSchedules: schedules,
  };
};

/**
 * **Round 2 Preparation:** Deletes autofill Round 1 assignments to enable quota-optimized re-assignment.
 *
 * **Dual Cleanup:**
 * 1. **History:** Removes matching `AssignmentHistoryType` entries (`weekOf` + `dataView` + `key`)
 * 2. **Schedules:** Clears `schedulesGetData()` fields (`value = ''`, `updatedAt` refresh)
 *
 * **Purpose:** Between Round 1 (`default`) and Round 2 (`alternative`), resets state so:
 * - Conflict checks has clean slate
 *
 * **Side Effects:** Mutates `assignmentHistory[]` + `schedule objects` in-place!
 *
 * @param tasksToDelete - Round 1 tasks to remove from history/schedules
 * @param assignmentHistory - Global history array (mutated)
 */
export const deleteTasksFromHistory = (
  tasksToDelete: AssignmentTask[],
  assignmentHistory: AssignmentHistoryType[]
) => {
  const entriesToDelete = assignmentHistory.filter((e) =>
    tasksToDelete.some(
      (task) =>
        task.schedule.weekOf === e.weekOf &&
        task.dataView === e.assignment.dataView &&
        task.assignmentKey === e.assignment.key
    )
  );

  if (entriesToDelete.length > 0) {
    entriesToDelete.forEach((entry) => {
      // running metrics

      const idx = assignmentHistory.indexOf(entry);
      if (idx !== -1) assignmentHistory.splice(idx, 1);
    });
  }

  // 2. Clean up schedule objects
  tasksToDelete.forEach((task) => {
    const path = ASSIGNMENT_PATH[task.assignmentKey as AssignmentFieldType];

    const fieldToUpdate = schedulesGetData(task.schedule, path);

    if (Array.isArray(fieldToUpdate)) {
      const assigned = fieldToUpdate.find(
        (record) => record.type === task.dataView
      );
      if (assigned) {
        assigned.value = '';
        assigned.updatedAt = new Date().toISOString();
      }
    } else if (fieldToUpdate) {
      fieldToUpdate.value = '';
      fieldToUpdate.updatedAt = new Date().toISOString();
    }
  });
};
export const adjustTasksSortIndex = (
  tasks: AssignmentTask[],
  persons: PersonType[],
  eligibilityMapView: Map<AssignmentCode, Set<string>>
) => {
  tasks.forEach((element) => {
    const eligibleUIDs = eligibilityMapView.get(element.code) ?? new Set();
    const eligiblePersons = persons.filter((person) =>
      eligibleUIDs.has(person.person_uid)
    );
    element.sortIndex = eligiblePersons.length;
  });
};

/**
 * **Core Assignment Engine:** Fills tasks using **strategy-aware candidate selection**.
 *
 * Executes the **single-round processing** within the 2-round autofill architecture:
 *
 * **Workflow:**
 * 1. **Task Sorting:** `getSortedTasks()` (Fixed → Scarcity → Linked)
 * 2. **Speaker Part 2 Skip:** `checkSpeaker2Necessary()` guard
 * 3. **Candidate Filtering:** `filterCandidates()` (eligibility + conflicts)
 * 4. **Round-Specific Logic:**
 *    - **Round 1 (`default`):** All eligible candidates
 *    - **Round 2 (`alternative` + `targetCounts`):** **Quota enforcement**
 *      ```
 *      currentCount < targetCounts[personUID]  // Weekly meeting quota
 *      ```
 *      **Fallback:** If no candidates remain → disable quota, use `'default'` strategy
 * 5. **Best Candidate:** `sortCandidatesMultiLevel(finalCandidates, strategy)`
 * 6. **Assignment:** `schedulesAutofillSaveAssignment()` → updates history + schedules
 * 7. **Tracking:** Returns `Map<personUID, assignmentCount>` for quota calculation
 *
 * **Key Features:**
 * - **Immediate history updates** → real-time conflict detection
 * - **Quota-aware Round 2** with intelligent fallback
 * - **Symposium-aware** Speaker Part 2 handling
 *
 * @param tasks - Tasks to process for this round
 * @param sortStrategy - `'default'` (Round 1) | `'alternative'` (Round 2)
 * @param targetCounts - (Round 2 only) `Map<personUID, maxAssignments>`
 * @returns `Map<personUID, assignmentsReceived>` for Round 2 quota planning
 */
const processingTasks = (
  tasks: AssignmentTask[],
  checkAssignmentsSettingsResult: AssignmentSettingsResult,
  fullHistory: AssignmentHistoryType[],
  persons: PersonType[],
  dataView: DataViewKey,
  eligibilityMapView: Map<AssignmentCode, Set<string>>,
  personsMetrics: personsAssignmentMetrics,
  weightingMetrics: personsWeightingMetrics,
  assignmentsMetrics: AssignmentStatisticsComplete,
  symposiumSpeakerUIDs: Set<string>,
  sortStrategy: 'default' | 'alternative' = 'default',
  targetCounts?: Map<string, number>
): Map<string, number> => {
  const sortedTasks = getSortedTasks(tasks, checkAssignmentsSettingsResult);
  const assignedPersons = new Map<string, number>();

  for (const task of sortedTasks) {
    if (
      task.assignmentKey === 'WM_Speaker_Part2' &&
      !checkSpeaker2Necessary(
        fullHistory,
        symposiumSpeakerUIDs,
        dataView,
        task.schedule.weekOf
      )
    ) {
      continue;
    }

    const candidates = filterCandidates(
      persons,
      task,
      fullHistory,
      eligibilityMapView,
      checkAssignmentsSettingsResult
    );

    let finalCandidates = candidates;
    let currentSortStrategy = sortStrategy;

    // NEU: Quoten-Check für die zweite Runde (alternative)
    if (targetCounts) {
      const taskPrefix = task.assignmentKey.substring(0, 3); // "MM_" oder "WM_"

      finalCandidates = candidates.filter((p) => {
        // How many tasks has this person already received this week in this meeting?
        const currentCount = fullHistory.filter(
          (e) =>
            e.weekOf === task.schedule.weekOf &&
            e.assignment.dataView === dataView &&
            e.assignment.person === p.person_uid &&
            e.assignment.key?.startsWith(taskPrefix)
        ).length;

        const allowedCount = targetCounts.get(p.person_uid) || 0;
        return currentCount < allowedCount; // Only allow if quota has not yet been reached
      });

      // IMPORTANT FALLBACK: If no one is left due to the strict limit,
      //  we lift the limit so the task doesn't remain empty.
      if (finalCandidates.length === 0) {
        finalCandidates = candidates;
        currentSortStrategy = 'default';
      }
    }

    const selectedPerson = sortCandidatesMultiLevel(
      finalCandidates,
      task,
      fullHistory,
      personsMetrics,
      weightingMetrics,
      assignmentsMetrics.get('total'),
      currentSortStrategy
    )[0];

    if (selectedPerson) {
      schedulesAutofillSaveAssignment({
        schedule: task.schedule,
        assignment: task.assignmentKey as AssignmentFieldType,
        value: selectedPerson,
        history: fullHistory,
      });

      // Count assignment for the return value
      const uid = selectedPerson.person_uid;
      assignedPersons.set(uid, (assignedPersons.get(uid) || 0) + 1);
    }
  }

  return assignedPersons;
};

//MARK: schedulesStartAutofill
/**
 * Starts the assignment autofill process for schedules within the given date range and meeting type.
 *
 * Validates input dates, runs the dynamic autofill, persists any modified weeks in bulk, updates the
 * in-memory schedules state, rebuilds and stores the full assignments history, and finally triggers
 * a debug CSV download.
 *
 * @param start - Start of the date range (inclusive). Expected to be a non-empty date string.
 * @param end - End of the date range (inclusive). Expected to be a non-empty date string.
 * @param meeting - Which meeting schedule to autofill ("midweek" or "weekend").
 * @param languageGroups - Language group configurations to include in the autofill run.
 * @returns A promise that resolves when updates are persisted and state is refreshed; returns early if
 * input is invalid or no weeks were modified.
 * @throws Error if the autofill fails; the thrown error message is prefixed with "autofill error:".
 */
export const schedulesStartAutofill = async (
  start: string,
  end: string,
  meeting: 'midweek' | 'weekend',
  languageGroups: FieldServiceGroupType[]
) => {
  try {
    if (start.length === 0 || end.length === 0) return;

    const { modifiedWeeks, updatedSchedules } = handleDynamicAssignmentAutofill(
      start,
      end,
      languageGroups,
      meeting
    );

    if (!modifiedWeeks || modifiedWeeks.length === 0) return;

    await dbSchedBulkUpdate(modifiedWeeks);

    store.set(schedulesState, updatedSchedules);

    const newFullHistory = schedulesBuildHistoryList();
    store.set(assignmentsHistoryState, newFullHistory);
  } catch (error) {
    throw new Error(
      `autofill error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
