//// services/app/assignments_with_stats.ts
import {
  STUDENT_ASSIGNMENT,
  WEEK_TYPE_ASSIGNMENT_CODES,
} from '@constants/index';
import { AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import {
  AssignmentCode,
  MM_ASSIGNMENT_CODES,
  WM_ASSIGNMENT_CODES,
} from '@definition/assignment';
import { STUDENT_TASK_CODES } from '@constants/assignmentConflicts';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { Week } from '@definition/week_type';
import { FieldServiceGroupType } from '@definition/field_service_groups';

/**
 * Returns a Set of `dataView` identifiers that have meetings enabled and available.
 *
 * This function always includes the default view `'main'` and, if language groups are enabled in settings,
 * adds the `group_id` of each non-deleted language group that has either a midweek or weekend meeting configured. [conversation_history:1]
 *
 * Key Details:
 * - **Default View:** Always includes `'main'`. [conversation_history:1]
 * - **Feature Flag:** Only evaluates `languageGroups` when `settings.cong_settings.language_groups.enabled` is true. [conversation_history:1]
 * - **Filters:** Ignores language groups marked as deleted (`g.group_data._deleted`). [conversation_history:1]
 * - **Meeting Check:** A language group is included when it has `midweek_meeting` or `weekend_meeting`. [conversation_history:1]
 *
 * @param settings - Congregation settings controlling whether language groups are enabled.
 * @param languageGroups - All configured field service language groups.
 * @returns A Set of view IDs (e.g., `'main'`, plus language-group `group_id`s that have meetings).
 */
export const getDataViewsWithMeetings = (
  settings: SettingsType,
  languageGroups: FieldServiceGroupType[]
): Set<DataViewKey> => {
  const relevantViews = new Set<DataViewKey>(['main']);

  if (!settings.cong_settings.language_groups?.enabled?.value) {
    return relevantViews;
  }
  languageGroups.forEach((g) => {
    const { _deleted, midweek_meeting, weekend_meeting } = g.group_data;

    if (_deleted) return;

    const hasMeetings = Boolean(midweek_meeting || weekend_meeting);

    if (hasMeetings) {
      relevantViews.add(g.group_id);
    }
  });

  return relevantViews;
};

/**
 * Gives back the language key for a specific view.
 *
 * This function extracts language configurations from the settings.
 *
 * Key Details:
 * - **Source:** Iterates over `settings.cong_settings.source_material.language`.
 *
 * @param settings - The global application settings containing language configurations.
 * @param view - The specific dataview
 * @returns language key, for example 'X' or 'E'
 */

export const getLanguageKey = (
  settings: SettingsType,
  view: DataViewKey
): string => {
  const langEntry = settings.cong_settings.source_material?.language.find(
    (l) => l.type === view
  );
  // Fallback auf 'x' oder einen Standardwert, falls nichts gefunden wird
  return langEntry ? langEntry.value : '';
};

/**
 * Creates a lookup map of eligible persons for each assignment code, grouped by data view.
 *
 * This function processes the list of persons to determine who is eligible for which task.
 * It builds a nested structure allowing quick access to the set of candidate UIDs for any given
 * assignment code within a specific data view.
 *
 * Key Logic:
 * - **Filtering:** Skips persons who are deleted, archived, or disqualified.
 * - **Implicit Assistant Eligibility:** If a person is assigned a student task code (e.g., Bible Reading, Talk),
 * they are automatically added to the pool of eligible assistants (`MM_AssistantOnly`),
 * even if they don't have that specific code explicitly assigned.
 *
 * @param persons - The list of all persons to process.
 * @returns A nested object where the first key is the `dataView` (e.g., 'main'), the second key is the `AssignmentCode` (number),
 * and the value is a `Set` of person UIDs eligible for that task.
 */
export const getEligiblePersonsPerDataViewAndCode = (
  persons: PersonType[]
): Map<DataViewKey, Map<AssignmentCode, Set<string>>> => {
  // Key 1: DataView (string), Key 2: Code (number), Value: Set<UID>
  const map = new Map<DataViewKey, Map<AssignmentCode, Set<string>>>();

  // Define code for assistant (129)
  const ASSISTANT_CODE = AssignmentCode.MM_AssistantOnly;

  persons.forEach((person) => {
    // 1. Filter: Person must exist and be active
    const isDeleted = person._deleted.value;
    const isArchived = person.person_data.archived.value;
    const isDisqualified = person.person_data.disqualified.value;

    if (isDeleted || isArchived || isDisqualified) {
      return;
    }

    const uid = person.person_uid;

    // 2. Iterate all assignments of person
    person.person_data.assignments.forEach((assignment) => {
      const viewType = assignment.type;

      if (Array.isArray(assignment.values)) {
        assignment.values.forEach((code) => {
          // A) Helper function to add to map
          const addToMap = (code: AssignmentCode) => {
            let innerMap = map.get(viewType);
            if (!innerMap) {
              innerMap = new Map<AssignmentCode, Set<string>>();
              map.set(viewType, innerMap);
            }
            let codeSet = innerMap.get(code);
            if (!codeSet) {
              codeSet = new Set<string>();
              innerMap.set(code, codeSet);
            }
            codeSet.add(uid);
          };

          // B) Add actual code (e.g. Bible Reading)
          addToMap(code);

          // C) SPECIAL LOGIC: Implicit Assistant Eligibility
          // If code belongs to student tasks (e.g. Reading, Talk),
          // then person can automatically be assistant too.
          if (STUDENT_TASK_CODES.includes(code)) {
            // We add person additionally to assistant pool
            addToMap(ASSISTANT_CODE);
          }
        });
      }
    });
  });

  return map;
};

/**
 * Determines the validity status of the Midweek and Weekend meetings for a specific data view.
 *
 * Checks whether the configured week type represents a valid state for processing (e.g., for statistics).
 * A week is considered valid if:
 * - It is explicitly marked as no meeting (`Week.NO_MEETING`). That helps to get the right statistics in case of language groups that don't have a meeting every week.
 * - It is a week type (e.g., CO Visit) that has allowed assignment codes defined in `WEEK_TYPE_ASSIGNMENT_CODES`.
 *
 * @param weekSchedule - The schedule object for the week containing meeting types.
 * @param view - The specific data view (e.g., 'main' or language group) to check.
 * @returns An object containing boolean flags (`mmIsValid`, `wmIsValid`) indicating if the meetings are valid.
 */
const getWeekStatsInclusion = (
  weekSchedule: SchedWeekType,
  view: DataViewKey
): { mmIsValid: boolean; wmIsValid: boolean } => {
  // 1. Get Midweek Type
  const mmWeekTypeObj = weekSchedule.midweek_meeting.week_type.find(
    (s) => s.type === view
  );
  const mmWeekType = mmWeekTypeObj ? mmWeekTypeObj.value : Week.NORMAL;

  const mmCodes = WEEK_TYPE_ASSIGNMENT_CODES.get(mmWeekType);

  //counting of NO_Meeting is on purpose, because it helps to get the right statistics in case of language groups that don't have a meeting every week
  const mmIsValid =
    mmWeekType === Week.NO_MEETING || (mmCodes ? mmCodes.size > 0 : false);

  // 2. Get Weekend Type
  const wmWeekTypeObj = weekSchedule.weekend_meeting.week_type.find(
    (s) => s.type === view
  );
  const wmWeekType = wmWeekTypeObj ? wmWeekTypeObj.value : Week.NORMAL;

  const wmCodes = WEEK_TYPE_ASSIGNMENT_CODES.get(wmWeekType);
  const wmIsValid =
    wmWeekType === Week.NO_MEETING || (wmCodes ? wmCodes.size > 0 : false);

  return { mmIsValid, wmIsValid };
};

/**
 * Counts the occurrences of variable meeting parts (AYF and Living as Christians) across multiple weeks.
 *
 * This function analyzes source data from multiple weeks to determine how often specific assignment codes appear.
 * It iterates through all provided weeks and counts:
 * - **AYF Parts (1-4):** Extracts the assignment type based on the provided language key.
 * - **Living as Christians (LC):** Counts parts that have a valid, non-empty title.
 *
 * The function accumulates counts across all weeks, so the returned map contains the total occurrences
 * of each assignment code across the entire time period.
 *
 * @param sources - Array of source data objects for multiple weeks to analyze.
 * @param langKey - The language key (e.g., 'x' or 'e') used to retrieve the assignment code from the source.
 * @param view - The specific view (e.g., 'main') needed to find the correct local needs (LC Part 3) title.
 * @returns A Map linking `AssignmentCode` (number) to its total count across all analyzed weeks.
 */
const getVariableAssignmentsCount = (
  sources: SourceWeekType[],
  settings: SettingsType,
  langKey: string,
  view: DataViewKey
): Map<AssignmentCode, number> => {
  const classCount =
    settings.cong_settings.midweek_meeting?.find((s) => s.type === view)
      ?.class_count.value || 1;

  const variableAssignmentCounts = new Map<AssignmentCode, number>();
  sources.forEach((weekSource) => {
    //counting variable count midweek assignments
    const mm = weekSource.midweek_meeting;

    // counting ayfParts
    const ayfParts = [mm.ayf_part1, mm.ayf_part2, mm.ayf_part3, mm.ayf_part4];
    ayfParts.forEach((part) => {
      if (part && part.type && part.type[langKey]) {
        const code = part.type[langKey];
        if (typeof code === 'number') {
          variableAssignmentCounts.set(
            code,
            (variableAssignmentCounts.get(code) || 0) + classCount
          );
        }
      }
    });

    // LC Parts Logic
    const lcTitles = [
      mm.lc_part1?.title?.default?.[langKey],
      mm.lc_part2?.title?.default?.[langKey],
      mm.lc_part3?.title?.find((t) => t.type === view)?.value || '',
    ];

    for (const lcTitle of lcTitles) {
      if (lcTitle && typeof lcTitle === 'string' && lcTitle.trim() !== '') {
        variableAssignmentCounts.set(
          AssignmentCode.MM_LCPart,
          (variableAssignmentCounts.get(AssignmentCode.MM_LCPart) || 0) + 1
        );
      }
    }
  });

  return variableAssignmentCounts;
};
/**
 * Calculates the accumulated "correction counts" for assignments displaced by special events across multiple weeks.
 *
 * In special weeks (e.g., CO Visit, Assemblies), standard assignments might not take place.
 * This function iterates through the provided list of schedules and aggregates how often
 * specific standard assignments were skipped due to the week type.
 *
 * Logic:
 * 1. Iterates through all provided weeks in `schedules`.
 * 2. Checks if the Midweek or Weekend meeting is a special week type (not `Week.NORMAL`).
 * 3. If special, compares standard codes against allowed codes for that type.
 * 4. Accumulates the count of missing standard codes in the return map.
 *
 * @param schedules - Array of schedule objects to analyze.
 * @param view - The data view (e.g., 'main') to check.
 * @returns A Map where the key is the `AssignmentCode` and the value is the total count to be subtracted from statistics.
 */
const getCorrectionCounts = (
  schedules: SchedWeekType[],
  view: DataViewKey
): Map<number, number> => {
  const correctionCount = new Map<number, number>();

  const EMPTY_SET = new Set<number>();

  for (const weekSchedule of schedules) {
    const mmWeekTypeObj = weekSchedule.midweek_meeting.week_type.find(
      (s) => s.type === view
    );
    const mmWeekType = mmWeekTypeObj ? mmWeekTypeObj.value : Week.NORMAL;

    const wmWeekTypeObj = weekSchedule.weekend_meeting.week_type.find(
      (s) => s.type === view
    );
    const wmWeekType = wmWeekTypeObj ? wmWeekTypeObj.value : Week.NORMAL;

    if (mmWeekType === Week.NORMAL && wmWeekType === Week.NORMAL) continue;

    if (mmWeekType !== Week.NORMAL) {
      const availableCodes =
        WEEK_TYPE_ASSIGNMENT_CODES.get(mmWeekType) || EMPTY_SET;

      MM_ASSIGNMENT_CODES.forEach((c) => {
        if (!availableCodes.has(c)) {
          correctionCount.set(c, (correctionCount.get(c) || 0) + 1);
        }
      });
    }

    if (wmWeekType !== Week.NORMAL) {
      const availableCodes =
        WEEK_TYPE_ASSIGNMENT_CODES.get(wmWeekType) || EMPTY_SET;

      WM_ASSIGNMENT_CODES.forEach((c) => {
        if (!availableCodes.has(c)) {
          correctionCount.set(c, (correctionCount.get(c) || 0) + 1);
        }
      });
    }
  }

  return correctionCount;
};

/**
 * Calculates the default *theoretical* weekly frequency for each assignment code based on congregation settings.
 *
 * This function determines the baseline frequency (how often per week) each assignment code would occur
 * based on the stored configuration.
 *
 * **Note:** This function does NOT check if the meeting is globally disabled/deleted.
 * It assumes the meeting is active if settings exist. The caller is responsible for checking the active status.
 *
 * Logic factors:
 * - **Prayer Assignments:** Adjusts frequency based on linked prayer settings (e.g. opening/closing prayers linked to other assignments).
 * - **Class Count:** Doubles frequency for Bible Reading and student assignments when two classes are configured.
 * - **Excluded Codes:** Skips certain codes (e.g., Ministry Hours Credit, Assistant Only) that are handled separately.
 *
 * @param settings - The global application settings containing meeting configurations.
 * @param view - The specific data view (e.g., 'main') to calculate frequencies for.
 * @returns A Map linking each `AssignmentCode` to its configured weekly frequency (typically 1 or 2).
 */
const getDefaultAssignmentsFrequency = (
  settings: SettingsType,
  view: DataViewKey
): Map<AssignmentCode, number> => {
  const allCodes = [...MM_ASSIGNMENT_CODES, ...WM_ASSIGNMENT_CODES];
  const EXCLUDED_CODES = [
    AssignmentCode.MINISTRY_HOURS_CREDIT,
    AssignmentCode.MM_AssistantOnly,
  ];
  const statsForView = new Map<AssignmentCode, number>();
  const cong_settings = settings.cong_settings;

  const mm_Settings = cong_settings.midweek_meeting?.find(
    (s) => s.type === view
  );
  const wm_Settings = cong_settings.weekend_meeting?.find(
    (s) => s.type === view
  );

  const classCount = mm_Settings?.class_count.value || 1;
  const mmOpenPrayerLinked =
    !!mm_Settings?.opening_prayer_linked_assignment.value;
  const mmClosePrayerLinked =
    !!mm_Settings?.closing_prayer_linked_assignment.value;
  const wmOpenPrayerAuto = !!wm_Settings?.opening_prayer_auto_assigned.value;

  allCodes.forEach((code) => {
    if (EXCLUDED_CODES.includes(code)) return;

    let frequency = 0;

    const isMM = MM_ASSIGNMENT_CODES.includes(code);
    const isWM = WM_ASSIGNMENT_CODES.includes(code);

    const hasSettings = (isMM && mm_Settings) || (isWM && wm_Settings);

    if (hasSettings) {
      if (code === AssignmentCode.MM_Prayer) {
        let count = 2;
        if (mmOpenPrayerLinked) count--;
        if (mmClosePrayerLinked) count--;
        frequency = count;
      } else if (code === AssignmentCode.WM_Prayer) {
        frequency = wmOpenPrayerAuto ? 1 : 2;
      } else {
        frequency = 1;
      }

      if (classCount === 2) {
        if (
          [AssignmentCode.MM_BibleReading, ...STUDENT_ASSIGNMENT].includes(code)
        ) {
          frequency *= 2;
        }
      }
    }

    statsForView.set(code, frequency);
  });

  return statsForView;
};

/**
 * Counts the number of valid weeks for Midweek and Weekend meetings in the given schedules.
 *
 * This function iterates through all schedules and determines how many weeks are considered valid
 * for statistics calculation. A week is valid if it meets the criteria defined in `getWeekStatsInclusion`:
 * - It is marked as `Week.NO_MEETING` (helps with language groups that don't meet every week).
 * - It is a week type (e.g., CO Visit) that has allowed assignment codes defined.
 *
 * @param schedules - Array of schedule objects for the weeks to analyze.
 * @param view - The specific data view (e.g., 'main' or language group) to count weeks for.
 * @returns An object containing:
 * - `mmValidWeeksCount`: The number of valid Midweek Meeting weeks.
 * - `wmValidWeeksCount`: The number of valid Weekend Meeting weeks.
 */
const getWeeksCount = (
  schedules: SchedWeekType[],
  view: DataViewKey
): { mmValidWeeksCount: number; wmValidWeeksCount: number } => {
  // Initialize counter
  let mmValidWeeksCount: number = 0;
  let wmValidWeeksCount: number = 0;

  //Analyze (AYF & LC)
  schedules.forEach((weekSchedule) => {
    //counting weeks
    const { mmIsValid, wmIsValid } = getWeekStatsInclusion(weekSchedule, view);
    if (mmIsValid) mmValidWeeksCount++;
    if (wmIsValid) wmValidWeeksCount++;
  });
  return { mmValidWeeksCount, wmValidWeeksCount };
};

export type DataViewKey = string;
export type AssignmentMetrics = {
  frequency: number;
  eligibleUIDS: Set<string>;
};

export type AssignmentStatisticsView = Map<AssignmentCode, AssignmentMetrics>;
export type AssignmentStatisticsComplete = Map<
  DataViewKey,
  AssignmentStatisticsView
>;

/**
 * Calculates the average weekly frequency for each assignment code based on historical source data and congregation settings.
 *
 * This function analyzes the provided `sourceWeeks` to determine how often specific tasks (e.g., AYF parts, LC parts, prayers)
 * actually occur. It takes the following factors into account:
 * - **Special Week Types:** Considers CO visits, conventions, etc., where standard tasks might be omitted.
 * - **Congregation Settings:** Respects class counts, linked prayer rules, and language groups.
 * - **DataViews:** Separates statistics for the main congregation and language groups.
 *
 * The function applies a "correction logic" to adjust frequencies for weeks where meetings took place
 * but specific tasks were displaced by special events.
 *
 * @param persons - The list of all persons in the congregation, used to determine eligible persons for each assignment code.
 * @param sourceWeeks - The historical source data containing details about meeting parts.
 * @param schedules - The schedule data defining the type of week (Normal, Special, etc.).
 * @param settings - Global settings (e.g., number of classes, rules for linked assignments).
 * @param languageGroups - Definitions of language groups to determine relevant data views.
 *
 * @returns A Map where the key is the `dataView` (e.g., 'main') and the value is another Map
 * linking the `AssignmentCode` to its calculated weekly frequency and eligible persons (e.g., 1.0 for weekly, 0.5 for every two weeks).
 */
export const getAssignmentsWithStats = (
  persons: PersonType[],
  sourceWeeks: SourceWeekType[],
  schedules: SchedWeekType[],
  settings: SettingsType,
  languageGroups: FieldServiceGroupType[]
): AssignmentStatisticsComplete => {
  const stats: AssignmentStatisticsComplete = new Map();
  const relevantViews = getDataViewsWithMeetings(settings, languageGroups);
  const eligiblePersonsAll = getEligiblePersonsPerDataViewAndCode(persons);

  relevantViews.forEach((view) => {
    const statsForView: AssignmentStatisticsView = new Map();
    const langKey = getLanguageKey(settings, view);
    const frequencyForView = getDefaultAssignmentsFrequency(settings, view);
    const variableAssignmentCounts = getVariableAssignmentsCount(
      sourceWeeks,
      settings,
      langKey,
      view
    );
    const corrections = getCorrectionCounts(schedules, view);
    const weeksCounts = getWeeksCount(schedules, view);

    const relevantGroup = languageGroups.find(
      (record) => record.group_id === view
    );

    const isMidweekActive = relevantGroup?.group_data.midweek_meeting ?? true;
    const isWeekendActive = relevantGroup?.group_data.weekend_meeting ?? true;

    frequencyForView.forEach((frequency, code) => {
      const mmCode = MM_ASSIGNMENT_CODES.includes(code); //
      const eligiblePersonsView = eligiblePersonsAll.get(view);

      if ((mmCode && !isMidweekActive) || (!mmCode && !isWeekendActive)) {
        statsForView.set(code, {
          frequency: 0,
          eligibleUIDS: eligiblePersonsView?.get(code) || new Set(),
        });
        return;
      }

      const relevantWeeksCount = mmCode
        ? weeksCounts.mmValidWeeksCount
        : weeksCounts.wmValidWeeksCount;

      const variableCount = variableAssignmentCounts.get(code);

      let variableFrequency = frequency;

      if (relevantWeeksCount > 0) {
        variableFrequency = variableCount
          ? variableCount / relevantWeeksCount
          : frequency;
      } else {
        variableFrequency = 0;
      }

      const correctionCount = corrections.get(code);

      const correctionFrequency =
        correctionCount && relevantWeeksCount > 0
          ? correctionCount / relevantWeeksCount
          : 0;

      const resultFrequency = Math.max(
        0,
        variableFrequency - correctionFrequency
      );

      statsForView.set(code, {
        frequency: resultFrequency,
        eligibleUIDS: eligiblePersonsView?.get(code) ?? new Set(),
      });
    });
    stats.set(view, statsForView);
  });

  return stats;
};

/**
 * Calculates the benchmark score representing the average workload per eligible person.
 *
 * This function computes a global benchmark by summing the frequencies of all relevant assignment codes
 * and dividing by the total number of unique persons eligible for those codes. The benchmark represents
 * the theoretical average number of assignments per person per week for the given set of codes.
 *
 * Key Details:
 * - **Eligible Persons:** Collects all unique person UIDs who are eligible for any of the relevant codes.
 * - **Frequency Sum:** Sums up the weekly frequencies of all relevant assignment codes across all data views.
 * - **Calculation:** Divides total frequency by the number of eligible persons to get the average.
 *
 * @param assignmentsMetrics - Complete statistics containing frequencies and eligible persons for all assignment codes.
 * @param relevantCodes - Array of assignment codes to include in the benchmark calculation.
 * @returns The benchmark score (average assignments per person per week) for the given codes.
 */
const calculateBenchmarkScore = (
  assignmentsMetrics: AssignmentStatisticsComplete,
  relevantCodes: AssignmentCode[]
): number => {
  const assignablePersonsSet = new Set<string>();
  let totalFrequencySum = 0;

  assignmentsMetrics.forEach((viewStatsMap) => {
    viewStatsMap.forEach((metrics, code) => {
      const isRelevant = relevantCodes.includes(code);

      if (isRelevant) {
        totalFrequencySum += metrics.frequency;

        metrics.eligibleUIDS?.forEach((uid) => {
          assignablePersonsSet.add(uid);
        });
      }
    });
  });

  const assignablePersonsCount = assignablePersonsSet.size;

  if (assignablePersonsCount === 0) return 0;

  const benchmarkScore = totalFrequencySum / assignablePersonsCount;

  return benchmarkScore;
};

/**
 * Calculates a weighting factor based on a single person's workload ratio.
 *
 * @param benchmarkScore - The global average workload score.
 * @param personScore - The individual workload score of the person.
 * @returns The calculated weighting factor (number).
 */
export const calculateWeightingFactor = (
  benchmarkScore: number,
  personScore: number
): number => {
  if (personScore === undefined || personScore === 0) return 1; // Default weighting
  const ratio = benchmarkScore / personScore;
  const weightingFactor = ratio <= 1 ? 1 : -2.5 / ratio + 3.5;
  // Formula creates a non-linear boost for low-load publishers.
  // The factor is capped asymptotically at 3.5 to prevent extreme prioritization. May be adjusted in future

  return weightingFactor;
};

/**
 * Calculates the minimum time distance to the target week for a group of assignment codes.
 *
 * This function finds the closest assignment (in time) from the specified codes for a given person.
 * It returns the smallest distance, meaning it finds when the person last performed any of the
 * specified assignment codes, regardless of whether it was in the past or future.
 *
 * Key Details:
 * - **Distance Calculation:** Uses absolute time difference (milliseconds) between target week and assignment week.
 * - **Assistant Filtering:** Automatically excludes assistant assignments (`MM_AssistantOnly`) from the calculation.
 * - **Return Value:** Returns `Infinity` if the person has never performed any of the specified codes.
 *
 * @param history - Array of all assignment history entries to search through.
 * @param personUid - The unique identifier of the person to check assignments for.
 * @param targetDateStr - The target week date string (e.g., '2024/01/15') to calculate distance from.
 * @param codesToCheck - Array of assignment codes to check, or `'ANY'` to check all codes (except assistants).
 * @returns The minimum time distance in milliseconds, or `Infinity` if no matching assignment was found.
 */
export const getMinDistanceForCodes = (
  history: AssignmentHistoryType[],
  personUid: string,
  targetDateStr: string,
  codesToCheck: number[] | 'ANY'
): number => {
  const targetTime = new Date(targetDateStr).getTime();
  let minDiff = Infinity;

  for (const entry of history) {
    // 1. Person Check
    if (entry.assignment.person !== personUid) continue;

    const entryCode = entry.assignment.code;

    // Assistant assignments should not influence time distance for main tasks.
    if (entryCode === AssignmentCode.MM_AssistantOnly) {
      continue;
    }

    const isRelevant =
      codesToCheck === 'ANY' ? true : codesToCheck.includes(entryCode);

    if (isRelevant) {
      const entryTime = new Date(entry.weekOf).getTime();
      const diff = Math.abs(entryTime - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
      }
    }
  }
  return minDiff;
};

export type personsAssignmentMetrics = {
  mm_globalScore: number;
  wm_globalScore: number;
  total_globalScore: number;
  weightingFactor: number;
};

/**
 * Calculates the "Opportunity Score" (theoretical workload/opportunity load) for a person.
 *
 * @param person - The person object to evaluate.
 * @param assignmentsMetrics - Complete statistics containing frequencies and eligible persons.
 *
 * @returns An object containing the accumulated scores (Midweek, Weekend, Total).
 */
export const calculateOpportunityScore = (
  person: PersonType,
  assignmentsMetrics: AssignmentStatisticsComplete
): {
  mm_globalScore: number;
  wm_globalScore: number;
  total_globalScore: number;
} => {
  let mm_globalScore = 0;
  let wm_globalScore = 0;

  // We iterate over ALL Views where person has tasks (e.g. 'main', 'spanish')
  person.person_data.assignments.forEach((assignmentsView) => {
    const currentViewKey = assignmentsView.type;

    // Get stats matching the respective View of the task
    const viewStatsMap = assignmentsMetrics.get(currentViewKey);
    // If no data exists for this View (e.g. Bug or old data), skip
    if (!viewStatsMap) return;

    // Iterate all codes in this View
    for (const code of assignmentsView.values) {
      const metrics = viewStatsMap.get(code);
      const freq = metrics?.frequency || 0;
      const eligCount = metrics?.eligibleUIDS.size || 0;

      if (freq === 0 || eligCount === 0) continue;

      const taskValue = freq / eligCount;

      if (MM_ASSIGNMENT_CODES.includes(code)) {
        mm_globalScore += taskValue;
      } else if (WM_ASSIGNMENT_CODES.includes(code)) {
        wm_globalScore += taskValue;
      }
    }
  });

  return {
    mm_globalScore,
    wm_globalScore,
    total_globalScore: mm_globalScore + wm_globalScore,
  };
};

/**
 * Aggregates assignment metrics for all provided persons by combining workload scores and weighting factors.
 *
 * This function iterates through each person to calculate:
 * 1. **Opportunity Score:** Their theoretical workload based on the scarcity of the tasks they are eligible for.
 * 2. **Weighting Factor:** A priority multiplier derived by comparing their personal score against the global `benchmarkScore`.
 *
 * The result is a lookup map used to quickly access all relevant sorting metrics for any candidate during the assignment process.
 *
 * @param persons - The list of all persons to process.
 * @param assignmentsMetrics - The consolidated statistical data (frequency and eligibility maps) required for score calculation.
 * @returns A Map linking `personUID` to their combined metrics (`mm_globalScore`, `total_globalScore`, `weightingFactor`, etc.).
 */
export const getPersonsAssignmentMetrics = (
  persons: PersonType[],
  assignmentsMetrics: AssignmentStatisticsComplete
): Map<string, personsAssignmentMetrics> => {
  const benchmarkScore = calculateBenchmarkScore(
    assignmentsMetrics,
    MM_ASSIGNMENT_CODES
  );
  const map = new Map<string, personsAssignmentMetrics>();
  persons.forEach((person) => {
    const personUID = person.person_uid;
    const opportunityScores = calculateOpportunityScore(
      person,
      assignmentsMetrics
    );
    const weightingFactor = calculateWeightingFactor(
      benchmarkScore,
      opportunityScores.total_globalScore
    );

    map.set(personUID, {
      mm_globalScore: opportunityScores.mm_globalScore,
      wm_globalScore: opportunityScores.wm_globalScore,
      total_globalScore: opportunityScores.total_globalScore,
      weightingFactor: weightingFactor,
    });
  });

  return map;
};
